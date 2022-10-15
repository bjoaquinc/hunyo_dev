<template>
  <div>
    <q-tabs
      v-model="tab"
      inline-label
      class="text-secondary q-mt-md"
      v-if="$q.platform.is.desktop"
    >
      <q-tab
        v-for="(category, index) in categories"
        :key="index"
        :label="category"
        :name="category"
        no-caps
      />
    </q-tabs>
    <q-select
      class="q-mx-md q-mt-md"
      filled
      v-model="tab"
      :options="categories"
      label="Category"
      v-else
    />
    <q-infinite-scroll class="constrain" @load="onLoad" :offset="250">
      <component
        v-for="(productItemsList, index) in productItemsLists"
        :key="index"
        :is="$q.platform.is.desktop ? 'ProductsListDesktop' : 'ProductsList'"
        :feedItems="productItemsList"
        feedLocation="user feed"
        class="bg-grey2"
      />
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
      <q-inner-loading :showing="showLoader">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-infinite-scroll>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import amplitude from "amplitude-js";
import ProductsListDesktop from "src/components/ProductsListDesktop.vue";
import ProductsList from "src/components/ProductsList.vue";

export default {
  components: {
    ProductsListDesktop,
    ProductsList,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const doneScrolling = ref(false);
    const q = useQuasar();
    const categories = ref([
      "All Categories",
      "Doors & Windows",
      "Roofing",
      "Lighting",
      "Solar",
      "Rugs & Carpets",
      "Bathroom",
    ]);
    const tab = ref("");
    const productItemsLists = computed(
      () => store.getters["products/getProductItemsLists"]
    );
    let lastVisible = null;
    const showLoader = ref(false);

    const logEvent = (name, data) => {
      try {
        amplitude.getInstance().logEventWithTimestamp(name, data);
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(async () => {
      let category = "All Categories";
      if (route.query.category) {
        category = route.query.category;
      }
      tab.value = category;
      if (!productItemsLists.value || !productItemsLists.value.length) {
        try {
          q.loading.show();
          const last = await store.dispatch(
            "products/setProductItems",
            category
          );
          lastVisible = last;
          q.loading.hide();
        } catch (error) {
          console.log(error);
          q.loading.hide();
        }
      }
    });

    const onLoad = async (index, done) => {
      if (lastVisible && !doneScrolling.value) {
        try {
          const last = await store.dispatch(
            "products/setNextProductItems",
            lastVisible
          );
          lastVisible = last;
          done();
        } catch (error) {
          console.log(error.message);
          if (error.message === "No products available") {
            doneScrolling.value = true;
            done();
          } else {
            done();
          }
        }
      } else {
        done();
      }
    };

    const setCategory = async (category) => {
      router.replace({ query: { category } });
    };

    watch(tab, (newValue, oldValue) => {
      console.log(newValue);
      setCategory(newValue);
    });

    watch(route, async (newValue, oldValue) => {
      if (route.name !== "ProductFeed") return;
      try {
        store.commit("products/clearProducts");
        showLoader.value = true;
        const category = route.query.category;
        console.log(category);
        const last = await store.dispatch("products/setProductItems", category);
        lastVisible = last;
        doneScrolling.value = false;
        showLoader.value = false;
      } catch (error) {
        console.log(error);
        showLoader.value = false;
      }
    });

    onBeforeRouteLeave(async (to, from) => {
      if (to.name !== "ProductDetail") {
        store.commit("products/clearProducts");
      } else {
        return true;
      }
    });

    return {
      categories,
      tab,
      productItemsLists,
      onLoad,
      setCategory,
      showLoader,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    padding-top: 21px
</style>

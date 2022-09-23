<template>
  <div>
    <!-- <div
      class="q-px-lg full-width flex column lt-sm"
      v-if="$q.platform.is.mobile && !$q.platform.is.ipad"
    >
      <q-select
        @blur="sendSelectTopicsEvent"
        v-model="topics"
        :rules="[
          (val) => val.length > 0 || 'At least one topic must be chosen.',
        ]"
        :options="options"
        multiple
        counter
        class="full-width"
        label="Topic(s) *"
        hint="You can pick more than one topic per post"
      />

      <q-input
        v-model="title"
        @blur="sendWriteTitleEvent"
        @focus="setTitle"
        :rules="[(val) => !!val || 'Title is required']"
        class="q-mx-none q-mt-sm"
        hint="Briefly describe the main idea of your post"
        label="Title *"
        placeholder="An example title on details here..."
      />
      <div class="q-gutter-sm q-mt-lg text-grey-7">
        <q-checkbox
          v-model="isQuestion"
          class="q-ma-none"
          label="Check if you are asking a question."
        />
      </div>
      <DialogSaveDraft />
    </div> -->
    <q-card
      bordered
      class="my-card absolute-center gt-xs"
      style="
        max-width: 700px;
        min-width: 50vw;
        max-height: 80vh;
        overflow: auto;
      "
    >
      <q-card-section class="flex q-pa-sm">
        <q-btn
          :to="{ name: 'SupplierProductCatalogue', params: { supplierId } }"
          icon="fas fa-times"
          dense
          flat
          round
        />
        <q-toolbar-title class="text-center">Create Product</q-toolbar-title>
        <div class="filler" />
      </q-card-section>
      <q-card-section>
        <q-select
          :rules="[
            (val) => val.length > 0 || 'At least one category must be chosen.',
          ]"
          :options="options"
          v-model="categories"
          multiple
          counter
          class="full-width"
          label="Categories *"
          hint="You can pick more than one category per product"
        />
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="name"
          :rules="[(val) => !!val || 'Name is required']"
          class="q-mx-none"
          label="Product Name *"
        />
      </q-card-section>

      <q-card-section class="row">
        <q-toolbar-title class="col-12">Overview</q-toolbar-title>
        <div
          v-for="(value, key) in overview"
          class="row col-12 text-subtitle1"
          :key="key"
        >
          <div class="col-2">{{ key }}</div>
          <strong>:</strong>
          <div class="col-5 q-ml-lg">{{ value }}</div>
          <div class="col-2 q-ml-auto flex justify-end items-start">
            <q-btn
              @click="removeOverview(key)"
              size="sm"
              icon="fas fa-edit"
              dense
              flat
              color="primary"
            />
            <q-btn
              @click="removeOverview(key)"
              class="q-ml-xs"
              icon="fas fa-times"
              size="sm"
              dense
              flat
              color="negative"
            />
          </div>
        </div>
        <div v-if="showOverviewInput" class="row col-12 q-mt-sm">
          <q-input
            autofocus
            @blur="hideOverviewInput"
            v-model="overviewKey"
            outlined
            class="q-mx-none col-3"
            label="Key"
          />
          <div class="q-my-auto text-h5 q-mx-auto">:</div>
          <q-input
            v-model="overviewValue"
            outlined
            class="q-mx-none q-ml-auto col-8"
            type="textarea"
            autogrow
            label="Value"
          >
            <template v-slot:after>
              <q-btn
                @click="addOverview"
                unelevated
                label="add"
                color="positive"
              />
            </template>
          </q-input>
        </div>
        <q-btn
          @click="showOverviewInput = true"
          v-else
          class="q-mt-sm q-pa-none"
          label="add entry"
          icon="fas fa-plus"
          color="positive"
          flat
          dense
        />
      </q-card-section>

      <q-card-section class="row">
        <q-toolbar-title class="col-12">More Information</q-toolbar-title>
        <q-input
          v-model="moreInformation"
          outlined
          class="q-mx-none q-mt-sm col-12"
          type="textarea"
          autogrow
          label="Add paragraph here"
        />
        <q-input
          v-model="website"
          outlined
          class="q-mx-none q-mt-sm col-12"
          autogrow
          label="Website"
        />
      </q-card-section>

      <q-card-actions class="q-px-md">
        <q-btn
          :loading="isUploading"
          :disable="disableNextButton"
          @click="createProductAndRoute"
          label="Next"
          color="primary"
          unelevated
          class="full-width q-mt-sm"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, onBeforeRouteLeave } from "vue-router";

export default {
  props: ["supplierId", "productId"],
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const supplier = computed(() => store.getters["suppliers/getSupplier"]);
    const options = ref([]);
    const product = computed(() => store.getters["products/getProduct"]);
    const unsubscribeProduct = computed(
      () => store.getters["products/getUnsubscribeProduct"]
    );
    const isUploading = ref(false);
    const categories = computed({
      get: () => store.getters["products/getCategories"],
      set: (value) => store.commit("products/setCategories", value),
    });
    const name = computed({
      get: () => store.getters["products/getName"],
      set: (value) => store.commit("products/setName", value),
    });
    const showOverviewInput = ref(false);
    const overviewKey = ref("");
    const overviewValue = ref("");
    const overview = computed(() => store.getters["products/getOverview"]);
    const moreInformation = computed({
      get: () => store.getters["products/getMoreInformation"],
      set: (value) => store.commit("products/setMoreInformation", value),
    });
    const website = computed({
      get: () => store.getters["products/getWebsite"],
      set: (value) => store.commit("products/setWebsite", value),
    });
    const disableNextButton = computed(() => {
      if (
        name.value &&
        categories.value &&
        categories.value.length &&
        overview.value &&
        Object.keys(overview.value).length &&
        moreInformation.value
      ) {
        return false;
      } else {
        return true;
      }
    });

    onMounted(async () => {
      if (!supplier.value) {
        await store.dispatch("suppliers/setSupplier", props.supplierId);
        options.value = supplier.value.categories;
      }
      if (!product.value) {
        try {
          console.log("set product running");
          const product = await store.dispatch(
            "products/setProduct",
            props.productId
          );
          store.commit("products/setProductData", product);
        } catch (error) {
          console.log("error: ", error);
        }
      }
    });

    function hideOverviewInput() {
      if (!overviewKey.value && !overviewValue.value) {
        showOverviewInput.value = false;
      } else {
        return;
      }
    }

    function addOverview() {
      store.commit("products/setOverview", {
        key: overviewKey.value,
        value: overviewValue.value,
      });
      overviewKey.value = "";
      overviewValue.value = "";
    }

    function removeOverview(key) {
      store.commit("products/removeOverview", key);
    }

    async function createProductAndRoute() {
      isUploading.value = true;
      if (!product.value) {
        await store.dispatch("suppliers/setSupplier", props.supplierId);
        await store.dispatch("products/createProduct", {
          supplierId: props.supplierId,
          productId: props.productId,
        });
      } else {
        const data = {
          overview: overview.value,
          categories: categories.value,
          name: name.value,
          website: website.value,
          moreInformation: moreInformation.value,
        };
        await store.dispatch("products/updateProduct", {
          productId: props.productId,
          data,
        });
      }
      isUploading.value = false;
      router.push({
        name: "ProductsNewUploads",
        params: {
          supplierId: props.supplierId,
          productId: props.productId,
        },
      });
    }

    onBeforeRouteLeave(async (to, from) => {
      if (to.name !== "ProductsNewUploads") {
        if (product.value) {
          if (product.value.imagesList && product.value.imagesList.length) {
            await store.dispatch("images/removeImages");
          }
          await store.dispatch("products/deleteProduct", props.productId);
        }
        clearState();
      }
    });

    function clearState() {
      if (unsubscribeProduct.value) {
        unsubscribeProduct.value();
      }
      store.commit("products/clearState");
    }

    return {
      options,
      categories,
      name,
      showOverviewInput,
      hideOverviewInput,
      addOverview,
      overviewKey,
      overviewValue,
      overview,
      removeOverview,
      moreInformation,
      website,
      disableNextButton,
      createProductAndRoute,
      isUploading,
    };
  },
};
</script>

<style lang="sass" scoped>
.filler
  width: 24px
  height: 24px
</style>

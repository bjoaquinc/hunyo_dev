<template>
  <div v-if="supplier">
    <q-card
      class="q-py-xs q-pl-xs container items-start row"
      flat
      bordered
      v-if="$q.platform.is.desktop"
    >
      <q-item
        v-for="(highlightedProduct, index) in supplier.highlightedProducts"
        :key="index"
        :to="{
          name: 'ProductDetail',
          params: { productId: highlightedProduct.id },
        }"
        class="col q-mr-xs no-padding"
        clickable
        v-ripple
      >
        <component
          :is="'q-img'"
          :src="highlightedProduct ? highlightedProduct.image : null"
          :ratio="1"
        />
      </q-item>
      <q-btn
        v-if="userData.admin && !$q.platform.is.mobile"
        @click="openDialogUpdateHighlightedProducts"
        class="edit"
        flat
        icon="fas fa-edit"
        label="Edit"
      />
    </q-card>

    <q-card
      class="bg-white container row items-center"
      :class="$q.platform.is.desktop ? 'q-mt-md q-px-md' : ''"
      flat
      :bordered="$q.platform.is.desktop ? true : false"
      v-if="userData"
    >
      <q-btn
        v-if="userData.admin && !$q.platform.is.mobile"
        @click="openDialogSupplierEdit"
        class="edit"
        flat
        icon="fas fa-edit"
        label="Edit"
      />
      <q-img
        ratio="1"
        class="col-6 col-sm-4"
        :class="$q.platform.is.desktop ? 'q-pa-sm' : 'q-mx-auto'"
        :src="supplier.logo"
      />
      <div
        class="col-12 col-sm-8 flex"
        :class="$q.platform.is.desktop ? 'q-pa-sm' : 'q-px-md'"
      >
        <div class="text-h4 full-width">
          {{ `${supplier.name} Product Catalogue` }}
          <span
            ><q-btn class="text-h5" no-caps flat color="primary" dense
              >(2 Reviews)</q-btn
            ></span
          >
        </div>
        <div
          class="text-subtitle1 q-mt-sm"
          :class="$q.platform.is.desktop ? 'q-mt-sm q-px-xs' : 'q-mt-md'"
          :style="{ order: $q.platform.is.desktop ? 0 : 1 }"
        >
          {{ supplier.description }}
        </div>
        <div
          class="row full-width"
          :class="$q.platform.is.desktop ? 'q-mt-md' : 'q-mt-sm'"
        >
          <q-btn
            @click="openDialogSupplierContact"
            class="col-12 col-sm"
            :class="$q.platform.is.desktop ? '' : 'q-mt-sm'"
            color="primary"
            icon="fas fa-phone"
            label="Contact Us"
            :outline="$q.platform.is.desktop ? true : false"
            unelevated
          />
          <q-btn
            class="col-12 col-sm"
            :class="$q.platform.is.desktop ? 'q-ml-sm' : 'q-mt-md'"
            :align="$q.platform.is.desktop ? 'center' : 'left'"
            :dense="$q.platform.is.desktop ? false : true"
            color="primary"
            flat
            icon="fas fa-globe"
            label="Website"
          />
          <q-btn
            class="col-12 col-sm"
            :class="$q.platform.is.desktop ? 'q-ml-sm' : 'q-mt-md'"
            :align="$q.platform.is.desktop ? 'center' : 'left'"
            :dense="$q.platform.is.desktop ? false : true"
            color="primary"
            flat
            :icon="`fab fa-${
              supplier.socialMedia && supplier.socialMedia.type === 'Instagram'
                ? 'instagram'
                : 'facebook'
            }`"
            :label="
              supplier.socialMedia && supplier.socialMedia.type === 'Instagram'
                ? 'Instagram'
                : 'Facebook'
            "
          />
        </div>
      </div>
    </q-card>
    <q-card
      class="q-mt-md"
      :bordered="$q.platform.is.desktop ? true : false"
      flat
    >
      <q-card-section class="flex items-center">
        <q-select
          v-model="category"
          :options="options"
          @update:model-value="setSelectedProducts()"
          class="text-h5"
          :class="$q.platform.is.desktop ? '' : 'full-width'"
          no-caps
          filled
          color="secondary"
        />
        <q-btn
          v-if="userData.admin && !$q.platform.is.mobile"
          @click="createNewProduct"
          class="q-ml-sm"
          outline
          label="Add Product"
          unelevated
          color="primary"
          icon="fas fa-plus"
        />
      </q-card-section>
      <q-card-section
        class="row"
        v-if="productsInCatalogue && productsInCatalogue.length"
      >
        <q-infinite-scroll :offset="250" @load="onLoad" class="col-12 row">
          <q-item
            v-for="({ photo, name, productId }, index) in productsInCatalogue"
            :key="index"
            class="col-12 col-sm-3 q-pa-xs"
            :class="$q.platform.is.desktop ? 'flex column' : ' row q-mt-sm'"
            :to="
              productId ? { name: 'ProductDetail', params: { productId } } : ''
            "
            clickable
          >
            <q-img
              ratio="1"
              style="border: 1px solid rgba(0, 0, 0, 0.12)"
              :class="$q.platform.is.desktop ? '' : 'col-6'"
              :src="photo"
            />
            <q-item-label
              :style="
                $q.platform.is.desktop
                  ? { padding: '8px 0 !important' }
                  : { padding: '8px 8px !important' }
              "
              class="text-subtitle1 flex items-center"
              :class="
                $q.platform.is.desktop ? '' : 'col-6 justify-center text-center'
              "
            >
              {{ name }}</q-item-label
            >
          </q-item>
        </q-infinite-scroll>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-subtitle1">No products available.</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { computed, watch, ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { collection, doc } from "@firebase/firestore";
import { db } from "src/boot/firebase";
import DialogUpdateHighlightedProducts from "src/components/dialogs/DialogUpdateHighlightedProducts.vue";
import DialogSupplierContact from "src/components/dialogs/DialogSupplierContact.vue";
import DialogSupplierEdit from "src/components/dialogs/DialogSupplierEdit.vue";

export default {
  props: ["supplierId"],
  setup(props) {
    const q = useQuasar();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const user = computed(() => store.getters["auth/getUser"]);
    const userData = computed(() => store.getters["profile/getUserData"]);
    const supplier = computed(() => store.getters["suppliers/getSupplier"]);
    const productsInCatalogue = computed(
      () => store.getters["products/getProductsInCatalogue"]
    );
    let lastVisible = null;
    const hasProducts = ref(true);
    const category = ref(
      route.query.category ? route.query.category : "All Products"
    );
    const options = ref([]);

    onMounted(async () => {
      try {
        await store.dispatch("suppliers/setSupplier", props.supplierId);
        lastVisible = await store.dispatch("products/setProductsInCatalogue", {
          supplierId: props.supplierId,
          category: route.query.category ? route.query.category : null,
        });
        options.value = ["All Products", ...supplier.value.categories];
      } catch (error) {
        console.log(error);
      }
    });

    onUnmounted(() => {
      store.commit("suppliers/clearSupplier");
      store.commit("products/clearProductsInCatalogue");
    });

    function createNewProduct() {
      const productId = doc(collection(db, "products")).id;
      const route = {
        name: "ProductsNewDetails",
        params: { supplierId: props.supplierId, productId },
      };
      router.push(route);
    }

    async function setSelectedProducts() {
      if (category.value !== "All Products") {
        lastVisible = await store.dispatch("products/setProductsInCatalogue", {
          supplierId: props.supplierId,
          category: category.value,
        });
      } else {
        lastVisible = await store.dispatch("products/setProductsInCatalogue", {
          supplierId: props.supplierId,
        });
      }
    }

    const openDialogUpdateHighlightedProducts = () => {
      q.dialog({
        component: DialogUpdateHighlightedProducts,
        componentProps: {
          supplierId: props.supplierId,
        },
      });
    };

    const openDialogSupplierContact = () => {
      q.dialog({
        component: DialogSupplierContact,
        componentProps: {
          supplierContact: supplier.value.contact,
          supplierName: supplier.value.name,
        },
      });
    };

    const openDialogSupplierEdit = () => {
      q.dialog({
        component: DialogSupplierEdit,
      });
    };

    const onLoad = async (index, done) => {
      if (!hasProducts.value) return done();
      try {
        lastVisible = await store.dispatch(
          "products/setNextProductsInCatalogue",
          {
            supplierId: props.supplierId,
            category: category.value !== "All Products" ? category.value : null,
            lastVisible,
          }
        );
        done();
      } catch (error) {
        console.log(error);
        if (error.message === "Could not find products") {
          hasProducts.value = false;
        }
        done();
      }
    };

    watch(category, (newValue, oldValue) => {
      hasProducts.value = true;
      if (newValue === "All Products") {
        router.replace({ query: {} });
      } else {
        router.replace({ query: { category: newValue } });
      }
    });

    return {
      userData,
      q,
      supplier,
      createNewProduct,
      category,
      options,
      productsInCatalogue,
      setSelectedProducts,
      openDialogUpdateHighlightedProducts,
      openDialogSupplierContact,
      openDialogSupplierEdit,
      onLoad,
    };
  },
};
</script>

<style lang="sass" scoped>

.edit
  position: absolute
  top: 15px
  right: 15px
  background-color: white
  opacity: 0.6

.container
  width: 100%
  height: auto

.no-padding
  padding: 0 !important

.constrain-product-item
  max-width: 50%
</style>

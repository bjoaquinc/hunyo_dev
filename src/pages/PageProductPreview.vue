<template>
  <div
    class="row q-mx-auto"
    :class="$q.platform.is.desktop ? 'q-col-gutter-md' : ''"
    :style="
      $q.platform.is.desktop
        ? { maxWidth: $q.platform.is.ipad ? '90vw' : '80vw' }
        : null
    "
    v-if="product"
  >
    <div class="col-12 flex">
      <q-btn
        :to="{ name: 'ProductsNewUploads', params: { supplierId, productId } }"
        label="return"
        icon="fas fa-chevron-left"
        color="primary"
        flat
        dense
      />
      <q-btn
        @click="publishProduct"
        label="publish"
        class="q-ml-auto"
        color="primary"
        unelevated
      />
    </div>
    <div class="col" v-if="hasImages && $q.platform.is.desktop">
      <BaseCarousel :imagesList="product.imagesList" />
    </div>
    <div
      class="col-12 q-mx-auto"
      :class="$q.platform.is.ipad || !hasImages ? 'col-sm-8' : 'col-sm-6'"
      v-if="product"
    >
      <ProductsNewPreview :product="product" />
    </div>
  </div>
</template>

<script>
import ProductsNewPreview from "src/components/ProductsNewPreview.vue";
import BaseCarousel from "src/components/BaseCarousel.vue";
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  props: ["supplierId", "productId"],
  components: {
    ProductsNewPreview,
    BaseCarousel,
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const product = computed(() => store.getters["products/getProduct"]);
    const unsubscribeProduct = computed(
      () => store.getters["products/getUnsubscribeProduct"]
    );
    const hasImages = computed(() => {
      if (
        product.value &&
        product.value.imagesList &&
        product.value.imagesList.length
      ) {
        return true;
      } else {
        return false;
      }
    });

    onMounted(async () => {
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

    async function publishProduct() {
      try {
        await createProductItem();
        await updatePublishedProperty();
        clearState();
        router.push({
          name: "SupplierProductCatalogue",
          params: { supplierId: props.supplierId },
        });
      } catch (error) {
        console.log(error);
      }
    }

    async function createProductItem() {
      await store.dispatch("products/createProductItem");
      console.log("Updated published property");
    }

    async function updatePublishedProperty() {
      await store.dispatch("products/updateProduct", {
        productId: props.productId,
        data: { published: true },
      });
    }

    function clearState() {
      if (unsubscribeProduct.value) {
        unsubscribeProduct.value();
      }
      store.commit("products/clearState");
    }

    return {
      product,
      hasImages,
      publishProduct,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    padding-top: 21px
</style>

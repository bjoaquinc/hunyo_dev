<template>
  <div
    class="row q-mx-auto full-height justify-center"
    :class="$q.platform.is.desktop ? 'q-col-gutter-md' : ''"
    :style="
      $q.platform.is.desktop
        ? {
            maxWidth: $q.platform.is.ipad ? '90%' : '',
            aspectRatio: '2/1',
            maxHeight: '88vh !important',
            maxWidth: '2192px',
            paddingRight: '16px',
          }
        : null
    "
    v-if="product"
  >
    <div class="col" v-if="hasImages && $q.platform.is.desktop">
      <BaseCarousel :imagesList="product.imagesList" />
    </div>
    <div
      class="col-12 q-mx-auto"
      :class="$q.platform.is.ipad || !hasImages ? 'col-sm-8' : 'col-sm-6'"
      v-if="product"
    >
      <ProductDetail :product="product" />
      <router-view v-slot="{ Component }">
        <q-dialog v-model="cropperDialog" persistent maximized>
          <component :is="Component" @closeDialog="closeDialog" />
        </q-dialog>
      </router-view>
    </div>
  </div>
</template>

<script>
import ProductDetail from "src/components/ProductDetail.vue";
import CommentsList from "src/components/CommentsList.vue";
import BaseCarousel from "src/components/BaseCarousel.vue";

export default {
  name: "PageProduct",
  props: ["productId"],
  data() {
    return {
      cropperDialog: false,
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters["auth/getUser"];
    },
    userData() {
      return this.$store.getters["profile/getUserData"];
    },
    product() {
      return this.$store.getters["products/getProduct"];
    },
    unsubscribeProduct() {
      return this.$store.getters["product/getUnsubscribeProduct"];
    },
    hasImages() {
      if (
        this.product &&
        this.product.imagesList &&
        this.product.imagesList.length
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  components: {
    ProductDetail,
    CommentsList,
    BaseCarousel,
  },
  methods: {
    async editImages() {
      await this.$store.dispatch(
        "newPost/setPostItem",
        this.selectedPost.postId
      );
      await this.$store.dispatch("newPost/setUploadedImages");
      this.$store.commit("newPost/generateImageOrder");
      this.cropperDialog = true;
    },
    closeDialog() {
      this.cropperDialog = false;
    },
  },
  async created() {
    try {
      await this.$store.dispatch("products/setProduct", this.productId);
      console.log(this.product);
      if (!this.currentUser) return;
    } catch (error) {
      console.log(error);
    }
  },
  unmounted() {
    try {
      // Unsub and clear state
      if (this.unsubscribeProduct) {
        this.unsubscribeProduct();
      }
      this.$store.commit("products/clearState");
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    padding-top: 21px
</style>

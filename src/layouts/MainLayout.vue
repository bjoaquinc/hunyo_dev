<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white" bordered>
      <component
        v-if="$q.platform.is.mobile && !$q.platform.is.ipad"
        :is="header"
        class="lt-sm"
      />
      <component
        :is="desktopHeader"
        v-else-if="!$route.meta.withoutDesktopHeader"
        class="gt-xs"
      />
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </q-page-container>

    <TheFooter
      v-if="
        !$route.path.includes('new-post') &&
        !$route.path.includes('signup') &&
        isAuth &&
        $q.platform.is.mobile &&
        !$q.platform.is.ipad
      "
    />
  </q-layout>
</template>

<script>
import HeaderHomeLarge from "src/components/headers/HeaderHomeLarge.vue";
import TheFooter from "src/components/TheFooter.vue";
import HeaderPageHome from "src/components/headers/HeaderPageHome.vue";
import HeaderPageActivity from "src/components/headers/HeaderPageActivity.vue";
import HeaderPageProducts from "src/components/headers/HeaderPageProducts.vue";
import HeaderPagePost from "src/components/headers/HeaderPagePost.vue";
import HeaderPageProduct from "src/components/headers/HeaderPageProduct.vue";
import HeaderPageUser from "src/components/headers/HeaderPageUser.vue";
import HeaderPagePostDrafts from "src/components/headers/HeaderPagePostDrafts.vue";
import HeaderPagePostNewContent from "src/components/headers/HeaderPagePostNewContent.vue";
import HeaderPagePostNewTitle from "src/components/headers/HeaderPagePostNewTitle.vue";
import HeaderPagePreview from "src/components/headers/HeaderPagePreview.vue";
import HeaderPageProfile from "src/components/headers/HeaderPageProfile.vue";
import HeaderProfileEdit from "src/components/headers/HeaderProfileEdit.vue";
import HeaderProfileFolder from "src/components/headers/HeaderProfileFolder.vue";
import HeaderPageSearch from "src/components/headers/HeaderPageSearch.vue";
import HeaderPageLanding from "src/components/headers/HeaderPageLanding.vue";
import HeaderFolderDetail from "src/components/headers/HeaderFolderDetail.vue";
import HeaderSupplierProductCatalogue from "src/components/headers/HeaderSupplierProductCatalogue.vue";

export default {
  components: {
    HeaderHomeLarge,
    TheFooter,
    HeaderSupplierProductCatalogue,
    HeaderPageActivity,
    HeaderPageProducts,
    HeaderPageHome,
    HeaderPagePost,
    HeaderPageProduct,
    HeaderPagePostDrafts,
    HeaderPagePreview,
    HeaderPagePostNewContent,
    HeaderPagePostNewTitle,
    HeaderPageProfile,
    HeaderProfileEdit,
    HeaderProfileFolder,
    HeaderPageSearch,
    HeaderPageLanding,
    HeaderPageUser,
    HeaderFolderDetail,
  },
  data() {
    return {
      header: "",
      mobileData: false,
      bluetooth: false,
    };
  },
  computed: {
    isAuth() {
      return this.$store.getters["auth/getIsAuth"];
    },
    desktopHeader() {
      if (this.isAuth) {
        return "HeaderHomeLarge";
      } else if (
        !this.$route.meta.header ||
        this.$route.name === "PagePostNewContent" ||
        this.$route.name === "PagePostNewTitle"
      ) {
        return null;
      } else {
        return "HeaderPageLanding";
      }
    },
    user() {
      return this.$store.getters["auth/getUser"];
    },
  },
  watch: {
    $route(newValue) {
      if (newValue.meta.header) {
        this.header = newValue.meta.header;
      } else {
        this.header = null;
      }
    },
  },
  async created() {
    await this.$store.dispatch("auth/setUser");

    if (this.$route.meta.header) {
      this.header = this.$route.meta.header;
    } else {
      this.header = null;
    }
  },
};
</script>

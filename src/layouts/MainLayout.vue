<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white" bordered>
      <component
        v-if="$q.platform.is.mobile"
        :is="header"
        class="mobile-only"
      />
      <component
        :is="desktopHeader"
        v-else-if="!$route.meta.withoutDesktopHeader"
        class="desktop-only"
      />
    </q-header>

    <q-page-container class="constrain">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </q-page-container>

    <TheFooter
      v-if="
        !$route.path.includes('new-post') &&
        !$route.path.includes('signup') &&
        isAuth
      "
    />
  </q-layout>
</template>

<script>
import HeaderHomeLarge from "src/components/HeaderHomeLarge.vue";
import TheFooter from "src/components/TheFooter.vue";
import HeaderPageHome from "src/components/HeaderPageHome.vue";
import HeaderPageActivity from "src/components/HeaderPageActivity.vue";
import HeaderPagePost from "src/components/HeaderPagePost.vue";
import HeaderPageUser from "src/components/HeaderPageUser.vue";
import HeaderPagePostDrafts from "src/components/HeaderPagePostDrafts.vue";
import HeaderPagePostNewContent from "src/components/HeaderPagePostNewContent.vue";
import HeaderPagePostNewTitle from "src/components/HeaderPagePostNewTitle.vue";
import HeaderPageProfile from "src/components/HeaderPageProfile.vue";
import HeaderProfileEdit from "src/components/HeaderProfileEdit.vue";
import HeaderProfileFolder from "src/components/HeaderProfileFolder.vue";
import HeaderPageSearch from "src/components/HeaderPageSearch.vue";
import HeaderPageLanding from "src/components/HeaderPageLanding.vue";
import HeaderFolderDetail from "src/components/HeaderFolderDetail.vue";

export default {
  components: {
    HeaderHomeLarge,
    TheFooter,
    HeaderPageActivity,
    HeaderPageHome,
    HeaderPagePost,
    HeaderPagePostDrafts,
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

<style lang="sass">
.q-avatar
  border: 1px solid rgba(0, 0, 0, 0.12)
</style>

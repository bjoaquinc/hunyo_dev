<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white" bordered>
      <component :is="header" class="mobile-only" />
      <TheHeader
        v-if="!$route.path.includes('new-post')"
        class="desktop-only"
      />
    </q-header>

    <q-page-container class="constrain">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </q-page-container>

    <TheFooter v-if="!$route.path.includes('new-post')" />
  </q-layout>
</template>

<script>
import TheHeader from "src/components/HeaderHomeLarge.vue";
import TheFooter from "src/components/TheFooter.vue";
import HeaderPageHome from "src/components/HeaderPageHome.vue";
import HeaderPageActivity from "src/components/HeaderPageActivity.vue";
import HeaderPagePost from "src/components/HeaderPagePost.vue";
import HeaderPagePostDrafts from "src/components/HeaderPagePostDrafts.vue";
import HeaderPagePostNewContent from "src/components/HeaderPagePostNewContent.vue";
import HeaderPagePostNewTitle from "src/components/HeaderPagePostNewTitle.vue";
import HeaderPageProfile from "src/components/HeaderPageProfile.vue";
import HeaderPageProfileEdit from "src/components/HeaderPageProfileEdit.vue";
import HeaderPageSearch from "src/components/HeaderPageSearch.vue";

export default {
  components: {
    TheHeader,
    TheFooter,
    HeaderPageActivity,
    HeaderPageHome,
    HeaderPagePost,
    HeaderPagePostDrafts,
    HeaderPagePostNewContent,
    HeaderPagePostNewTitle,
    HeaderPageProfile,
    HeaderPageProfileEdit,
    HeaderPageSearch,
  },
  data() {
    return {
      header: "",
      mobileData: false,
      bluetooth: false,
    };
  },
  watch: {
    $route(newValue) {
      if (!newValue.name) return;
      this.header = `Header${newValue.name}`;
    },
  },
  created() {
    this.header = `Header${this.$route.name}`;
  },
};
</script>

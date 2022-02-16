<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white" bordered>
      <router-view name="header" class="mobile-only" />
      <TheHeader
        v-if="!$route.path.includes('new-post')"
        class="desktop-only"
      />
    </q-header>

    <q-page-container class="constrain">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>

    <TheFooter v-if="!$route.path.includes('new-post')" />
  </q-layout>
</template>

<script>
import TheHeader from "src/components/HeaderHomeLarge.vue";
import TheFooter from "src/components/TheFooter.vue";

export default {
  components: {
    TheHeader,
    TheFooter,
  },
  data() {
    return {
      mobileData: false,
      bluetooth: false,
    };
  },
};
</script>

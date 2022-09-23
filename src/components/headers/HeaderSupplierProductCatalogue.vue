<template>
  <q-toolbar class="constrain lt-sm bg-white">
    <q-btn
      @click="$router.go(-1)"
      color="primary"
      icon="fas fa-chevron-left"
      flat
      dense
    />
    <div class="text-h6 text-secondary q-mx-auto">Product Catalogue</div>
    <div style="height: 32px; width: 32px" />
  </q-toolbar>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default {
  setup(props) {
    const store = useStore();
    const userData = computed(() => store.getters["users/getUserData"]);
    const route = useRoute();
    const isPublic = computed(() =>
      route.name === "LandingUser" ? true : false
    );
    const currentUser = computed(() => store.getters["auth/getUser"]);

    return {
      isPublic,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-toolbar__title
  color: black

.filler
  width: 24px
  height: 24px
</style>

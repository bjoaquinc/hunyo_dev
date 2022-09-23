<template>
  <q-footer class="bg-white lt-sm" bordered>
    <q-tabs
      class="row q-px-0 text-primary full-width"
      active-bg-color="primary"
      active-color="white"
      indicator-color="primary"
      switch-indicator
    >
      <q-route-tab
        class="col q-mr-xs"
        :to="{ name: 'PageHome' }"
        icon="fas fa-users"
        size="1rem"
        :ripple="false"
        :glossy="false"
        dense
        flat
      />
      <q-route-tab
        class="col q-ml-xs"
        :to="{ name: 'ProductFeed' }"
        icon="fas fa-dolly-flatbed"
        size="1rem"
        :ripple="false"
        :glossy="false"
        dense
        flat
      />
      <q-route-tab
        class="col q-mx-xs"
        :to="{ name: 'PageActivity' }"
        icon="fas fa-bell"
        size="1rem"
        :ripple="false"
        :glossy="false"
        dense
        flat
      >
        <q-badge v-if="userData.counter" color="red" floating>{{
          userData.counter
        }}</q-badge>
      </q-route-tab>
      <q-route-tab
        class="col q-ml-xs"
        :to="{ name: 'PageProfile' }"
        icon="fas fa-user"
        size="1rem"
        :ripple="false"
        :glossy="false"
        dense
        flat
      />
    </q-tabs>
  </q-footer>
</template>

<script>
import { computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default {
  setup() {
    const q = useQuasar();
    const store = useStore();
    const hasDrafts = computed(() => store.getters["getHasDrafts"]);
    const userData = computed(() => store.getters["profile/getUserData"]);

    return {
      hasDrafts,
      userData,
    };
  },
};
</script>

<style lang="sass" scoped>
.active
  background-color: $primary !important
  color: white !important

footer
  .q-toolbar
    min-height: 0
    padding: 0
</style>

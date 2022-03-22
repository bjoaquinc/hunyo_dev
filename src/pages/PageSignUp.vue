<template>
  <div>
    <div
      v-if="q.platform.is.mobile"
      class="q-px-lg q-mt-sm q-mt-sm-lg q-mt-xs-none full-width flex column mobile-only"
    >
      <router-view />
    </div>
    <q-card
      v-else
      bordered
      class="my-card absolute-center desktop-only q-pa-md"
      style="max-width: 500px; min-width: 400px; min-height: 400px"
    >
      <router-view />
    </q-card>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
export default {
  setup() {
    const q = useQuasar();

    return {
      q,
    };
  },
};
</script>

<template>
  <div>
    <div
      v-if="q.platform.is.mobile && !q.platform.is.ipad"
      class="q-px-lg q-mt-sm q-mt-sm-lg q-mt-xs-none full-width flex column lt-sm"
    >
      <router-view />
    </div>
    <q-card
      v-else
      bordered
      class="my-card absolute-center gt-xs q-pa-md"
      style="
        max-width: 500px;
        min-width: 400px;
        min-height: 400px;
        max-height: 90vh;
        overflow: auto;
      "
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

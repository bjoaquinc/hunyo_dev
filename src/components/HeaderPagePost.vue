<template>
  <q-toolbar class="constrain mobile-only bg-white">
    <q-btn
      :to="{ name: 'PageHome' }"
      color="primary"
      icon="fas fa-chevron-left"
      flat
      dense
    />
    <q-btn
      @click="openPostActionsDialog"
      class="q-ml-auto q-mr-sm"
      color="primary"
      icon="fas fa-ellipsis-h"
      flat
      dense
    />
    <q-btn color="primary" label="Save" icon="fas fa-folder" unelevated />

    <DialogPostActions />
  </q-toolbar>
</template>

<script>
import DialogPostActions from "src/components/DialogPostActions.vue";
import { useQuasar } from "quasar";

export default {
  components: {
    DialogPostActions,
  },
  setup() {
    const q = useQuasar();

    function openPostActionsDialog() {
      q.dialog({
        component: DialogPostActions,
      });
    }

    return {
      openPostActionsDialog,
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

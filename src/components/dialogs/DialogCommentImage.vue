<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
    :full-width="q.platform.is.mobile && !q.platform.is.ipad"
    :full-height="q.platform.is.mobile && !q.platform.is.ipad"
    transition-show="slide-up"
    transition-hide="slide-down"
    :position="
      q.platform.is.mobile && !q.platform.is.ipad ? 'bottom' : 'standard'
    "
  >
    <q-card
      class="bg-white"
      :style="
        q.platform.is.desktop || q.platform.is.ipad
          ? { maxWidth: '70vw', minWidth: '70vw' }
          : { paddingBottom: '41px' }
      "
    >
      <q-card-actions>
        <q-btn v-close-popup icon="fas fa-times" dense flat round />
      </q-card-actions>
      <q-img width="100%" :src="image" />
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";

export default {
  props: ["image"],
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const q = useQuasar();

    return {
      q,
      dialogRef,
      onDialogHide,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

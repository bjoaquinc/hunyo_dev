<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
    :full-width="q.platform.is.mobile"
    transition-show="slide-up"
    transition-hide="slide-down"
    :position="q.platform.is.mobile ? 'bottom' : 'standard'"
  >
    <q-card class="bg-white">
      <q-card-actions
        class="full-width q-mt-md q-mb-sm q-px-md"
        align="between"
      >
        <q-btn
          class="button-width"
          padding="16px 5px"
          text-color="secondary"
          color="grey-3"
          icon="fas fa-share-square"
          label="Share"
          unelevated
          stack
        />
        <q-btn
          class="button-width"
          padding="16px 5px"
          text-color="secondary"
          color="grey-3"
          icon="fas fa-check"
          label="Recommend"
          unelevated
          stack
        />
        <q-btn
          class="button-width"
          padding="16px 5px"
          text-color="secondary"
          color="grey-3"
          icon="fas fa-exclamation-circle"
          label="Report"
          unelevated
          stack
        />
      </q-card-actions>
      <q-card-actions class="full-width q-mb-md q-px-md">
        <q-btn
          @click="onDialogHide"
          class="full-width"
          text-color="secondary"
          color="grey-3"
          label="cancel"
          unelevated
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";

export default {
  props: {
    // ...your custom props
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const { dialogRef, onDialogHide, onDialogCancel } =
      useDialogPluginComponent();
    const q = useQuasar();

    return {
      dialogRef,
      onDialogHide,
      q,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

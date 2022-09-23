<template>
  <q-dialog @hide="onDialogHide" ref="dialogRef" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">Discard comment?</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Are you sure you want to discard this comment?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Keep Writing"
          color="primary"
          @click="onCancelClick"
        />
        <q-btn
          flat
          label="Discard"
          unelevated
          color="primary"
          @click="onOkClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from "quasar";

export default {
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      dialogRef,
      onDialogHide,
      onOkClick() {
        onDialogOK();
      },
      onCancelClick: onDialogCancel,
    };
  },
};
</script>

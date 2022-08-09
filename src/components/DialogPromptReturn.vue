<template>
  <q-dialog @hide="onDialogHide" ref="dialogRef" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">Are you sure you want to go back?</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Your account has already been created. If you go back now you will be
        signed out.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Go Back" color="negative" @click="onOkClick" />
        <q-btn unelevated label="Stay" color="primary" @click="onCancelClick" />
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

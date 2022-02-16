<template>
  <q-dialog @hide="onDialogHide" ref="dialogRef" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">Save your changes?</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <span>If you go back now your current post will be deleted.</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Delete" color="red" @click="onDeleteClick" />
        <q-btn flat label="Save Draft" color="primary" @click="onSaveClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from "quasar";

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
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    return {
      dialogRef,
      onDialogHide,
      onSaveClick() {
        onDialogOK();
      },
      onDeleteClick: onDialogCancel,
    };
  },
};
</script>

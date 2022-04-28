<template>
  <q-dialog @hide="onDialogHide" ref="dialogRef" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">Delete {{ isComment ? "Comment" : "Reply" }}?</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <span>{{
          `Are you sure you want to delete this ${
            isComment ? "comment" : "reply"
          }?`
        }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="No" color="primary" @click="onCancelClick" />
        <q-btn label="Delete" unelevated color="primary" @click="onOkClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from "quasar";

export default {
  props: ["isComment"],

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

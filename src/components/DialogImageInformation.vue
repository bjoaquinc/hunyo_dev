<template>
  <q-dialog @hide="onDialogHide" ref="dialogRef">
    <q-card class="bg-white">
      <q-card-section>
        <div class="text-h6">Image information</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <ul>
          <li>6 images maximum per post</li>
          <li>Image aspect ratio is 1 : 1</li>
          <li>JPEG, JPG, and PNG accepted</li>
          <li>No maximum file size</li>
        </ul>
      </q-card-section>
      <q-card-actions>
        <q-btn @click="onDialogHide" class="q-ml-auto" flat label="Ok" />
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
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
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

ul
  margin: 0
  padding: 0
  padding-left: 16px !important
</style>

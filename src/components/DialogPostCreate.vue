<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
    :full-width="q.platform.is.mobile && !q.platform.is.ipad"
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
          ? { width: '600px', maxWidth: '70vw' }
          : null
      "
    >
      <q-card-section
        :class="q.platform.is.desktop || q.platform.is.ipad ? 'q-mx-auto' : ''"
        style="width: fit-content"
      >
        <div class="text-h6">Create a Post</div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="full-width" align="around">
        <q-btn
          :to="{ name: 'PagePostNewTitle' }"
          color="primary"
          icon="fas fa-plus"
          label="New Post"
          flat
        />
        <q-btn
          :to="{ name: 'PagePostDrafts' }"
          color="primary"
          icon="fas fa-pencil-ruler"
          label="Drafts"
          flat
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
.button-width
  width: 100px

.filler
  width: 24px
  height: 24px
</style>

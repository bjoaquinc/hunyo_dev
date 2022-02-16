<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
    :full-width="q.platform.is.mobile"
    transition-show="slide-up"
    transition-hide="slide-down"
    :position="q.platform.is.mobile ? 'bottom' : 'standard'"
  >
    <q-card
      class="bg-white"
      :style="
        q.platform.is.desktop ? { width: '600px', maxWidth: '70vw' } : null
      "
    >
      <q-card-actions>
        <q-btn v-close-popup icon="fas fa-times" dense flat round />
      </q-card-actions>
      <q-card-actions class="full-width q-mb-sm q-px-md">
        <q-select
          v-model="selectedType"
          :rules="[(val) => val.length > 0 || 'A type must be chosen.']"
          :options="types"
          class="full-width"
          label="Comment Type *"
          hint="Choose the type of comment you want to make"
        />
      </q-card-actions>
      <q-card-actions class="fullwidth q-mb-sm q-px-md">
        <q-input
          v-model="comment"
          class="q-mx-none full-width"
          hint="Write your comment here"
          label="Comment"
          placeholder="A guide based on the type of comment chosen here..."
        />
      </q-card-actions>
      <q-card-actions class="fullwidth q-mb-sm q-px-md">
        <q-btn
          label="Add images"
          icon="fas fa-camera"
          flat
          color="primary"
          size="md"
          class="q-px-none"
        />
      </q-card-actions>
      <q-card-actions class="full-width q-mb-md q-px-md">
        <q-btn
          class="full-width"
          color="primary"
          label="Post Comment"
          unelevated
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { ref } from "vue";

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
    const types = ref([
      "Question",
      "Appreciation with Reason",
      "Tag Peer(s)",
      "Constructive Feedback",
    ]);
    const selectedType = ref("");
    const comment = ref("");

    return {
      q,
      dialogRef,
      onDialogHide,
      types,
      selectedType,
      comment,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

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
    <q-card class="bg-white">
      <q-card-section
        class="full-width"
        :class="q.platform.is.desktop || q.platform.is.ipad ? 'q-mx-auto' : ''"
        style="width: fit-content"
      >
        <div class="flex full-width justify-between items-center">
          <q-btn flat icon="fas fa-times" v-close-popup />
          <div class="text-h6">Edit</div>
          <div style="width: 53px; height: 36px" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions
        class="full-width q-mt-md q-mb-sm q-px-md"
        align="between"
      >
        <q-btn
          v-close-popup
          @click="openDialogFolderCreateAndEdit"
          :class="
            q.platform.is.mobile && !q.platform.is.ipad ? 'full-width' : ''
          "
          style="min-width: 80px"
          text-color="secondary"
          color="grey-3"
          label="Rename Folder"
          unelevated
        />
        <q-btn
          @click="onRemoveClick"
          :class="
            q.platform.is.mobile && !q.platform.is.ipad ? 'full-width' : ''
          "
          style="min-width: 80px"
          text-color="negative"
          color="grey-1"
          label="Remove Posts"
          flat
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import DialogFolderCreateAndEdit from "src/components/DialogFolderCreateAndEdit.vue";

export default {
  props: ["folderId"],
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
    const q = useQuasar();

    function openDialogFolderCreateAndEdit() {
      q.dialog({
        component: DialogFolderCreateAndEdit,
        componentProps: {
          rename: true,
          id: props.folderId,
        },
      });
    }

    return {
      dialogRef,
      onDialogHide,
      q,
      openDialogFolderCreateAndEdit,
      onRemoveClick() {
        onDialogOK();
      },
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

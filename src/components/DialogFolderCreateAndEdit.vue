<template>
  <q-dialog
    @hide="onDialogHide"
    :persistent="rename ? false : true"
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
      <q-card-section
        class="full-width"
        :class="q.platform.is.desktop ? 'q-mx-auto' : ''"
        style="width: fit-content"
      >
        <div class="flex full-width justify-between items-center">
          <q-btn
            v-if="!rename"
            flat
            icon="fas fa-chevron-left"
            @click="openDialogFoldersList"
            v-close-popup
          />
          <q-btn v-else flat icon="fas fa-times" v-close-popup />
          <div class="text-h6">{{ rename ? "Rename" : "Create" }} Folder</div>
          <div style="width: 53px; height: 36px" />
        </div>
      </q-card-section>

      <q-separator />
      <q-card-section>
        <q-input
          outlined
          label="Add a folder name here..."
          v-model="newFolderName"
          :rules="[
            (val) => (val && val.length > 0) || 'This field is required.',
          ]"
        />
      </q-card-section>

      <q-card-actions>
        <q-btn
          v-close-popup
          @click="rename ? renameFolder() : createFolder()"
          class="full-width"
          color="primary"
          :label="rename ? 'Rename' : 'Create'"
          :disable="newFolderName ? false : true"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useStore } from "vuex";
import { computed } from "vue";
import DialogFoldersList from "src/components/DialogFoldersList";

export default {
  props: ["postData", "rename", "id"],
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const q = useQuasar();
    const store = useStore();
    const newFolderName = computed({
      get: () => store.getters["folder/getNewFolderName"],
      set: (value) => store.commit("folder/setNewFolderName", value),
    });
    const newFolder = computed(() => store.getters["folder/getNewFolder"]);
    const folderItems = computed(
      () => store.getters["folder/getSelectedPostsList"]
    );

    console.log("Folder items: ", folderItems.value);

    async function createFolder() {
      try {
        await store.dispatch("folder/createFolder", {
          newFolderName: newFolderName.value,
        });
        console.log("Folder items: ", folderItems.value);
        if (folderItems.value && folderItems.value.length > 0) {
          await store.dispatch("folder/movePosts", {
            selectedPostsList: folderItems.value,
            folder: newFolder.value,
          });
          q.notify({
            message: `Moved to ${newFolder.value.name}`,
          });
        } else if (newFolder.value) {
          await store.dispatch("folder/savePost", {
            postData: props.postData,
            folder: newFolder.value,
          });
          q.notify({
            message: `Saved to ${newFolder.value.name}`,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function renameFolder() {
      try {
        await store.dispatch("folder/renameFolder", {
          newFolderName: newFolderName.value,
          folderId: props.id,
        });
      } catch (error) {
        console.log(error);
      }
    }

    function openDialogFoldersList() {
      q.dialog({
        component: DialogFoldersList,
      });
    }

    return {
      dialogRef,
      onDialogHide,
      q,
      newFolderName,
      createFolder,
      renameFolder,
      openDialogFoldersList,
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

.is-selected
  border: 3px solid $accent
</style>

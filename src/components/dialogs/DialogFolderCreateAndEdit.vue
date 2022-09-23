<template>
  <q-dialog
    @hide="onDialogHide"
    persistent
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
        class="full-width"
        :class="q.platform.is.desktop || q.platform.is.ipad ? 'q-mx-auto' : ''"
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
import DialogFoldersList from "src/components/dialogs/DialogFoldersList";

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
    const user = computed(() => store.getters["auth/getUser"]);
    const userData = computed(() => store.getters["profile/getUserData"]);

    // console.log("Folder items: ", folderItems.value);

    async function createFolder() {
      try {
        await store.dispatch("folder/createFolder", {
          newFolderName: newFolderName.value,
        });
        // console.log("Folder items: ", folderItems.value);
        if (folderItems.value && folderItems.value.length > 0) {
          // console.log("move post: ", folderItems.value);
          await store.dispatch("folder/movePosts", {
            selectedPostsList: folderItems.value,
            folder: newFolder.value,
          });
          q.notify({
            message: `Moved to ${newFolder.value.name}`,
          });
          store.commit("folder/clearState");
          return;
        } else if (newFolder.value) {
          // console.log("save post: ", folderItems.value);
          await store.dispatch("folder/savePost", {
            postData: props.postData,
            folder: newFolder.value,
            isNew: true,
          });
          if (!userData.value.admin) {
            await store.dispatch("notifications/createNotification", {
              content: props.postData.title,
              type: "postSave",
              userId: props.postData.user.id,
              route: {
                name: "ProfileUser",
                params: { userId: user.value.uid, source: "notification" },
              },
            });
          }
          store.commit("folder/clearStatePostData");
          const dismiss = q.notify({
            message: `Saved to ${newFolder.value.name}`,
          });
          setTimeout(() => {
            dismiss();
            store.commit("folder/clearState");
          }, 4000);
          return;
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
        store.commit("folder/clearState");
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

<template>
  <q-dialog
    @hide="onDialogHide"
    :persistent="organize ? true : false"
    ref="dialogRef"
    :full-width="q.platform.is.mobile"
    transition-show="slide-up"
    transition-hide="slide-down"
    :position="q.platform.is.mobile ? 'bottom' : 'standard'"
  >
    <q-card
      class="bg-white"
      style="max-height: 100%"
      :style="
        q.platform.is.desktop ? { width: '600px', maxWidth: '70vw' } : null
      "
    >
      <q-card-section
        v-if="organize"
        class="full-width"
        :class="q.platform.is.desktop ? 'q-mx-auto' : ''"
        style="width: fit-content"
      >
        <div class="flex full-width justify-between items-center">
          <q-btn
            flat
            icon="fas fa-chevron-left"
            @click="openDialogFolderOrganize"
            v-close-popup
          />
          <div class="text-h6">Move to a Folder</div>
          <q-btn flat icon="fas fa-times" v-close-popup />
        </div>
      </q-card-section>

      <q-card-section
        v-else
        class="full-width"
        :class="q.platform.is.desktop ? 'q-mx-auto' : ''"
        style="width: fit-content"
      >
        <div class="flex full-width justify-between items-center">
          <q-btn flat icon="fas fa-times" v-close-popup />
          <div class="text-h6">Save to a Folder</div>
          <div style="width: 53px; height: 36px" />
        </div>
      </q-card-section>

      <q-separator />

      <q-list
        bordered
        separator
        class="full-width"
        style="max-height: 80vh; overflow: auto"
      >
        <q-item
          clickable
          v-ripple
          v-if="!organize"
          @click="savePost()"
          v-close-popup
        >
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-star" />
          </q-item-section>
          <q-item-section class="text-subtitle1"
            >Quick Save and Organize Later</q-item-section
          >
        </q-item>
        <q-separator v-if="!organize" />
        <q-item
          v-for="{ name, id } in folders"
          :key="id"
          clickable
          class="full-width"
          v-ripple
          @click="organize ? movePosts({ name, id }) : savePost({ name, id })"
          v-close-popup
        >
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-folder" />
          </q-item-section>
          <q-item-section>{{ name }}</q-item-section>
        </q-item>
        <q-separator />
        <q-item
          clickable
          v-ripple
          @click="openDialogFolderCreateAndEdit"
          v-close-popup
        >
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-plus" />
          </q-item-section>
          <q-item-section>Create Folder</q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useStore } from "vuex";
import { computed, onMounted } from "vue";
import DialogFolderOrganize from "src/components/DialogFolderOrganize.vue";
import DialogFolderCreateAndEdit from "src/components/DialogFolderCreateAndEdit.vue";

export default {
  props: ["postData", "organize"],
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const q = useQuasar();
    const store = useStore();
    const folders = computed(() => store.getters["folder/getFolders"]);
    const postData = computed(() => store.getters["folder/getPostData"]);
    const selectedPostsList = computed(
      () => store.getters["folder/getSelectedPostsList"]
    );

    async function setFolders() {
      try {
        await store.dispatch("folder/setFolders");
      } catch (error) {
        console.log(error);
      }
    }

    onMounted(async () => {
      if (props.postData) {
        store.commit("folder/setPostData", props.postData);
      }
      await setFolders();
    });

    function openDialogFolderOrganize() {
      q.dialog({
        component: DialogFolderOrganize,
      });
    }

    function openDialogFolderCreateAndEdit() {
      q.dialog({
        component: DialogFolderCreateAndEdit,
        componentProps: { postData: postData.value },
      });
    }

    async function savePost(folder) {
      let savedLocation = "Profile";
      if (folder) {
        savedLocation = folder.name;
      }
      try {
        await store.dispatch("folder/savePost", {
          postData: postData.value,
          folder,
        });
        q.notify({
          message: `Saved to ${savedLocation}`,
        });
      } catch (error) {
        console.log(error);
      }
    }

    async function movePosts(folder) {
      try {
        await store.dispatch("folder/movePosts", {
          selectedPostsList: selectedPostsList.value,
          folder,
        });
        q.notify({
          message: `Moved to ${folder.name}`,
        });
      } catch (error) {
        console.log(error);
      }
    }

    return {
      dialogRef,
      onDialogHide,
      q,
      openDialogFolderOrganize,
      folders,
      openDialogFolderCreateAndEdit,
      savePost,
      movePosts,
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

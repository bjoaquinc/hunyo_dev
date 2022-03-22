<template>
  <q-toolbar class="constrain mobile-only bg-white">
    <q-btn
      @click="$router.go(-1)"
      color="primary"
      icon="fas fa-chevron-left"
      flat
      dense
    />
    <q-btn
      @click="openPostActionsDialog"
      class="q-ml-auto q-mr-sm"
      color="primary"
      icon="fas fa-ellipsis-h"
      flat
      dense
    />
    <q-btn
      @click="openDialogFoldersList"
      color="primary"
      label="Save"
      icon="fas fa-folder"
      unelevated
    />

    <DialogPostActions />
  </q-toolbar>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import DialogPostActions from "src/components/DialogPostActions.vue";
import DialogFoldersList from "src/components/DialogFoldersList.vue";

export default {
  components: {
    DialogPostActions,
  },
  setup() {
    const q = useQuasar();
    const store = useStore();
    const selectedPost = computed(() => store.getters["feed/getSelectedPost"]);

    function openDialogFoldersList() {
      const { title, postId, user, imagesList } = selectedPost.value;

      const postData = {
        title: title,
        id: postId,
        user: user,
        image: "",
      };
      if (imagesList && imagesList.length > 0) {
        postData.image = imagesList[0];
      }
      q.dialog({
        component: DialogFoldersList,
        componentProps: {
          postData,
        },
      });
    }

    function openPostActionsDialog() {
      const { title, postId, user, imagesList } = selectedPost.value;
      const postData = { title, postId, user, image: "" };
      if (imagesList && imagesList.length > 0) {
        postData.image = imagesList[0];
      }
      q.dialog({
        component: DialogPostActions,
        componentProps: {
          postData,
        },
      });
    }

    return {
      openPostActionsDialog,
      openDialogFoldersList,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-toolbar__title
  color: black

.filler
  width: 24px
  height: 24px
</style>

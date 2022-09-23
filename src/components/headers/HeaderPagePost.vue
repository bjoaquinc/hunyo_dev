<template>
  <q-toolbar class="constrain lt-sm bg-white">
    <q-btn
      @click="$router.go(-1)"
      color="primary"
      icon="fas fa-chevron-left"
      flat
      dense
    />
    <q-btn
      v-if="!isPublic"
      @click="openPostActionsDialog"
      class="q-ml-auto q-mr-sm"
      color="primary"
      icon="fas fa-ellipsis-h"
      flat
      dense
    />
    <q-btn
      v-if="!isPublic"
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
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import DialogPostActions from "src/components/dialogs/DialogPostActions.vue";
import DialogFoldersList from "src/components/dialogs/DialogFoldersList.vue";

export default {
  components: {
    DialogPostActions,
  },
  setup() {
    const q = useQuasar();
    const store = useStore();
    const selectedPost = computed(() => store.getters["posts/getSelectedPost"]);
    const route = useRoute();
    const isPublic = computed(() =>
      route.name === "LandingPost" ? true : false
    );

    function openDialogFoldersList() {
      const { title, postId, user, imagesList, topics } = selectedPost.value;
      const postData = {
        title,
        id: postId,
        user: user,
        image: "",
        topics,
      };
      if (imagesList && imagesList.length > 0) {
        postData.image = imagesList[0];
      }
      q.dialog({
        component: DialogFoldersList,
        componentProps: {
          postData,
          source: "post top",
        },
      });
    }

    function openPostActionsDialog() {
      const { title, postId, user, imagesList, content } = selectedPost.value;
      const postData = { title, content, postId, user, image: "" };
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
      isPublic,
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

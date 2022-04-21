<template>
  <q-toolbar class="constrain lt-sm bg-white">
    <q-btn
      color="secondary"
      icon="fas fa-chevron-left"
      class="same-width"
      align="left"
      :to="{ name: 'PagePostNewTitle' }"
      size="sm"
      dense
      flat
    />

    <q-toolbar-title class="text-center">Create Post</q-toolbar-title>

    <q-btn
      @click="createPost"
      :disable="isIncomplete"
      color="primary"
      :to="{ name: 'PagePostNewContent' }"
      label="Post"
      class="same-width"
      align="right"
      size="md"
      dense
      flat
    />
  </q-toolbar>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const q = useQuasar();
    const newPost = computed(() => store.getters["newPost/getNewPost"]);
    const imagesList = computed(
      () => store.getters["newPost/getCroppedImagesList"]
    );
    const postId = computed(() => store.getters["newPost/getPostId"]);

    const isIncomplete = computed(() => {
      return newPost.value.topics.length &&
        newPost.value.title &&
        newPost.value.content
        ? false
        : true;
    });

    async function createPost() {
      try {
        q.loading.show({ message: "Uploading..." });
        await store.dispatch("newPost/createPost", {
          newPost: { ...newPost.value },
          imagesList: imagesList.value,
        });
        const followersList = computed(
          () => store.getters["subscriptions/getFollowersList"]
        );
        for (let index = 0; index < followersList.value.length; index++) {
          const followingUser = followersList.value[index].followingUser;
          await store.dispatch("notifications/createNotification", {
            type: "followPost",
            content: newPost.value.title,
            userId: followingUser.id,
            route: {
              name: "FeedPost",
              params: {
                postId: postId.value,
              },
            },
          });
        }
        store.commit("newPost/clearState");
        q.loading.hide();
        router.push({ name: "PageHome" });
      } catch (error) {
        console.log(error);
        q.loading.hide();
      }
    }

    return {
      isIncomplete,
      createPost,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-toolbar__title
  color: $secondary

.filler
  width: 24px
  height: 24px
  padding: 4px

.same-width
  width: 50px
</style>

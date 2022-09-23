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
      @click="updateAndPreviewPost"
      :disable="isIncomplete"
      color="primary"
      label="Preview"
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
    const postItem = computed(() => store.getters["newPost/getPostItem"]);

    const isIncomplete = computed(() => {
      return newPost.value.topics.length &&
        newPost.value.title &&
        newPost.value.content
        ? false
        : true;
    });

    async function updateAndPreviewPost() {
      try {
        console.log(postItem.value.id, newPost.value);
        q.loading.show();
        await store.dispatch("newPost/updatePostItem", {
          postId: postItem.value.id,
          data: { ...newPost.value },
        });
        router.push({
          name: "PagePreview",
          params: { postId: postItem.value.id },
        });
        q.loading.hide();
      } catch (error) {
        console.log(error);
      }
    }

    return {
      isIncomplete,
      updateAndPreviewPost,
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

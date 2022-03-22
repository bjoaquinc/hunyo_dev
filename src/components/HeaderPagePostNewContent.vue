<template>
  <q-toolbar class="constrain mobile-only bg-white">
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
      :disable="missingFields"
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
    const { content, title, topics } = newPost.value;

    console.log(content, title, topics);

    const missingFields = computed(() => {
      return !topics.length || !title || !content ? true : false;
    });

    async function createPost() {
      try {
        q.loading.show({ message: "Uploading..." });
        await store.dispatch("newPost/createPost", {
          newPost: { ...newPost.value },
          imagesList: imagesList.value,
        });
        store.commit("newPost/clearState");
        q.loading.hide();
        router.push({ name: "PageHome" });
      } catch (error) {
        console.log(error);
        q.loading.hide();
      }
    }

    return {
      missingFields,
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

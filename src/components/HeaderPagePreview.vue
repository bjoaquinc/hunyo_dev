<template>
  <q-toolbar class="constrain lt-sm bg-white" v-if="postItem">
    <q-btn
      color="secondary"
      icon="fas fa-chevron-left"
      class="same-width"
      align="left"
      :to="{ name: 'PagePostNewContent', params: { postId: postItem.id } }"
      size="sm"
      dense
      flat
    />

    <q-toolbar-title class="text-center text-red">Preview</q-toolbar-title>

    <q-btn
      @click="publishPost"
      color="primary"
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
    const postItem = computed(() => store.getters["newPost/getPostItem"]);
    const unsubscribePostItem = computed(
      () => store.getters["newPost/unsubscribePostItem"]
    );

    async function publishPost() {
      try {
        q.loading.show({
          message: "Uploading...",
        });
        await store.dispatch("newPost/publishPost");
        await store.dispatch("newPost/toggleHasDrafts");
        if (unsubscribePostItem.value) unsubscribePostItem.value();
        store.commit("newPost/clearState");
        store.commit("amplitude/clearState");
        router.push({ name: "PageHome" });
        q.loading.hide();
      } catch (error) {
        console.log(error);
      }
    }

    return {
      publishPost,
      postItem,
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

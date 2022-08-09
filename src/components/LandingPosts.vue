<template>
  <div>
    <component
      :is="$q.platform.is.desktop ? 'FeedListDesktop' : 'FeedList'"
      :feedItems="postItems"
    />
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import FeedListDesktop from "src/components/FeedListDesktop.vue";
import FeedList from "src/components/FeedList.vue";

export default {
  components: { FeedListDesktop, FeedList },
  setup() {
    const store = useStore();
    const q = useQuasar();
    const postItems = computed(() => store.getters["posts/getLandingPosts"]);

    onMounted(async () => {
      try {
        q.loading.show();
        await store.dispatch("posts/setLandingPosts");
        q.loading.hide();
      } catch (error) {
        console.log(error);
      }
    });

    onUnmounted(() => {
      store.commit("posts/clearStatePosts");
    });

    return {
      postItems,
      q,
    };
  },
};
</script>

<template>
  <div>
    <q-btn
      color="primary"
      :class="q.platform.is.mobile && !q.platform.is.ipad ? 'q-mx-sm' : ''"
      class="q-my-md"
      icon="fas fa-arrow-left"
      label="Back to Home Page"
      :to="{ name: 'PageLanding' }"
      dense
      flat
    />
    <FeedList :feedItems="postItems" />
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import FeedList from "src/components/FeedList.vue";

export default {
  components: { FeedList },
  setup() {
    const store = useStore();
    const q = useQuasar();
    const postItems = computed(() => store.getters["posts/getLandingPosts"]);

    onMounted(async () => {
      try {
        await store.dispatch("posts/setLandingPosts");
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

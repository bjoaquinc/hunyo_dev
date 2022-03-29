<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-sm-7 feed">
      <q-btn
        color="primary"
        :class="q.platform.is.mobile ? 'q-mx-sm' : ''"
        class="q-my-md"
        icon="fas fa-arrow-left"
        label="Back to Home Page"
        :to="{ name: 'PageLanding' }"
        dense
        flat
      />
      <FeedList :feedItems="postItems" />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
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

    return {
      postItems,
      q,
    };
  },
};
</script>

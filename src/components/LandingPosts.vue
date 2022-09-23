<template>
  <div>
    <q-tabs v-model="tab" inline-label class="text-secondary">
      <q-route-tab
        v-for="(topic, index) in tabs"
        :key="index"
        :to="
          user && user.uid
            ? { name: 'PageHome', query: { topic } }
            : { name: 'PageLanding' }
        "
        :label="topic"
        :name="topic"
        no-caps
      />
    </q-tabs>
    <component
      :is="$q.platform.is.desktop ? 'FeedListDesktop' : 'FeedList'"
      :feedItems="postItems"
    />
    <div class="full-width flex q-my-md">
      <q-btn
        :to="{ name: 'PageLanding' }"
        v-if="postItems && postItems.length"
        color="primary"
        class="q-ml-auto text-weight-bold"
        size="lg"
        align="right"
        label="Sign in to see more posts >>"
        dense
        flat
      />
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import FeedListDesktop from "src/components/FeedListDesktop.vue";
import FeedList from "src/components/FeedList.vue";

export default {
  components: { FeedListDesktop, FeedList },
  setup() {
    const store = useStore();
    const q = useQuasar();
    const user = computed(() => store.getters["auth/getUser"]);
    const postItems = computed(() => store.getters["posts/getLandingPosts"]);
    const tabs = ref([
      "All Topics",
      "Materials",
      "Details",
      "Methods",
      "Design Approaches",
      "Interiors",
    ]);
    const tab = computed(() => tabs.value[0]);

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
      user,
      tabs,
      tab,
    };
  },
};
</script>

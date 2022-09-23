<template>
  <div>
    <q-tabs v-model="tab" inline-label class="text-secondary">
      <q-tab
        v-for="(topic, index) in topics"
        :key="index"
        v-model="tab"
        :label="topic"
        :name="topic"
        no-caps
      />
    </q-tabs>
    <q-infinite-scroll @load="onLoad" :offset="250">
      <component
        v-for="(feedItemsList, index) in feedItemsLists"
        :key="index"
        :is="$q.platform.is.desktop ? 'FeedListDesktop' : 'FeedList'"
        :feedItems="feedItemsList"
        feedLocation="user feed"
        class="bg-grey2"
      />
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import FeedList from "src/components/FeedList.vue";
import FeedListDesktop from "src/components/FeedListDesktop.vue";
import amplitude from "amplitude-js";

export default {
  name: "PageHome",
  components: {
    FeedList,
    FeedListDesktop,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const doneScrolling = ref(false);
    const q = useQuasar();
    const user = computed(() => store.getters["auth/getUser"]);
    const topics = ref([
      "All Topics",
      "Materials",
      "Details",
      "Methods",
      "Design Approaches",
    ]);
    const tab = computed({
      get: () => store.getters["feed/getTopic"],
      set: (value) => store.commit("feed/setTopic", value),
    });
    const feedItemsLists = computed(
      () => store.getters["feed/getFeedItemsLists"]
    );
    let lastVisible = null;

    const logEvent = (name, data) => {
      try {
        amplitude.getInstance().logEventWithTimestamp(name, data);
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(async () => {
      let topic = "All Topics";
      if (route.query.topic) {
        topic = route.query.topic;
      }
      tab.value = topic;
      if (!feedItemsLists.value || !feedItemsLists.value.length) {
        try {
          q.loading.show();
          const lastPost = await store.dispatch("feed/setFeedItems", topic);
          console.log(lastPost);
          lastVisible = lastPost;
          console.log(lastVisible);
          q.loading.hide();
        } catch (error) {
          console.log(error);
          q.loading.hide();
        }
      }
    });

    const onLoad = async (index, done) => {
      if (!doneScrolling.value && user.value && user.value.uid) {
        try {
          const lastPost = await store.dispatch(
            "feed/setNextFeedItems",
            lastVisible
          );
          lastVisible = lastPost;
          done();
        } catch (error) {
          console.log(error.message);
          if (error.message === "No posts available") {
            doneScrolling.value = true;
            done();
          } else {
            done();
          }
        }
      } else {
        done();
      }
    };

    const setTopicQuery = async (topic) => {
      router.replace({ query: { topic } });
    };

    watch(tab, async (newValue, oldValue) => {
      if (route.name !== "PageHome") return;
      try {
        setTopicQuery(newValue);
        const lastPost = await store.dispatch("feed/setFeedItems", newValue);
        lastVisible = lastPost;
        doneScrolling.value = false;
      } catch (error) {
        console.log(error);
      }
    });

    onBeforeRouteLeave(async (to, from) => {
      if (to.name !== "FeedPost" && to.name !== "FeedUser") {
        console.log("clear state triggered");
        store.commit("feed/clearStateFeedItems");
      }
    });

    return {
      topics,
      tab,
      feedItemsLists,
      onLoad,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    padding-top: 21px
</style>

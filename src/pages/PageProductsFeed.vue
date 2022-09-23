<template>
  <div>
    <q-tabs v-model="tab" inline-label class="text-secondary">
      <q-tab
        v-for="(category, index) in categories"
        :key="index"
        :label="category"
        :name="category"
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
import amplitude from "amplitude-js";

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const doneScrolling = ref(false);
    const q = useQuasar();
    const categories = ref([
      "All Categories",
      "Windows & Doors",
      "Roofing",
      "Lighting",
      "Solar",
      "Rugs & Carpets",
      "Bathroom",
    ]);
    const tab = ref("");
    const feedItemsLists = computed(
      () => store.getters["feed/getFeedItemsLists"]
    );
    const lastVisible = computed(() => store.getters["feed/getLastVisible"]);

    const logEvent = (name, data) => {
      try {
        amplitude.getInstance().logEventWithTimestamp(name, data);
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(async () => {
      let category = "All Topics";
      if (route.query.category) {
        category = route.query.category;
      }
      tab.value = category;
      if (!feedItemsLists.value || !feedItemsLists.value.length) {
        try {
          q.loading.show();
          await store.dispatch("feed/setFeedItems", category);
          q.loading.hide();
        } catch (error) {
          console.log(error);
          q.loading.hide();
        }
      }
    });

    const onLoad = async (index, done) => {
      if (lastVisible.value && !doneScrolling.value) {
        try {
          await store.dispatch("feed/setNextFeedItems");
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

    const setTopic = async (category) => {
      router.replace({ query: { category } });
    };

    watch(route, async (newValue, oldValue) => {
      console.log(newValue, oldValue);
      if (route.name !== "PageHome") return;
      try {
        const category = route.query.category;
        await store.dispatch("feed/setFeedItems", category);
        doneScrolling.value = false;
      } catch (error) {
        console.log(error);
      }
    });

    onBeforeRouteLeave(async (to, from) => {
      if (to.name !== "FeedPost" && to.name !== "FeedUser") {
        store.commit("feed/clearStateFeedItems");
      }
    });

    return {
      categories,
      tab,
      feedItemsLists,
      onLoad,
      setTopic,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    padding-top: 21px
</style>

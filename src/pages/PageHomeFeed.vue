<template>
  <div :class="$route.name === 'FeedPost' ? '' : 'constrain'">
    <div :class="$route.name !== 'FeedPost' ? 'row q-col-gutter-md' : ''">
      <div
        :class="$route.name !== 'FeedPost' ? 'col-12 col-sm-7 q-mx-auto' : ''"
      >
        <FeedList :feedItems="feedItems" feedLocation="user feed" />
      </div>
    </div>
  </div>
</template>

<script>
import FeedList from "src/components/FeedList.vue";

export default {
  name: "PageHome",
  components: {
    FeedList,
  },
  computed: {
    feedItems() {
      return this.$store.getters["feed/getFeedItems"];
    },
  },
  async created() {
    try {
      this.$q.loading.show();
      await this.$store.dispatch("feed/setFeedItems");
      this.$q.loading.hide();
    } catch (error) {
      console.log(error);
    }
  },
  beforeRouteLeave(to, from) {
    if (to.name !== "FeedPost" && to.name !== "FeedUser") {
      this.$store.commit("feed/clearStateFeedItems");
    }
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    padding-top: 21px
</style>

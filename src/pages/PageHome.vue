<template>
  <q-page class="constrain">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-7 q-mx-auto feed">
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            :feedItems="feedItems"
            feedLocation="user feed"
          />
        </router-view>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageHome",
  computed: {
    feedItems() {
      return this.$store.getters["feed/getFeedItems"];
    },
    postItem() {
      return this.$store.getters["newPost/getPostItem"];
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
  beforeRouteLeave() {
    this.$store.commit("feed/clearStateFeedItems");
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    margin-top: 21px
</style>

<template>
  <q-page class="constrain">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-7 q-mx-auto feed">
        <router-view v-slot="{ Component }">
          <component :is="Component" :feedItems="feedItems" />
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
  },
  async created() {
    try {
      await this.$store.dispatch("feed/setFeedItems");
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

<template>
  <q-list class="bg-grey-1">
    <q-item
      v-for="(feedItem, index) in feedItems"
      :id="id"
      :key="index"
      class="q-mb-md"
    >
      <Component :is="type(index)" :feedItem="feedItem" />
    </q-item>
  </q-list>
</template>

<script>
import RecommendItem from "src/components/RecommendItem.vue";
import PostItem from "src/components/PostItem.vue";

export default {
  props: ["feedItems"],
  components: {
    post: PostItem,
    recommendation: RecommendItem,
  },
  methods: {
    type(index) {
      return this.feedItems[index].type;
    },
    id(index) {
      return this.feedItems[index].id;
    },
  },
};
</script>

<style lang="sass" scoped>
.q-item
  flex-wrap: wrap
  display: inherit
  position: inherit
  padding: 0 0 0 0
</style>

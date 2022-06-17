<template>
  <q-list class="bg-grey-1">
    <q-item
      v-for="(feedItem, index) in feedItems"
      :id="id"
      :key="index"
      class="q-mb-md"
    >
      <Component
        :is="type(index)"
        :feedItem="feedItem"
        :feedLocation="feedLocation"
      />
    </q-item>
  </q-list>
</template>

<script>
import PostItem from "src/components/PostItem.vue";

export default {
  props: ["feedItems", "feedLocation"],
  components: {
    post: PostItem,
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

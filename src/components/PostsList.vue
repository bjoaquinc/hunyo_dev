<template>
  <q-list class="bg-grey-1">
    <RecommendItem />
    <q-item
      v-for="{ imagesList, date, id, title, user } in getPostsList"
      :key="id"
    >
      <PostItem
        :imagesList="imagesList"
        :date="date"
        :title="title"
        :id="id"
        :user="user"
      />
    </q-item>
  </q-list>
</template>

<script>
import PostItem from "src/components/PostItem.vue";
import RecommendItem from "src/components/RecommendItem.vue";

export default {
  name: "PostsList",
  components: {
    PostItem,
    RecommendItem,
  },
  computed: {
    getPostsList() {
      return this.$store.getters["newPost/getPostsList"];
    },
  },
};
</script>

<style lang="sass" scoped>
.q-item
  flex-wrap: wrap
  display: inherit
  position: inherit
  padding: 2px 0 0 0
</style>

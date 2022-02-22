<template>
  <q-list class="bg-grey-1">
    <q-item v-for="{ imagesList, date, id, title } in getPostsList" :key="id">
      <PostItem :imagesList="imagesList" :date="date" :title="title" :id="id" />
    </q-item>
  </q-list>
</template>

<script>
import PostItem from "src/components/PostItem.vue";

export default {
  name: "PostsList",
  components: {
    PostItem,
  },
  computed: {
    getPostsList() {
      console.log("running");
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

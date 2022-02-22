<template>
  <div>
    <div class="flex items-center q-mb-md desktop-only">
      <q-btn
        color="primary"
        icon="fas fa-arrow-left"
        label="Return"
        :to="{ name: 'PageHome' }"
        dense
        flat
      />
      <q-btn
        class="q-ml-auto q-mr-sm"
        color="primary"
        icon="fas fa-ellipsis-h"
        @click="openDialogPostActions"
        flat
      />
      <q-btn color="primary" icon="fas fa-folder" label="Save" unelevated />
    </div>
    <PostDetail :content="content" :title="title" :imagesList="imagesList" />
    <CommentsList />
  </div>
</template>

<script>
import { getDocs } from "firebase/firestore";
import PostDetail from "src/components/PostDetail.vue";
import CommentsList from "src/components/CommentsList.vue";
import DialogPostActions from "src/components/DialogPostActions.vue";

export default {
  name: "PagePost",
  data() {
    return {
      content: "",
      imagesList: [],
      title: "",
    };
  },
  props: ["postId"],
  computed: {
    postsList() {
      return this.$store.getters["newPost/getPostsList"];
    },
  },
  components: {
    PostDetail,
    CommentsList,
  },
  methods: {
    openDialogPostActions() {
      this.$q.dialog({
        component: DialogPostActions,
      });
    },
  },
  async created() {
    console.log(this.postId);
    this.$store.dispatch(
      "newPost/getPostsCollection",
      await getDocs(this.$postsRef)
    );
    const selectedPost = this.postsList.find((post) => post.id === this.postId);
    const { content, title, imagesList } = selectedPost;
    this.content = content;
    this.title = title;
    this.imagesList = imagesList;
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    margin-top: 21px
</style>

<template>
  <div>
    <div class="flex items-center q-mb-md desktop-only">
      <q-btn
        color="primary"
        icon="fas fa-arrow-left"
        label="Return"
        @click="$router.go(-1)"
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
      <q-btn
        @click="openDialogFoldersList"
        color="primary"
        icon="fas fa-folder"
        label="Save"
        unelevated
      />
    </div>
    <PostDetail
      :content="content"
      :title="title"
      :imagesList="imagesList"
      :postId="postId"
      :user="user"
    />
    <CommentsList :postId="postId" id="comments" />
  </div>
</template>

<script>
import { auth } from "src/boot/firebase";
import PostDetail from "src/components/PostDetail.vue";
import CommentsList from "src/components/CommentsList.vue";
import DialogPostActions from "src/components/DialogPostActions.vue";
import DialogFoldersList from "src/components/DialogFoldersList.vue";

export default {
  name: "PagePost",
  data() {
    return {
      content: "",
      imagesList: [],
      title: "",
      user: null,
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
    openDialogFoldersList() {
      const postData = {
        title: this.title,
        id: this.postId,
        user: this.user,
        image: "",
      };
      if (this.imagesList && this.imagesList.length > 0) {
        postData.image = this.imagesList[0];
      }
      this.$q.dialog({
        component: DialogFoldersList,
        componentProps: {
          postData,
        },
      });
    },
    openDialogPostActions() {
      let image = "";
      if (this.imagesList && this.imagesList.length > 0) {
        image = this.imagesList[0];
      }
      this.$q.dialog({
        component: DialogPostActions,
        componentProps: {
          postData: {
            image: image,
            title: this.title,
            id: this.postId,
            user: this.user,
          },
        },
      });
    },
  },
  async created() {
    try {
      await this.$store.dispatch("posts/setSelectedPost", this.postId);
      const selectedPost = this.$store.getters["posts/getSelectedPost"];
      const { content, title, imagesList, user, userReads } = selectedPost;
      this.content = content;
      this.title = title;
      this.imagesList = imagesList;
      this.user = user;

      if (userReads && userReads.includes(auth.currentUser.uid)) return;
      if (user.id === auth.currentUser.uid) return;
      await this.$store.dispatch("posts/readPost", this.postId);
      await this.$store.dispatch("notifications/createNotification", {
        type: "postRead",
        userId: user.id,
        content: title,
        route: {
          name: "FeedUser",
          params: {
            userId: auth.currentUser.uid,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    margin-top: 21px
</style>

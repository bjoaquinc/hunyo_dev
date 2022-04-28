<template>
  <div :class="isPublic ? 'row' : ''">
    <div
      :class="isPublic ? 'col-12 col-sm-7 q-mx-auto' : ''"
      v-if="selectedPost"
    >
      <div class="flex items-center q-mb-md gt-xs">
        <q-btn
          color="primary"
          icon="fas fa-arrow-left"
          label="Return"
          @click="$router.go(-1)"
          dense
          flat
        />
        <q-btn
          v-if="!isPublic"
          class="q-ml-auto q-mr-sm"
          color="primary"
          icon="fas fa-ellipsis-h"
          @click="openDialogPostActions"
          flat
        />
        <q-btn
          v-if="!isPublic"
          @click="openDialogFoldersList"
          color="primary"
          icon="fas fa-folder"
          label="Save"
          unelevated
        />
      </div>
      <PostDetail
        :content="selectedPost.content"
        :title="selectedPost.title"
        :imagesList="selectedPost.imagesList"
        :postId="selectedPost.postId"
        :user="selectedPost.user"
        :topics="selectedPost.topics"
      />
      <CommentsList v-if="!isPublic" :postId="postId" id="comments" />
    </div>
  </div>
</template>

<script>
import amplitude from "amplitude-js";
import PostDetail from "src/components/PostDetail.vue";
import CommentsList from "src/components/CommentsList.vue";
import DialogPostActions from "src/components/DialogPostActions.vue";
import DialogFoldersList from "src/components/DialogFoldersList.vue";
import DialogLandingPopUp from "src/components/DialogLandingPopUp.vue";

export default {
  name: "PagePost",
  props: ["postId"],
  computed: {
    isPublic() {
      return this.$route.name === "LandingPost" ? true : false;
    },
    currentUser() {
      return this.$store.getters["auth/getUser"];
    },
    userData() {
      return this.$store.getters["profile/getUserData"];
    },
    selectedPost() {
      return this.$store.getters["posts/getSelectedPost"];
    },
    unsubscribeSelectedPost() {
      return this.$store.getters["posts/getUnsubscribeSelectedPost"];
    },
  },
  components: {
    PostDetail,
    CommentsList,
  },
  methods: {
    openDialogFoldersList() {
      const postData = {
        title: this.selectedPost.title,
        id: this.selectedPost.postId,
        user: this.selectedPost.user,
        image: "",
      };
      if (
        this.selectedPost.imagesList &&
        this.selectedPost.imagesList.length > 0
      ) {
        postData.image = this.selectedPost.imagesList[0];
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
      if (
        this.selectedPost.imagesList &&
        this.selectedPost.imagesList.length > 0
      ) {
        image = this.selectedPost.imagesList[0];
      }
      this.$q.dialog({
        component: DialogPostActions,
        componentProps: {
          postData: {
            image: image,
            title: this.selectedPost.title,
            id: this.selectedPost.postId,
            user: this.selectedPost.user,
            content: this.selectedPost.content,
            postId: this.selectedPost.postId,
          },
        },
      });
    },
  },
  async created() {
    try {
      // amplitude.getInstance().logEvent("save - view post", {
      //   "post id": this.postId,
      //   "post type": topics,
      // });
      await this.$store.dispatch("posts/setSelectedPost", this.postId);
      if (!this.currentUser) return;
      if (
        this.selectedPost.userReads &&
        this.selectedPost.userReads.includes(this.currentUser.uid)
      )
        return;
      if (this.selectedPost.user.id === this.currentUser.uid) return;
      if (this.userData.admin) return;
      await this.$store.dispatch("posts/readPost", this.selectedPost.postId);
      await this.$store.dispatch("notifications/createNotification", {
        type: "postRead",
        userId: this.selectedPost.user.id,
        content: this.selectedPost.title,
        route: {
          name: "FeedUser",
          params: {
            userId: this.currentUser.uid,
          },
        },
      });
      var identify = new amplitude.Identify().add("num total posts view", 1);
      amplitude.getInstance().identify(identify);
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    if (this.$route.name === "LandingPost") {
      setTimeout(() => {
        if (this.$route.name !== "LandingPost") return;
        this.$q.dialog({
          component: DialogLandingPopUp,
        });
      }, 2000);
    }
  },
  beforeRouteLeave() {
    if (this.unsubscribeSelectedPost) {
      this.unsubscribeSelectedPost();
    }
    this.$store.commit("posts/clearStatePost");
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    margin-top: 21px
</style>

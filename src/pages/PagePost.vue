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
          :to="
            $router.options.history.state.back
              ? $router.options.history.state.back
              : { name: 'PageHome' }
          "
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
        :numUserReads="
          selectedPost.userReads ? selectedPost.userReads.length : null
        "
      />
      <CommentsList
        v-if="!isPublic"
        :postId="postId"
        :postUser="selectedPost.user"
        id="comments"
      />
      <router-view v-slot="{ Component }">
        <q-dialog v-model="cropperDialog" persistent maximized>
          <component :is="Component" @closeDialog="closeDialog" />
        </q-dialog>
      </router-view>
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
  data() {
    return {
      startTimestamp: "",
      cropperDialog: false,
    };
  },
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
    postItem() {
      return this.$store.getters["newPost/getPostItem"];
    },
  },
  components: {
    PostDetail,
    CommentsList,
  },
  watch: {
    $route(newValue, oldValue) {
      if (
        newValue.name === "FeedPostCropper" ||
        newValue.name === "ProfilePostCropper"
      ) {
        if (this.postItem) {
          this.cropperDialog = true;
        } else {
          this.editImages();
        }
      }
    },
  },
  methods: {
    openDialogFoldersList() {
      const postData = {
        title: this.selectedPost.title,
        id: this.selectedPost.postId,
        user: this.selectedPost.user,
        image: "",
        topics: this.selectedPost.topics,
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
          source: "post top",
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
    async editImages() {
      await this.$store.dispatch(
        "newPost/setPostItem",
        this.selectedPost.postId
      );
      await this.$store.dispatch("newPost/setUploadedImages");
      this.$store.commit("newPost/generateImageOrder");
      this.cropperDialog = true;
    },
    closeDialog() {
      this.cropperDialog = false;
    },
  },
  async created() {
    try {
      await this.$store.dispatch("posts/setSelectedPost", this.postId);
      if (!this.currentUser) return;
      if (this.selectedPost.user.id === this.currentUser.uid) return;
      if (this.userData.admin) return;
      // Send view post event to Amplitude
      const followingList =
        this.$store.getters["subscriptions/getFollowingList"];
      amplitude.getInstance().logEventWithTimestamp("save - view post", {
        "post id": this.selectedPost.postId,
        topics: this.selectedPost.topics,
        source: this.$route.params.feedLocation
          ? this.$route.params.feedLocation
          : "link",
        "num total views": this.selectedPost.userReads
          ? this.selectedPost.userReads.length
          : 0,
        "author id": this.selectedPost.user.id,
        "is subscribe": followingList.includes(this.selectedPost.user.id),
      });
      // console.log("Successfully sent view post event");
      if (
        this.selectedPost.userReads &&
        this.selectedPost.userReads.includes(this.currentUser.uid)
      )
        return;
      await this.$store.dispatch("posts/readPost", this.selectedPost.postId);
      // Send notification for post read
      await this.$store.dispatch("notifications/createNotification", {
        type: "postRead",
        userId: this.selectedPost.user.id,
        content: this.selectedPost.title,
        route: {
          name: "FeedUser",
          params: {
            userId: this.currentUser.uid,
            source: "notification",
          },
        },
      });
      // Increment num total view post user property Amplitude
      var identify = new amplitude.Identify().add("num total view post", 1);
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
    this.startTimestamp = new Date();
  },
  unmounted() {
    try {
      if (
        !this.isPublic &&
        this.currentUser &&
        this.currentUser.uid !== this.selectedPost.user.id
      ) {
        // Send leave post event to Amplitude
        const endTimestamp = new Date();
        const duration = Math.floor(
          (endTimestamp - this.startTimestamp) / 1000
        );
        const followingList =
          this.$store.getters["subscriptions/getFollowingList"];
        amplitude.getInstance().logEventWithTimestamp("leave post", {
          "post id": this.selectedPost.postId,
          topics: this.selectedPost.topics,
          "num total views": this.selectedPost.userReads
            ? this.selectedPost.userReads.length
            : 0,
          "author id": this.selectedPost.user.id,
          "is subscribe": followingList.includes(this.selectedPost.user.id),
          duration,
        });
      }
      // Unsub and clear state
      if (this.unsubscribeSelectedPost) {
        this.unsubscribeSelectedPost();
      }
      this.$store.commit("posts/clearStatePost");
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

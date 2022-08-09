<template>
  <div
    class="row q-mx-auto"
    :class="$q.platform.is.desktop ? 'q-col-gutter-md' : ''"
    :style="
      $q.platform.is.desktop
        ? { maxWidth: $q.platform.is.ipad ? '90vw' : '80vw' }
        : null
    "
  >
    <div
      class="col"
      v-if="imagesList && imagesList.length && $q.platform.is.desktop"
    >
      <BaseCarousel :imagesList="imagesList" />
    </div>
    <div
      class="col-12 q-mx-auto"
      :class="$q.platform.is.ipad || !imagesList ? 'col-sm-8' : 'col-sm-6'"
      v-if="selectedPost"
    >
      <PostDetail
        v-if="selectedPost"
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
import ProductDetail from "src/components/ProductDetail.vue";
import CommentsList from "src/components/CommentsList.vue";
import BaseCarousel from "src/components/BaseCarousel.vue";

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
    imagesList() {
      const postItem = this.$store.getters["posts/getSelectedPost"];
      if (postItem && postItem.imagesList && postItem.imagesList.length) {
        return postItem.imagesList;
      } else {
        return null;
      }
    },
  },
  components: {
    PostDetail,
    ProductDetail,
    CommentsList,
    BaseCarousel,
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
      const selectedPost = await this.$store.dispatch(
        "posts/setSelectedPost",
        this.postId
      );
      if (!this.currentUser) return;
      const userData = await this.$store.dispatch(
        "profile/setUserData",
        this.currentUser.uid
      );
      if (userData && userData.admin) return;
      // Send view post event to Amplitude
      const followingList =
        this.$store.getters["subscriptions/getFollowingList"];
      amplitude.getInstance().logEventWithTimestamp("save - view post", {
        "post id": selectedPost.postId,
        topics: selectedPost.topics,
        source: this.$route.params.feedLocation
          ? this.$route.params.feedLocation
          : "link",
        "num total views": selectedPost.userReads
          ? selectedPost.userReads.length
          : 0,
        "author id": selectedPost.user.id,
        "is subscribe": followingList.includes(selectedPost.user.id),
      });
      console.log("Successfully sent view post event");
      if (
        selectedPost.userReads &&
        selectedPost.userReads.includes(this.currentUser.uid)
      )
        return;
      await this.$store.dispatch("posts/readPost", selectedPost.postId);
      // Send notification for post read
      if (selectedPost.user.id === this.currentUser.uid) return;
      await this.$store.dispatch("notifications/createNotification", {
        type: "postRead",
        userId: selectedPost.user.id,
        content: selectedPost.title,
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
    // if (this.$route.name === "LandingPost") {
    //   setTimeout(() => {
    //     if (this.$route.name !== "LandingPost") return;
    //     this.$q.dialog({
    //       component: DialogLandingPopUp,
    //     });
    //   }, 2000);
    // }
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
    padding-top: 21px
</style>

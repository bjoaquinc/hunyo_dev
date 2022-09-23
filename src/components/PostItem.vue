<template>
  <q-card flat bordered>
    <q-card-section style="padding: 0 !important">
      <q-item
        class="row flex column"
        clickable
        :to="{
          name: postRoute,
          params: {
            postId: postId,
            feedLocation: feedLocation,
          },
        }"
      >
        <q-item-label
          style="padding: 16px 0 !important"
          class="text-weight-bold flex items-center col"
          :class="
            $q.platform.is.mobile && !$q.platform.is.ipad
              ? 'text-h6'
              : 'text-h6'
          "
          >{{ title }} / {{ formattedTopics }}</q-item-label
        >
        <q-img
          ratio="1"
          style="border: 1px solid rgba(0, 0, 0, 0.12)"
          :src="imagesList[0]"
          v-if="imagesList && imagesList.length > 0"
        />
        <q-img
          ratio="1"
          style="border: 1px solid rgba(0, 0, 0, 0.12)"
          src="hunyo_logo_small.png"
          v-else
        />
      </q-item>
    </q-card-section>

    <q-item
      clickable
      :to="{
        name: userRoute,
        params: { userId: user.id, lastRoute: $route.name, source: 'feed' },
      }"
    >
      <q-item-section avatar>
        <q-avatar>
          <img :src="user.photo" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-weight-bold" caption>{{
          user.name
        }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script>
import DialogFoldersList from "src/components/dialogs/DialogFoldersList.vue";

export default {
  name: "PostItem",
  props: ["feedItem", "feedLocation"],
  data() {
    return {
      hover: false,
    };
  },
  computed: {
    imagesList() {
      if (this.feedItem.imagesList && this.feedItem.imagesList.length > 0) {
        return this.feedItem.imagesList;
      } else {
        return [];
      }
    },
    title() {
      return this.feedItem.title;
    },
    postId() {
      return this.feedItem.postId;
    },
    user() {
      return this.feedItem.user;
    },
    formattedTopics() {
      let topicString = "";
      const topics = this.feedItem.topics;
      for (let index = 0; index < topics.length; index++) {
        if (index > 1) break;
        if (index === 0) {
          topicString += topics[index];
        } else {
          topicString += `, ${topics[index]}`;
        }
      }
      return topicString.toLowerCase();
    },
    userRoute() {
      const userLocation = this.$route.meta.location;
      console.log(userLocation);
      if (userLocation && userLocation === "feed") {
        return "FeedUser";
      } else if (userLocation && userLocation === "profile") {
        return "ProfileUser";
      } else {
        return "LandingUser";
      }
    },
    postRoute() {
      const postLocation = this.$route.meta.location;
      if (postLocation && postLocation === "feed") {
        return "FeedPost";
      } else if (postLocation && postLocation === "profile") {
        return "ProfilePost";
      } else {
        return "LandingPost";
      }
    },
    isPublic() {
      return this.$route.name === "LandingPosts" ? true : false;
    },
  },
  methods: {
    openDialogFoldersList() {
      const postData = {
        title: this.feedItem.title,
        id: this.feedItem.postId,
        user: this.feedItem.user,
        image: "",
        topics: this.feedItem.topics,
      };
      if (this.imagesList && this.imagesList.length > 0) {
        postData.image = this.imagesList[0];
      }
      this.$q.dialog({
        component: DialogFoldersList,
        componentProps: {
          postData,
          source: this.feedLocation,
        },
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.q-card__actions
  .q-btn
    width: 50%


.q-card__section
  padding: 8px 16px

.q-item__section
  padding-right: 0 !important
</style>

<template>
  <q-card flat bordered>
    <q-card-section style="padding: 8px 0 !important">
      <q-item class="row" clickable>
        <q-item-label
          class="text-weight-bold flex items-center col"
          :class="
            $q.platform.is.mobile && !$q.platform.is.ipad
              ? 'text-subtitle1'
              : 'text-h6'
          "
          @click="readPost"
          >{{ title }} / {{ formattedTopics }}</q-item-label
        >
      </q-item>
    </q-card-section>

    <BaseCarousel
      :imagesList="imagesList"
      v-if="imagesList && imagesList.length > 0"
    />

    <q-item
      clickable
      :to="{
        name: userRoute,
        params: { userId: user.id, lastRoute: $route.name },
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
    <q-card-actions class="q-px-md">
      <q-btn
        v-if="!isPublic"
        @click="openDialogFoldersList"
        color="primary"
        unelevated
        icon="fas fa-folder"
        label="Save for Later"
      />
      <q-space />
      <q-btn
        align="right"
        color="primary"
        flat
        label="Read now"
        icon-right="fas fa-chevron-right"
        @click="readPost"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import amplitude from "amplitude-js";
import BaseCarousel from "src/components/BaseCarousel.vue";
import DialogFoldersList from "src/components/DialogFoldersList.vue";

export default {
  name: "PostItem",
  components: {
    BaseCarousel,
  },
  props: ["feedItem"],
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
      amplitude.getInstance().logEvent("save - start", {
        "post id": this.postId,
        source:
          this.$route.name === "PageHome" ? "feed - post" : "profile - post",
      });
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
    async readPost() {
      // amplitude.getInstance().logEvent("save - click read post");
      this.$router.push({
        name: this.postRoute,
        params: { postId: this.postId },
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

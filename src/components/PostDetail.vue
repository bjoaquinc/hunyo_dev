<template>
  <component
    :is="
      $q.platform.is.desktop && imagesList && imagesList.length
        ? 'q-responsive'
        : 'div'
    "
    ratio="1"
  >
    <q-card class="my-card overflow-auto" bordered flat v-if="isReady">
      <q-item>
        <q-item-label class="text-weight-bold text-h4 q-pt-sm gt-lg"
          >{{ title }} / {{ formattedTopics }}</q-item-label
        >
        <q-item-label class="text-weight-bold text-h4 q-pt-sm gt-xs lt-xl"
          >{{ title }} / {{ formattedTopics }}</q-item-label
        >
        <q-item-label class="text-weight-bold text-h5 q-pt-sm lt-sm"
          >{{ title }} / {{ formattedTopics }}</q-item-label
        >
      </q-item>

      <div class="flex items-center q-mx-sm gt-xs">
        <q-btn
          v-if="!isPublic"
          color="primary"
          class="q-ml-xs"
          icon="fas fa-ellipsis-h"
          @click="openDialogPostActions"
          flat
          dense
        />
      </div>

      <BaseCarousel
        class="q-pt-sm"
        :imagesList="imagesList"
        :postId="postId"
        :userId="user.id"
        :topics="topics"
        :numUserReads="numUserReads"
        location="post"
        v-if="$q.platform.is.mobile && imagesList && imagesList.length"
      />

      <q-card-section class="q-pt-md gt-lg">
        <div
          class="text-body1"
          style="white-space: pre-wrap"
          v-html="sanitizeDisplayText(content)"
        />
      </q-card-section>

      <q-card-section class="q-pt-md q-mt-md lt-xl">
        <div
          class="text-body1"
          style="white-space: pre-wrap"
          v-html="sanitizeDisplayText(content)"
        />
      </q-card-section>

      <q-card-actions align="around" v-if="!isPublic">
        <q-btn
          @click="openDialogFoldersList"
          v-intersection="onVisible"
          class="full-width"
          color="primary"
          icon="fas fa-folder"
          label="Save"
          size="md"
          unelevated
        />
      </q-card-actions>

      <q-separator />

      <q-card-actions align="between">
        <q-item
          class="q-py-sm q-px-sm full-width"
          :style="
            $route.name === 'LandingPost'
              ? { borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }
              : null
          "
          clickable
          :to="{
            name: userRoute,
            params: { userId: user.id, source: 'post' },
          }"
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src="user.photo" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-grey-7 text-body1">{{
              user.name
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-actions>

      <q-separator v-if="!isPublic" />

      <q-item v-if="!isPublic">
        <q-item-section avatar>
          <q-avatar>
            <img :src="currentUserData.photoURL" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-btn
            @click="openDialogCommentCreate"
            align="left"
            color="grey-3"
            label="Add a comment..."
            text-color="grey-7"
            no-caps
            rounded
            unelevated
          />
        </q-item-section>
      </q-item>
      <CommentsList
        v-if="!isPublic"
        :postId="postId"
        :postUser="selectedPost.user"
        id="comments"
      />
    </q-card>
  </component>
</template>

<script>
import amplitude from "amplitude-js";
import BaseCarousel from "src/components/BaseCarousel.vue";
import DialogCommentCreate from "src/components/dialogs/DialogCommentCreate.vue";
import DialogFoldersList from "src/components/dialogs/DialogFoldersList.vue";
import DialogPostActions from "src/components/dialogs/DialogPostActions.vue";
import CommentsList from "src/components/CommentsList.vue";
import { sanitizeDisplayText } from "src/logic/Sanitize.js";

export default {
  name: "PostItem",
  components: {
    BaseCarousel,
    CommentsList,
  },
  props: [
    "content",
    "title",
    "imagesList",
    "postId",
    "user",
    "topics",
    "numUserReads",
  ],
  data() {
    return {
      visibleStartTimestamp: "",
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters["auth/getUser"];
    },
    currentUserData() {
      return this.$store.getters["profile/getUserData"];
    },
    isReady() {
      return this.content && this.title && this.postId && this.user
        ? true
        : false;
    },
    selectedPost() {
      return this.$store.getters["posts/getSelectedPost"];
    },
    formattedTopics() {
      let topicString = "";
      const topics = this.topics;
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
    isPublic() {
      return this.$route.name === "LandingPost" ? true : false;
    },
  },
  methods: {
    sanitizeDisplayText(text) {
      const sanitizedText = sanitizeDisplayText(text);
      return sanitizedText;
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
            ...this.selectedPost,
          },
        },
      });
    },
    openDialogFoldersList() {
      const postData = {
        title: this.title,
        id: this.postId,
        user: this.user,
        image: "",
        topics: this.topics,
      };
      if (this.imagesList && this.imagesList.length > 0) {
        postData.image = this.imagesList[0];
      }
      this.$q.dialog({
        component: DialogFoldersList,
        componentProps: {
          postData,
          source: "post bottom",
        },
      });
    },
    openDialogCommentCreate() {
      this.$q.dialog({
        component: DialogCommentCreate,
        componentProps: {
          postId: this.postId,
          user: this.user,
        },
      });
    },
    onVisible(entry) {
      if (entry.isIntersecting) {
        console.log("Its in viewport!");
        this.visibleStartTimestamp = new Date();
      } else if (!entry.isIntersecting && this.visibleStartTimestamp) {
        // Send read post bottom event
        if (this.currentUser.uid !== this.user.id) {
          const visibleEndTimestamp = new Date();
          const duration = Math.floor(
            (visibleEndTimestamp - this.visibleStartTimestamp) / 1000
          );
          const contentList = this.content.split(" ");
          amplitude.getInstance().logEventWithTimestamp("read post bottom", {
            duration,
            "post id": this.postId,
            "word count": contentList.length,
          });
        }
        this.visibleStartTimestamp = "";
      }
    },
  },
  mounted() {
    this.startTimestamp = new Date();
  },
  beforeUnmount() {
    if (
      this.visibleStartTimestamp &&
      this.currentUser &&
      this.currentUser.uid !== this.user.id
    ) {
      const visibleEndTimestamp = new Date();
      const duration = Math.floor(
        (visibleEndTimestamp - this.visibleStartTimestamp) / 1000
      );
      const contentList = this.content.split(" ");
      amplitude.getInstance().logEventWithTimestamp("read post bottom", {
        duration,
        "post id": this.postId,
        "word count": contentList.length,
      });
    } else {
      return;
    }
  },
};
</script>

<style lang="sass" scoped>

.my-card
  max-width: 100vw

.q-card__section
  padding: 8px 16px

.q-item
  min-height: 4px

.q-item__label
  margin-top: 0

.q-item__section
  padding-right: 0 !important

.q-expansion-item__container
  color: $primary

.caption
  margin: 0
</style>

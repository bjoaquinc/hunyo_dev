<template>
  <q-card class="my-card" bordered flat v-if="isReady">
    <q-item>
      <q-item-label class="text-weight-bold text-h6 q-pt-md desktop-only">{{
        title
      }}</q-item-label>
      <q-item-label
        class="text-weight-bold text-subtitle1 q-pt-md mobile-only"
        >{{ title }}</q-item-label
      >
    </q-item>

    <BaseCarousel
      class="q-pt-md"
      :imagesList="imagesList"
      v-if="imagesList && imagesList.length"
    />

    <q-card-section class="q-pt-md">
      <div style="white-space: pre-wrap">
        {{ content }}
      </div>
    </q-card-section>

    <q-item
      class="q-py-sm"
      clickable
      :to="{
        name: userRoute,
        params: { userId: user.id },
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

    <q-separator v-if="!isPublic" />

    <q-card-actions align="around" v-if="!isPublic">
      <q-btn
        @click="openDialogRecommendCreate"
        color="primary"
        icon="fas fa-check"
        label="Recommend"
        size="md"
        flat
        style="width: 45%"
      />
      <q-btn
        @click="openDialogFoldersList"
        color="primary"
        icon="fas fa-folder"
        label="Save"
        size="md"
        unelevated
        style="width: 45%"
      />
    </q-card-actions>

    <q-separator />

    <q-item v-if="!isPublic">
      <q-item-section avatar>
        <q-avatar>
          <img :src="currentUserPhoto" />
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
  </q-card>
</template>

<script>
import BaseCarousel from "src/components/BaseCarousel.vue";
import DialogCommentCreate from "src/components/DialogCommentCreate.vue";
import DialogRecommendCreate from "src/components/DialogRecommendCreate.vue";
import DialogFoldersList from "src/components/DialogFoldersList.vue";
import { auth } from "src/boot/firebase";

export default {
  name: "PostItem",
  components: {
    BaseCarousel,
  },
  props: ["content", "title", "imagesList", "postId", "user"],
  computed: {
    currentUserPhoto() {
      return auth.currentUser.photoURL;
    },
    isReady() {
      return this.content && this.title && this.postId && this.user
        ? true
        : false;
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
    openDialogCommentCreate() {
      this.$q.dialog({
        component: DialogCommentCreate,
        componentProps: {
          postId: this.postId,
          user: this.user,
        },
      });
    },
    openDialogRecommendCreate() {
      this.$q.dialog({
        component: DialogRecommendCreate,
        componentProps: {
          postData: {
            image: this.imagesList[0],
            title: this.title,
            id: this.postId,
            user: this.user,
          },
        },
      });
    },
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

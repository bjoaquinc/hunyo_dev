<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row">
        <q-item-label
          class="text-weight-bold q-mt-sm q-mb-sm col"
          :class="
            $q.platform.is.mobile && !$q.platform.is.ipad
              ? 'text-subtitle1'
              : 'text-h6'
          "
          @click="readPost"
          >{{ title }}</q-item-label
        >
        <q-btn
          v-if="!isPublic"
          class="col-1 q-mb-auto q-mt-xs"
          @click="openPostActionsDialog"
          color="primary"
          icon="fas fa-ellipsis-h"
          :size="$q.platform.is.mobile && !$q.platform.is.ipad ? 'sm' : 'md'"
          dense
          flat
        />
      </div>
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
import DialogPostActions from "src/components/DialogPostActions.vue";
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
    openPostActionsDialog() {
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
        component: DialogPostActions,
        componentProps: {
          postData,
        },
      });
    },
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

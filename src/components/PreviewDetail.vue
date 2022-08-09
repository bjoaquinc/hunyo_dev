<template>
  <component
    :is="
      $q.platform.is.desktop && imagesList && imagesList.length
        ? 'q-responsive'
        : 'div'
    "
    ratio="1"
  >
    <q-card class="my-card overflow-auto" bordered flat>
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
          color="primary"
          class="q-ml-xs"
          icon="fas fa-ellipsis-h"
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
        v-if="imagesList && imagesList.length && $q.platform.is.mobile"
      />

      <q-card-section class="q-pt-md gt-lg">
        <div
          class="text-body1"
          style="white-space: pre-wrap"
          v-html="sanitizeDisplayText(content)"
        />
      </q-card-section>

      <q-card-section class="q-pt-md lt-xl">
        <div
          class="text-body1"
          style="white-space: pre-wrap"
          v-html="sanitizeDisplayText(content)"
        />
      </q-card-section>

      <q-card-actions align="around">
        <q-btn
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
        <q-item class="q-py-sm q-px-sm" clickable>
          <q-item-section avatar>
            <q-avatar>
              <img :src="user.photo" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-body1 text-grey-7">{{
              user.name
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-actions>

      <q-separator />

      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img :src="userData.photoURL" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-btn
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
  </component>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import BaseCarousel from "src/components/BaseCarousel.vue";
import { sanitizeDisplayText } from "src/logic/Sanitize.js";

export default {
  components: {
    BaseCarousel,
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
  setup(props) {
    const store = useStore();
    const currentUser = computed(() => store.getters["auth/getUser"]);
    const userData = computed(() => store.getters["profile/getUserData"]);
    const formattedTopics = computed(() => {
      let topicString = "";
      const topics = props.topics;
      for (let index = 0; index < topics.length; index++) {
        if (index > 1) break;
        if (index === 0) {
          topicString += topics[index];
        } else {
          topicString += `, ${topics[index]}`;
        }
      }
      return topicString.toLowerCase();
    });

    return {
      formattedTopics,
      userData,
      sanitizeDisplayText,
    };
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

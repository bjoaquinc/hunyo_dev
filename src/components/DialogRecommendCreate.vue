<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
    :full-width="q.platform.is.mobile"
    transition-show="slide-up"
    transition-hide="slide-down"
    :position="q.platform.is.mobile ? 'bottom' : 'standard'"
  >
    <q-card
      class="bg-white"
      style="max-height: 100%"
      :style="
        q.platform.is.desktop ? { width: '600px', maxWidth: '70vw' } : null
      "
    >
      <q-card-section
        class="full-width"
        :class="q.platform.is.desktop ? 'q-mx-auto' : ''"
        style="width: fit-content"
      >
        <div class="flex full-width justify-between items-center">
          <q-btn flat icon="fas fa-times" v-close-popup />
          <div class="text-h6">Recommend Post</div>
          <div style="width: 53px; height: 36px" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pb-none">
        <div class="text-subtitle2">
          {{ postData.title }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-input
          outlined
          label="Why do you think this post is interesting?"
          type="textarea"
          v-model="caption"
        />
      </q-card-section>

      <q-card-actions>
        <q-btn
          v-close-popup
          @click="createRecommendation"
          class="full-width"
          color="primary"
          label="Recommend"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { auth } from "src/boot/firebase";

export default {
  props: ["postData"],
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const q = useQuasar();
    const store = useStore();
    const caption = ref("");
    const recommendId = computed(() => store.getters["feed/getRecommendId"]);

    async function createRecommendation() {
      try {
        if (props.postData.user.id === auth.currentUser.uid) {
          throw new Error("You can't recommend your own post.");
        }
        await store.dispatch("feed/createRecommendation", {
          postData: props.postData,
          caption: caption.value,
        });
        await store.dispatch("notifications/createNotification", {
          content: caption.value ? caption.value : null,
          type: "postRecommend",
          userId: props.postData.user.id,
          route: {
            name: "ProfileRecommendDetail",
            params: { recommendId: recommendId.value },
          },
        });

        await store.dispatch("users/setFollowersList");
        const followersList = computed(
          () => store.getters["users/getFollowersList"]
        );
        if (followersList.value && followersList.value.length) {
          for (let index = 0; index < followersList.value.length; index++) {
            const followingUser = followersList.value[index].followingUser;
            if (followingUser.id === props.postData.user.id) {
              continue;
            }
            await store.dispatch("notifications/createNotification", {
              content: caption.value ? caption.value : null,
              type: "followRecommend",
              userId: followingUser.id,
              route: {
                name: "ProfileRecommendDetail",
                params: { recommendId: recommendId.value },
              },
            });
          }
        }
      } catch (error) {
        console.log(error);
        q.notify({ message: error.message, color: "negative" });
      }
    }
    return {
      dialogRef,
      onDialogHide,
      q,
      caption,
      createRecommendation,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px

.filler
  width: 24px
  height: 24px

.is-selected
  border: 3px solid $accent
</style>

<template>
  <div class="flex column full-width">
    <q-card class="full-width" bordered flat>
      <q-item
        clickable
        :to="{
          name: userRoute,
          params: { userId: user.id, source: 'comment' },
        }"
        class="full-width"
      >
        <q-item-section avatar>
          <q-avatar size="30px">
            <img :src="user.photo" />
          </q-avatar>
        </q-item-section>

        <q-space />

        <q-item-section>
          <q-item-label class="text-grey-7 text-body1"
            >{{ user.name }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section
        v-html="sanitizeDisplayText(comment)"
        class="text-body1"
        style="white-space: pre-wrap"
      >
      </q-card-section>
      <q-card-section
        v-if="thumbnailList && thumbnailList.length > 0"
        horizontal
        class="q-mt-sm"
        style="display: flex; flex-wrap: wrap !important; padding: 0 !important"
      >
        <div
          style="
            width: 100px;
            max-height: 100px;
            border: 1px solid rgba(0, 0, 0, 0.12);
            cursor: pointer;
          "
          @click="openDialogCommentImage(imagesList[index])"
          class="flex items-center q-ml-md"
          v-for="(thumbnail, index) in thumbnailList"
          :key="index"
        >
          <q-img
            fit="scale-down"
            class="rounded-borders"
            :src="thumbnail"
            :img-style="{ maxHeight: '100px', maxWidth: 'auto' }"
          />
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn
          @click="openDialogReplyCreate"
          flat
          no-caps
          size="sm"
          dense
          color="primary"
          icon="fas fa-reply"
          label="Reply"
        />
        <q-btn-dropdown
          flat
          size="sm"
          dense
          color="primary"
          icon="fas fa-ellipsis-h"
          :dropdown-icon="'none'"
          style="max-width: 32px; overflow: hidden; margin-left: 0"
          align="left"
        >
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="openDialogCommentEdit"
              v-if="isYours"
            >
              <q-item-section>
                <q-item-label>Edit</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="openDialogPromptDelete"
              v-if="isYours"
            >
              <q-item-section>
                <q-item-label>Delete</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="openDialogFlag" v-else>
              <q-item-section>
                <q-item-label>Flag</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-actions>
      <q-card-section class="q-pl-lg">
        <ReplyList :commentId="id" :postId="postId" :postUser="postUser" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { computed } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import DialogReplyCreate from "src/components/DialogReplyCreate.vue";
import DialogCommentEdit from "src/components/DialogCommentEdit.vue";
import DialogPromptDelete from "src/components/DialogPromptDelete.vue";
import DialogCommentImage from "src/components/DialogCommentImage.vue";
import DialogFlag from "src/components/DialogFlag.vue";
import ReplyList from "src/components/ReplyList.vue";
import { sanitizeDisplayText } from "src/logic/Sanitize";

export default {
  props: [
    "comment",
    "id",
    "user",
    "postId",
    "thumbnailList",
    "imagesList",
    "postUser",
  ],
  components: { ReplyList },

  setup(props) {
    const q = useQuasar();
    const route = useRoute();
    const store = useStore();
    const user = computed(() => store.getters["auth/getUser"]);
    const userRoute = computed(() => {
      const userLocation = route.meta.location;
      if (userLocation && userLocation === "feed") {
        return "FeedUser";
      } else if (userLocation && userLocation === "profile") {
        return "ProfileUser";
      } else {
        return "LandingUser";
      }
    });
    const isYours = computed(() => {
      return props.user.id === user.value.uid ? true : false;
    });

    function openDialogCommentImage(image) {
      q.dialog({
        component: DialogCommentImage,
        componentProps: { image },
      });
    }

    function openDialogReplyCreate() {
      q.dialog({
        component: DialogReplyCreate,
        componentProps: {
          commentId: props.id,
          postId: props.postId,
          postUser: props.postUser,
          userId: props.user.id,
          replyMessage: props.comment,
          replyUser: props.user,
        },
      });
    }

    async function openDialogCommentEdit() {
      q.dialog({
        component: DialogCommentEdit,
        componentProps: {
          commentId: props.id,
          postId: props.postId,
          comment: props.comment,
        },
      });
    }

    function openDialogFlag() {
      q.dialog({
        component: DialogFlag,
      });
    }

    async function deleteComment() {
      try {
        await store.dispatch("comments/deleteComment", {
          commentId: props.id,
          postId: props.postId,
          imagesList: props.imagesList,
        });
      } catch (error) {
        console.log(error);
      }
    }

    function openDialogPromptDelete() {
      q.dialog({
        component: DialogPromptDelete,
        componentProps: { isComment: true },
      }).onOk(async () => {
        await deleteComment();
      });
    }

    return {
      openDialogReplyCreate,
      openDialogCommentEdit,
      openDialogCommentImage,
      openDialogFlag,
      userRoute,
      isYours,
      openDialogPromptDelete,
      sanitizeDisplayText,
    };
  },
};
</script>

<style lang="sass" scoped>
.q-item__section
  padding-right: 0
  min-width: 37px
.comment-user
  font-size: 13px
  font-weight: bold

.q-card__section
  padding: 0 16px
</style>

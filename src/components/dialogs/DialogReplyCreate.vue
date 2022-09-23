<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
    :full-width="q.platform.is.mobile && !q.platform.is.ipad"
    transition-show="slide-up"
    transition-hide="slide-down"
    :position="
      q.platform.is.mobile && !q.platform.is.ipad ? 'bottom' : 'standard'
    "
  >
    <q-card
      class="bg-white"
      :style="
        q.platform.is.desktop || q.platform.is.ipad
          ? { width: '600px', maxWidth: '70vw' }
          : null
      "
    >
      <q-card-actions>
        <q-btn v-close-popup icon="fas fa-times" dense flat round />
      </q-card-actions>
      <q-item style="width: fit-content">
        <q-item-section avatar>
          <q-avatar size="30px">
            <img :src="replyUser.photo" />
          </q-avatar>
        </q-item-section>

        <q-space />

        <q-item-section>
          <q-item-label lines="1" class="comment-user text-grey-6"
            >{{ replyUser.name }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section
        class="q-py-none"
        style="white-space: pre-wrap"
        v-html="sanitizeDisplayText(replyMessage)"
      />
      <q-card-actions class="fullwidth q-mb-sm q-px-md">
        <q-input
          autofocus
          type="textarea"
          :loading="loadingImages"
          autogrow
          v-model="newReply"
          class="q-mx-none full-width"
          label="Reply"
        >
          <template v-slot:append>
            <q-icon
              v-if="!loadingImages"
              name="fas fa-camera"
              @click="manageUploader"
              class="cursor-pointer"
            />
          </template>
        </q-input>
        <input
          @change="fileChanged"
          :style="{ display: 'none' }"
          accept="image/*"
          ref="imageInput"
          type="file"
          multiple
        />
      </q-card-actions>
      <q-card-section
        v-if="images && images.length > 0"
        horizontal
        style="display: flex; flex-wrap: wrap !important"
      >
        <div
          style="width: 100px; max-height: 100px"
          class="flex items-center q-ml-md"
          v-for="{ id, value } in images"
          :key="id"
        >
          <q-img
            fit="scale-down"
            class="rounded-borders"
            :src="value"
            :img-style="{ maxHeight: '100px', maxWidth: 'auto' }"
          />
        </div>
        <q-btn
          label="Remove all"
          @click="removeImages"
          color="negative"
          class="q-ml-md"
          flat
          dense
        />
      </q-card-section>
      <q-card-actions class="full-width q-mb-md q-px-md">
        <q-btn
          @click="createReply"
          :disable="newReply ? false : true"
          class="full-width"
          color="primary"
          label="Post Reply"
          unelevated
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useStore } from "vuex";
import { ref, computed, onBeforeUnmount, onMounted } from "vue";
import { sanitizeDisplayText } from "src/logic/Sanitize.js";
import DialogPromptDiscard from "src/components/dialogs/DialogPromptDiscard.vue";
import DialogReplyCreate from "src/components/dialogs/DialogReplyCreate.vue";

export default {
  props: [
    "commentId",
    "commentUser",
    "postId",
    "postUser",
    "userId",
    "replyId",
    "replyMessage",
    "replyUser",
    "newReplyDraft",
  ],

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const q = useQuasar();
    const store = useStore();
    const newReply = ref("");
    const imageInput = ref(null);
    const user = computed(() => store.getters["auth/getUser"]);
    const images = computed(() => store.getters["comments/getImages"]);
    const loadingImages = ref(false);

    onMounted(() => {
      if (props.newReplyDraft) {
        newReply.value = props.newReplyDraft;
      }
    });

    function manageUploader() {
      imageInput.value.click();
    }

    async function fileChanged(event) {
      try {
        loadingImages.value = true;
        const files = event.target.files;
        await store.dispatch("comments/setUploadedImages", files);
        imageInput.value.value = null;
        loadingImages.value = false;
      } catch (error) {}
    }

    async function removeImages() {
      store.commit("comments/clearStateImages");
    }

    async function createReply() {
      q.loading.show({
        message: "Posting comment",
      });
      try {
        // Upload comment to database
        const newReplyId = await store.dispatch("comments/createReply", {
          postId: props.postId,
          postUser: props.postUser,
          commentId: props.commentId,
          newReply: newReply.value,
          replyId: props.replyId,
          replyUser: props.replyUser,
        });
        // Upload images to storage and update imagesList for comment
        if (images.value && images.value.length > 0) {
          await resizeAndUploadImages(props.commentId, newReplyId);
        }
        // Send notification to comment or reply author
        if (props.userId !== user.value.uid) {
          await store.dispatch("notifications/createNotification", {
            content: newReply.value,
            type: "postReply",
            userId: props.userId,
            route: {
              name: "FeedPost",
              params: {
                postId: props.postId,
              },
              hash: `#comments`,
            },
          });
        }
        // Clear data and state and close dialog
        store.commit("comments/clearStateImages");
        newReply.value = "";
        onDialogHide();
        q.loading.hide();
      } catch (error) {
        console.log(error);
        q.loading.hide();
      }
    }

    async function resizeAndUploadImages(commentId, newReplyId) {
      try {
        await store.dispatch("comments/resizeAndUploadImages", {
          replyId: newReplyId,
          commentId,
          postId: props.postId,
        });
      } catch (error) {
        console.log(error);
      }
    }

    onBeforeUnmount(async () => {
      if (!newReply.value) return store.commit("comments/clearStateImages");
      q.dialog({
        component: DialogPromptDiscard,
      })
        .onOk(() => {
          return store.commit("comments/clearStateImages");
        })
        .onCancel(() => {
          q.dialog({
            component: DialogReplyCreate,
            componentProps: {
              commentId: props.commentId,
              postId: props.postId,
              postUser: props.postUser,
              userId: props.userId,
              replyId: props.replyId,
              replyMessage: props.replyMessage,
              replyUser: props.replyUser,
              newReplyDraft: newReply.value,
            },
          });
          return;
        });
    });

    return {
      q,
      dialogRef,
      onDialogHide,
      sanitizeDisplayText,
      images,
      loadingImages,
      newReply,
      imageInput,
      manageUploader,
      fileChanged,
      removeImages,
      createReply,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px

.q-item__section
  padding-right: 5px
  min-width: 37px
</style>

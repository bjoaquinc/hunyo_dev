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
      <q-card-actions class="full-width q-mb-sm q-px-md">
        <q-select
          v-model="selectedType"
          :rules="[(val) => val.length > 0 || 'A type must be chosen.']"
          :options="types"
          class="full-width"
          label="Comment Type *"
          hint="Choose the type that best describes your comment"
        />
      </q-card-actions>
      <q-card-actions class="fullwidth q-mb-sm q-px-md">
        <q-input
          type="textarea"
          :loading="loadingImages"
          autogrow
          v-model="comment"
          class="q-mx-none full-width"
          hint="Write your comment"
          label="Comment"
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
          @click="createComment"
          :disable="comment && selectedType ? false : true"
          d
          class="full-width"
          color="primary"
          label="Post Comment"
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
import DialogPromptDiscard from "src/components/dialogs/DialogPromptDiscard.vue";
import DialogCommentCreate from "src/components/dialogs/DialogCommentCreate.vue";

export default {
  props: ["postId", "user", "commentDraft", "commentDraftTopic"],
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const q = useQuasar();
    const store = useStore();
    const types = ref([
      "Question",
      "Appreciation with Reason",
      "Constructive Feedback",
    ]);
    const imageInput = ref(null);
    const selectedType = ref("");
    const comment = ref("");
    const user = computed(() => store.getters["auth/getUser"]);
    const userData = computed(() => store.getters["profile/getUserData"]);
    const loadingImages = ref(false);
    const images = computed(() => store.getters["comments/getImages"]);

    onMounted(() => {
      if (props.commentDraft) {
        comment.value = props.commentDraft;
        selectedType.value = props.commentDraftTopic;
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

    async function createComment() {
      q.loading.show({
        message: "Posting comment",
      });
      try {
        // Upload comment to database
        const commentId = await store.dispatch("comments/createComment", {
          postId: props.postId,
          comment: comment.value,
          selectedType: selectedType.value,
          userId: props.user.id,
        });
        // Upload images to storage and update imagesList for comment
        if (images.value && images.value.length > 0) {
          await resizeAndUploadImages(commentId);
        }
        // Send a notification to the post author
        if (props.user.id !== user.value.uid && !userData.value.admin) {
          await store.dispatch("notifications/createNotification", {
            type: "postComment",
            content: comment.value,
            userId: props.user.id,
            route: {
              name: "FeedPost",
              params: {
                postId: props.postId,
              },
              hash: `#comments`,
            },
          });
        }
        selectedType.value = "";
        comment.value = "";
        store.commit("comments/clearStateImages");
        onDialogHide();
        q.loading.hide();
      } catch (error) {
        console.log(error);
        q.loading.hide();
      }
    }

    async function resizeAndUploadImages(commentId) {
      try {
        await store.dispatch("comments/resizeAndUploadImages", {
          commentId,
          postId: props.postId,
        });
      } catch (error) {
        console.log(error);
      }
    }

    onBeforeUnmount(() => {
      if (!comment.value) return store.commit("comments/clearStateImages");
      q.dialog({
        component: DialogPromptDiscard,
      })
        .onOk(() => {
          return store.commit("comments/clearStateImages");
        })
        .onCancel(() => {
          q.dialog({
            component: DialogCommentCreate,
            componentProps: {
              postId: props.postId,
              user: props.user,
              commentDraft: comment.value,
              commentDraftTopic: selectedType.value,
            },
          });
        });
    });

    return {
      q,
      dialogRef,
      onDialogHide,
      types,
      selectedType,
      imageInput,
      comment,
      createComment,
      manageUploader,
      fileChanged,
      loadingImages,
      images,
      removeImages,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

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
          autogrow
          v-model="comment"
          class="q-mx-none full-width"
          hint="Write your comment"
          label="Comment"
        />
      </q-card-actions>
      <q-card-actions class="full-width q-mb-md q-px-md">
        <q-btn
          @click="createComment"
          :disable="comment && selectedType ? false : true"
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
import DialogPromptDiscard from "src/components/DialogPromptDiscard.vue";
import DialogCommentCreate from "src/components/DialogCommentCreate.vue";

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
    const selectedType = ref("");
    const comment = ref("");
    const commentId = computed(() => store.getters["comments/getCommentId"]);
    const user = computed(() => store.getters["auth/getUser"]);
    const userData = computed(() => store.getters["profile/getUserData"]);

    onMounted(() => {
      if (props.commentDraft) {
        comment.value = props.commentDraft;
        selectedType.value = props.commentDraftTopic;
      }
    });

    async function createComment() {
      q.loading.show({
        message: "Posting comment",
      });
      try {
        await store.dispatch("comments/createComment", {
          postId: props.postId,
          comment: comment.value,
          selectedType: selectedType.value,
          userId: props.user.id,
        });
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
        onDialogHide();
        q.loading.hide();
      } catch (error) {
        console.log(error);
        q.loading.hide();
      }
    }

    onBeforeUnmount(() => {
      if (!comment.value) return;
      q.dialog({
        component: DialogPromptDiscard,
      })
        .onOk(() => {
          return;
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
      comment,
      createComment,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

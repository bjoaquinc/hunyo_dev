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
      <q-card-section class="q-py-none">
        {{ replyMessage }}
      </q-card-section>
      <q-card-actions class="fullwidth q-mb-sm q-px-md">
        <q-input
          autofocus
          autogrow
          v-model="reply"
          class="q-mx-none full-width"
          label="Reply"
        />
      </q-card-actions>
      <q-card-actions class="full-width q-mb-md q-px-md">
        <q-btn
          @click="createReply"
          :disable="reply ? false : true"
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
import DialogPromptDiscard from "src/components/DialogPromptDiscard.vue";
import DialogReplyCreate from "src/components/DialogReplyCreate.vue";

export default {
  props: [
    "commentId",
    "commentUser",
    "postId",
    "postUser",
    "userId",
    "isReply",
    "replyId",
    "replyMessage",
    "replyUser",
    "replyDraft",
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
    const selectedType = ref("");
    const reply = ref("");
    const user = computed(() => store.getters["auth/getUser"]);
    const userData = computed(() => store.getters["profile/getUserData"]);

    onMounted(() => {
      if (props.replyDraft) {
        reply.value = props.replyDraft;
      }
    });

    async function createReply() {
      q.loading.show({
        message: "Posting comment",
      });
      try {
        await store.dispatch("comments/createReply", {
          postId: props.postId,
          postUser: props.postUser,
          commentId: props.commentId,
          reply: reply.value,
          replyId: props.replyId,
          replyUser: props.replyUser,
        });
        if (
          props.userId !== user.value.uid &&
          !userData.value.admin &&
          !props.isReply
        ) {
          await store.dispatch("notifications/createNotification", {
            content: reply.value,
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
        } else if (props.userId !== user.value.uid && props.isReply) {
          await store.dispatch("notifications/createNotification", {
            content: reply.value,
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
        reply.value = "";
        onDialogHide();
        q.loading.hide();
      } catch (error) {
        console.log(error);
        q.loading.hide();
      }
    }

    onBeforeUnmount(async () => {
      if (!reply.value) return;
      q.dialog({
        component: DialogPromptDiscard,
      })
        .onOk(() => {
          return;
        })
        .onCancel(() => {
          q.dialog({
            component: DialogReplyCreate,
            componentProps: {
              commentId: props.commentId,
              postId: props.postId,
              userId: props.userId,
              isReply: props.isReply,
              replyId: props.replyId,
              replyMessage: props.replyMessage,
              replyUser: props.replyUser,
              replyDraft: reply.value,
            },
          });
          return;
        });
    });

    return {
      q,
      dialogRef,
      onDialogHide,
      selectedType,
      reply,
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

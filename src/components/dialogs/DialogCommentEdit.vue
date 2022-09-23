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
      <q-card-actions class="fullwidth q-mb-sm q-px-md">
        <q-input
          autofocus
          autogrow
          v-model="commentNew"
          class="q-mx-none full-width"
          label="Edit Comment"
        />
      </q-card-actions>
      <q-card-actions class="full-width q-mb-md q-px-md">
        <q-btn
          v-close-popup
          @click="editComment"
          :disable="comment !== commentNew ? false : true"
          class="full-width"
          color="primary"
          label="Done"
          unelevated
          no-caps
        />
        <q-btn
          v-close-popup
          class="full-width q-mt-sm"
          outline
          color="primary"
          label="Cancel"
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
import { ref, onMounted } from "vue";
import AutoLinker from "autolinker";
import sanitizeHtml from "sanitize-html";

export default {
  props: ["commentId", "postId", "comment"],

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const q = useQuasar();
    const store = useStore();
    const commentNew = ref("");

    onMounted(() => {
      const processedComment = sanitize(props.comment);
      commentNew.value = processedComment;
    });

    function sanitize(dirty) {
      const clean = sanitizeHtml(dirty, {
        allowedTags: [],
        allowedAttributes: {},
      });
      return clean;
    }

    async function editComment() {
      try {
        await store.dispatch("comments/editComment", {
          postId: props.postId,
          commentId: props.commentId,
          comment: commentNew.value,
        });
        commentNew.value = "";
      } catch (error) {
        console.log(error);
      }
    }

    return {
      q,
      dialogRef,
      onDialogHide,
      commentNew,
      editComment,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

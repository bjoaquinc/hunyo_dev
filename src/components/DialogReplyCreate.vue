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
      :style="
        q.platform.is.desktop ? { width: '600px', maxWidth: '70vw' } : null
      "
    >
      <q-card-actions>
        <q-btn v-close-popup icon="fas fa-times" dense flat round />
      </q-card-actions>
      <q-card-actions class="fullwidth q-mb-sm q-px-md">
        <q-input v-model="reply" class="q-mx-none full-width" label="Reply" />
      </q-card-actions>
      <q-card-actions class="full-width q-mb-md q-px-md">
        <q-btn
          v-close-popup
          @click="createReply"
          :disable="reply ? false : true"
          class="full-width"
          color="primary"
          label="Post Reply"
          unelevated
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useStore } from "vuex";
import { ref } from "vue";

export default {
  props: ["commentId", "postId"],

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

    async function createReply() {
      try {
        await store.dispatch("comments/createReply", {
          postId: props.postId,
          commentId: props.commentId,
          reply: reply.value,
        });
        reply.value = "";
      } catch (error) {
        console.log(error);
      }
    }

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
</style>

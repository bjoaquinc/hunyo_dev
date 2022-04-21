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
        <q-input
          v-model="postId"
          class="q-mx-none full-width"
          hint="Write the id of your post here"
          label="Post Id"
        />
      </q-card-actions>
      <q-card-actions class="fullwidth q-mb-sm q-px-md">
        <q-input
          type="textarea"
          autogrow
          v-model="content"
          class="q-mx-none full-width"
          hint="Write your content here"
          label="Edit Content"
        />
      </q-card-actions>
      <q-card-actions class="full-width q-mb-md q-px-md">
        <q-btn
          @click="editContent"
          v-close-popup
          :disable="content && postId ? false : true"
          class="full-width"
          color="primary"
          label="Edit Content"
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
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const q = useQuasar();
    const store = useStore();
    const content = ref("");
    const postId = ref("");

    async function editContent() {
      try {
        await store.dispatch("admin/editContent", {
          content: content.value,
          postId: postId.value,
        });
      } catch (error) {
        console.log(error);
      }
    }

    return {
      q,
      dialogRef,
      onDialogHide,
      editContent,
      content,
      postId,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

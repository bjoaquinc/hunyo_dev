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
          v-model="newTitle"
          type="textarea"
          autogrow
          class="q-mx-none full-width"
          label="Edit Post Title"
        />
      </q-card-actions>
      <q-card-actions class="fullwidth q-mb-sm q-px-md">
        <q-input
          v-model="newContent"
          type="textarea"
          autogrow
          class="q-mx-none full-width"
          label="Edit Post Content"
        />
      </q-card-actions>
      <q-card-actions class="full-width q-mb-md q-px-md">
        <q-btn
          v-close-popup
          @click="editPost"
          :disable="
            newTitle === postData.title && newContent === postData.content
          "
          class="full-width"
          color="primary"
          label="Edit Post"
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
import { ref, computed, onMounted } from "vue";

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
    const comment = ref("");
    const user = computed(() => store.getters["auth/getUser"]);
    const userData = computed(() => store.getters["profile/getUserData"]);
    const newTitle = ref("");
    const newContent = ref("");

    onMounted(() => {
      newTitle.value = props.postData.title;
      newContent.value = props.postData.content;
    });

    async function editPost() {
      try {
        console.log(props.postData);
        await store.dispatch("posts/editPost", {
          postId: props.postData.postId,
          title: newTitle.value,
          content: newContent.value,
        });
      } catch (error) {
        console.log(error);
      }
    }

    return {
      q,
      dialogRef,
      onDialogHide,
      newTitle,
      newContent,
      editPost,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

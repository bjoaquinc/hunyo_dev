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
      <q-card-actions class="full-width q-px-md">
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
      <q-card-section>
        <div class="flex items-center">
          <q-btn
            @click="manageUploader"
            label="Add images"
            icon="fas fa-camera"
            flat
            color="primary"
            size="md"
            class="q-px-none"
          />
          <input
            :style="{ display: 'none' }"
            @change="fileChanged"
            accept="image/*"
            ref="imageInput"
            type="file"
            multiple
          />
        </div>
      </q-card-section>
      <q-card-section
        class="flex items- q-pt-none"
        v-if="selectedPost.imagesList && selectedPost.imagesList.length > 0"
      >
        <div class="flex items-center">
          <div class="text-subtitle1 text-primary">
            Added
            <span class="text-weight-bold"
              >{{ selectedPost.imagesList.length }}
              {{
                selectedPost.imagesList.length > 1 ? "images" : "image"
              }}</span
            >
          </div>
          <q-btn
            :to="{
              name:
                $route.name === 'FeedPost'
                  ? 'FeedPostCropper'
                  : 'ProfilePostCropper',
            }"
            label="Edit"
            class="q-mx-sm q-py-none"
            unelevated
            outline
            color="primary"
            size="md"
          />
        </div>
        <q-btn
          @click="removeMessage = true"
          label="Delete"
          class="q-px-sm q-py-none"
          unelevated
          outline
          color="warning"
          size="md"
        />
      </q-card-section>
    </q-card>
    <q-dialog
      v-model="removeMessage"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-white text-black" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Remove images</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to delete all uploaded images?
        </q-card-section>

        <q-card-actions align="right" class="bg-white">
          <q-btn
            v-close-popup
            @click="removeAllImages"
            color="negative"
            label="Delete all"
            flat
          />
          <q-btn v-close-popup label="Cancel" flat outline />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
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
    const router = useRouter();
    const route = useRoute();
    const newTitle = ref("");
    const newContent = ref("");
    const selectedPost = computed(() => store.getters["posts/getSelectedPost"]);
    const imageInput = ref(null);
    const removeMessage = ref(false);

    onMounted(() => {
      newTitle.value = props.postData.title;
      newContent.value = props.postData.content;
    });

    function manageUploader() {
      imageInput.value.click();
    }

    async function fileChanged(event) {
      const files = event.target.files;
      if (files && files.length > 0) {
        q.loading.show({ message: "Adding images..." });
        await store.dispatch("newPost/setPostItem", selectedPost.value.postId);
        await store.dispatch("newPost/setUploadedImages", { files });
        store.commit("newPost/generateImageOrder");
        q.loading.hide();
        router.push({
          name:
            route.name === "FeedPost"
              ? "FeedPostCropper"
              : "ProfilePostCropper",
        });
      }
    }

    async function removeAllImages() {
      await store.dispatch("newPost/setPostItem", selectedPost.value.postId);
      store.dispatch("newPost/removeAllImages");
      const unsubscribePostItem =
        store.getters["newPost/getUnsubscribePostItem"];
      if (unsubscribePostItem) unsubscribePostItem();
      store.commit("newPost/clearState");
    }

    async function editPost() {
      try {
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
      selectedPost,
      manageUploader,
      fileChanged,
      imageInput,
      removeAllImages,
      removeMessage,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

<template>
  <div>
    <div class="q-px-lg full-width flex column lt-sm">
      <DropdownBestPractices class="q-mt-lg" />
      <label class="text-body1 q-mt-lg text-grey-7" for="description"
        >Description *</label
      >
      <q-input
        id="description"
        @blur="sendEventDescription"
        v-model="content"
        :rules="[(val) => !!val || 'Field is required']"
        class="q-mt-sm"
        dense
        :placeholder="`Write your ${
          isQuestion ? 'complete question' : 'post'
        } here. Suggested maximum of 250 words.`"
        type="textarea"
        input-style="min-height: 150px !important"
        autogrow
        outlined
      />
      <div class="flex q-my-md items-center">
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
        <q-btn
          @click="openImageInfoDialog"
          class="q-px-none q-ml-sm"
          color="primary"
          icon="fas fa-info"
          size="7px"
          outline
          round
        />
      </div>
      <div class="flex q-mt-sm q-mb-lg items-center" v-if="hasImages">
        <div class="flex items-center" @click="editImages">
          <div class="text-subtitle1 text-primary">
            Added
            <span class="text-weight-bold"
              >{{ postItem.imagesList.length }}
              {{ postItem.imagesList.length > 1 ? "images" : "image" }}</span
            >
          </div>
          <q-btn
            label="Edit"
            class="q-mx-sm q-py-none"
            unelevated
            outline
            color="primary"
            size="md"
          />
        </div>
        <q-btn
          label="Delete"
          @click="removeMessage = true"
          class="q-px-sm q-py-none"
          unelevated
          outline
          color="warning"
          size="md"
        />
      </div>
    </div>

    <div
      class="absolute-center gt-xs row items-start"
      style="max-width: 600px"
      :style="{ minWidth: isQuestion ? '40vw' : '70vw' }"
    >
      <q-card bordered class="col" style="max-height: 90vh; overflow-y: auto">
        <q-card-section>
          <q-card-section class="flex q-pa-sm">
            <q-btn
              v-close-popup
              icon="fas fa-chevron-left"
              :to="{ name: 'PagePostNewTitle' }"
              dense
              flat
              round
            />
            <q-toolbar-title class="text-center">Create Post</q-toolbar-title>
            <div class="filler" />
          </q-card-section>
          <q-card-section>
            <div class="text-body1 text-grey-7">Description *</div>
          </q-card-section>

          <q-card-section>
            <q-input
              @blur="sendEventDescription"
              v-model="content"
              :rules="[(val) => !!val || 'Field is required']"
              dense
              :placeholder="`Write your ${
                isQuestion ? 'complete question' : 'post'
              } here. Maximum of 250 words.`"
              type="textarea"
              input-style="min-height: 150px !important"
              autogrow
              outlined
            />
          </q-card-section>

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
              <q-btn
                @click="openImageInfoDialog"
                class="q-px-none q-ml-sm"
                color="primary"
                icon="fas fa-info"
                size="7px"
                outline
                round
              />
            </div>
          </q-card-section>
          <q-card-section class="flex items- q-pt-none" v-if="hasImages">
            <div class="flex items-center" @click="editImages">
              <div class="text-subtitle1 text-primary">
                Added
                <span class="text-weight-bold"
                  >{{ postItem.imagesList.length }}
                  {{
                    postItem.imagesList.length > 1 ? "images" : "image"
                  }}</span
                >
              </div>
              <q-btn
                label="Edit"
                class="q-mx-sm q-py-none"
                unelevated
                outline
                color="primary"
                size="md"
              />
            </div>
            <q-btn
              label="Delete"
              @click="removeMessage = true"
              class="q-px-sm q-py-none"
              unelevated
              outline
              color="warning"
              size="md"
            />
          </q-card-section>
          <q-card-actions>
            <q-btn
              :disable="content ? false : true"
              @click="updateAndPreviewPost"
              label="Preview"
              color="primary"
              unelevated
              class="full-width q-mt-sm"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
      <DropdownBestPractices class="q-ml-md col-5" v-if="!isQuestion" />
    </div>

    <q-dialog
      v-model="preview"
      persistent
      :maximized="q.platform.is.mobile && !q.platform.is.ipad"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card
        class="bg-white overflow-hidden q-pb-md"
        style="max-width: none !important"
      >
        <q-card-section class="flex q-pa-sm">
          <div class="filler" />

          <q-toolbar-title class="text-center">Preview</q-toolbar-title>

          <q-btn v-close-popup icon="fas fa-times" dense flat round />
        </q-card-section>
        <BaseCarousel
          :imagesList="imagesList"
          :style="{
            minWidth:
              q.platform.is.desktop || q.platform.is.ipad ? '35vw' : '100%',
          }"
        />
      </q-card>
    </q-dialog>

    <router-view v-slot="{ Component }">
      <q-dialog v-model="dialog" persistent maximized>
        <component
          :is="Component"
          @closeDialog="closeDialog"
          @openPreview="openPreview"
        />
      </q-dialog>
    </router-view>

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
    <DialogImageInformation />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import amplitude from "amplitude-js";
import BaseCarousel from "src/components/BaseCarousel.vue";
import DialogImageInformation from "src/components/dialogs/DialogImageInformation.vue";
import DropdownBestPractices from "src/components/DropDownBestPractices.vue";

export default {
  components: {
    BaseCarousel,
    DialogImageInformation,
    DropdownBestPractices,
  },
  props: ["postId"],
  setup(props) {
    const store = useStore();
    const q = useQuasar();
    const router = useRouter();
    const postItem = computed(() => store.getters["newPost/getPostItem"]);
    const hasImages = computed(() =>
      postItem.value &&
      postItem.value.imagesList &&
      postItem.value.imagesList.length > 0
        ? true
        : false
    );
    const unsubscribePostItem = computed(
      () => store.getters["newPost/getUnsubscribePostItem"]
    );
    const userData = computed(() => store.getters["profile/getUserData"]);
    const title = computed(() => store.getters["newPost/getTitle"]);
    const topics = computed(() => store.getters["newPost/getTopicsList"]);
    const content = computed({
      get: () => store.getters["newPost/getContent"],
      set: (value) => store.commit("newPost/setContent", value),
    });
    const isQuestion = computed(() => store.getters["newPost/getIsQuestion"]);
    const preview = ref(false);
    const dialog = ref(false);
    const imageInput = ref(null);
    const uploadedImagesList = computed(
      () => store.getters["newPost/getUploadedImagesList"]
    );
    const imagesList = computed(
      () => store.getters["newPost/getCroppedImagesList"]
    );
    const removeMessage = ref(false);
    const newPost = computed(() => store.getters["newPost/getNewPost"]);

    onMounted(async () => {
      if (!postItem.value) {
        try {
          await store.dispatch("newPost/setPostItem", props.postId);
        } catch (error) {
          if (error.message === "no post item") {
            const data = {
              title: title.value,
              topics: topics.value,
              isQuestion: isQuestion.value,
            };
            await store.dispatch("newPost/createPostItem", {
              data,
              postId: props.postId,
            });
            if (!userData.value.hasDrafts) {
              await store.dispatch("profile/updateUserData", {
                hasDrafts: true,
              });
            }
          }
        }
      }
    });

    function sendEventDescription() {
      if (content.value) {
        try {
          const createId = store.getters["amplitude/getCreateId"];
          amplitude
            .getInstance()
            .logEventWithTimestamp("create - write description", {
              "create id": createId,
            });
          // console.log("Successfully sent write description event");
        } catch (error) {
          console.log(error);
        }
      }
    }

    function manageUploader() {
      try {
        imageInput.value.click();
        const createId = store.getters["amplitude/getCreateId"];
        amplitude.getInstance().logEventWithTimestamp("create - add images", {
          "create id": createId,
        });
        // console.log("Successfully sent add images event");
      } catch (error) {
        console.log(error);
      }
    }

    async function fileChanged(event) {
      const files = event.target.files;
      let totalSize = 0;
      for (const file of files) {
        totalSize += file.size;
      }
      if (totalSize > 25000000) {
        return q.dialog({
          message:
            "Your total file size exceeds the maximum allowed (25MB). Please upload images individually or upload smaller images.",
        });
      }
      console.log(totalSize);
      if (files && files.length > 0) {
        dialog.value = true;
        q.loading.show({ message: "Adding images..." });
        await store.dispatch("newPost/setUploadedImages", { files });
        store.commit("newPost/generateImageOrder");
        q.loading.hide();
        router.push({ name: "NewPostImageCropper" });
      }
    }

    function closeDialog() {
      dialog.value = false;
      imageInput.value.value = "";
    }

    function openImageInfoDialog() {
      q.dialog({
        component: DialogImageInformation,
      });
    }

    function openPreview() {
      preview.value = true;
    }

    async function editImages() {
      await store.dispatch("newPost/setUploadedImages");
      store.commit("newPost/generateImageOrder");
      router.push({ name: "NewPostImageCropper" });
      dialog.value = true;
    }

    function removeAllImages() {
      store.dispatch("newPost/removeAllImages");
    }

    async function updateAndPreviewPost() {
      try {
        q.loading.show();
        await store.dispatch("newPost/updatePostItem", {
          postId: props.postId,
          data: { ...newPost.value },
        });
        router.push({ name: "PagePreview", params: { postId: props.postId } });
        q.loading.hide();
      } catch (error) {
        console.log(error);
      }
    }

    return {
      q,
      dialog,
      preview,
      postItem,
      hasImages,
      content,
      imageInput,
      sendEventDescription,
      manageUploader,
      openImageInfoDialog,
      editImages,
      fileChanged,
      closeDialog,
      openPreview,
      topics,
      isQuestion,
      uploadedImagesList,
      removeMessage,
      removeAllImages,
      imagesList,
      updateAndPreviewPost,
    };
  },
};
</script>

<style lang="sass" scoped>
.image-display
  object-fit: fit
  display: block
  width: 100vw

.q-item
  padding: 0

.filler
  width: 24px
  height: 24px

ul
  padding-inline-start: 16px
  margin: 0
</style>

<template>
  <div>
    <div class="q-px-lg full-width flex column lt-sm">
      <DropdownBestPractices class="q-mt-lg" />
      <label class="text-body1 q-mt-lg text-grey-7" for="description"
        >Description *</label
      >
      <q-input
        id="description"
        v-model="content"
        :rules="[(val) => !!val || 'Field is required']"
        class="q-mt-sm"
        dense
        :placeholder="`Write your ${
          isQuestion ? 'complete question' : 'post'
        } here. Suggested maximum of 250 words.`"
        type="textarea"
        outlined
      />
      <div class="flex q-mt-md items-center">
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
      <div class="flex q-mt-sm items-center" v-if="uploadedImagesList">
        <div class="flex items-center" @click="editImages">
          <div class="text-subtitle1 text-primary">
            Added
            <span class="text-weight-bold"
              >{{ uploadedImagesList.length }}
              {{ uploadedImagesList.length > 1 ? "images" : "image" }}</span
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
      <q-card bordered class="col">
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
              v-model="content"
              :rules="[(val) => !!val || 'Field is required']"
              dense
              :placeholder="`Write your ${
                isQuestion ? 'complete question' : 'post'
              } here. Maximum of 250 words.`"
              type="textarea"
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
          <q-card-section
            class="flex items- q-pt-none"
            v-if="uploadedImagesList"
          >
            <div class="flex items-center" @click="editImages">
              <div class="text-subtitle1 text-primary">
                Added
                <span class="text-weight-bold"
                  >{{ uploadedImagesList.length }}
                  {{ uploadedImagesList.length > 1 ? "images" : "image" }}</span
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
              @click="createPost"
              label="Post"
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
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import BaseCarousel from "src/components/BaseCarousel.vue";
import DialogImageInformation from "src/components/DialogImageInformation.vue";
import DropdownBestPractices from "src/components/DropDownBestPractices.vue";

export default {
  components: {
    BaseCarousel,
    DialogImageInformation,
    DropdownBestPractices,
  },
  setup() {
    const store = useStore();
    const q = useQuasar();
    const router = useRouter();
    const content = computed({
      get: () => store.getters["newPost/getContent"],
      set: (value) => store.commit("newPost/setContent", value),
    });
    const isQuestion = computed(() => store.getters["newPost/getIsQuestion"]);
    const preview = ref(false);
    const dialog = ref(false);
    const imageInput = ref(null);
    const topics = computed(() => store.getters["newPost/getTopicsList"]);
    const uploadedImagesList = computed(
      () => store.getters["newPost/getUploadedImagesList"]
    );
    const imagesList = computed(
      () => store.getters["newPost/getCroppedImagesList"]
    );
    const removeMessage = ref(false);
    const newPost = computed(() => store.getters["newPost/getNewPost"]);
    const postId = computed(() => store.getters["newPost/getPostId"]);

    function toggleIsMinimized(index) {
      store.dispatch("newPost/toggleIsMinimized", index);
    }

    function manageUploader() {
      imageInput.value.click();
    }

    async function fileChanged(event) {
      const files = event.target.files;

      if (files && files.length > 0) {
        dialog.value = true;
        q.loading.show({ message: "Adding images..." });
        await store.dispatch("newPost/setUploadedImages", { files: files });
        store.commit("newPost/generateImageOrder");
        q.loading.hide();
        router.push({ name: "ImageCropper" });
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

    function editImages() {
      store.commit("newPost/generateImageOrder");
      router.push({ name: "ImageCropper" });
      dialog.value = true;
    }

    function removeAllImages() {
      store.commit("newPost/removeAllImages");
    }

    async function createPost() {
      try {
        q.loading.show({ message: "Uploading..." });
        await store.dispatch("newPost/createPost", {
          newPost: { ...newPost.value },
          imagesList: imagesList.value,
        });
        const followersList = computed(
          () => store.getters["subscriptions/getFollowersList"]
        );
        for (let index = 0; index < followersList.value.length; index++) {
          const followingUser = followersList.value[index].followingUser;
          await store.dispatch("notifications/createNotification", {
            type: "followPost",
            content: newPost.value.title,
            userId: followingUser.id,
            route: {
              name: "FeedPost",
              params: {
                postId: postId.value,
              },
            },
          });
        }
        store.commit("newPost/clearState");
        q.loading.hide();
        router.push({ name: "PageHome" });
      } catch (error) {
        console.log(error);
        q.loading.hide();
      }
    }

    return {
      q,
      dialog,
      preview,
      content,
      imageInput,
      toggleIsMinimized,
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
      createPost,
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

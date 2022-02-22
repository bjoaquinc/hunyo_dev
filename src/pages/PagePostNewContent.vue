<template>
  <div>
    <div class="q-px-lg full-width flex column mobile-only">
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
        } here. Maximum of 250 words.`"
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
      class="absolute-center desktop-only row items-start"
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
      :maximized="q.platform.is.mobile"
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
          :style="{ minWidth: q.platform.is.desktop ? '35vw' : '100%' }"
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
import {
  addDoc,
  updateDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { postsRef, db } from "src/boot/firebase";
import {
  uploadBytes,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage";
import { imagesRef } from "src/boot/firebase";
import { uid } from "quasar";
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
      set: (value) => store.commit("newPost/updateContent", value),
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
        await store.dispatch("newPost/pushUploadedImages", { files: files });
        store.dispatch("newPost/generateImageOrder");
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
      store.dispatch("newPost/generateImageOrder");
      router.push({ name: "ImageCropper" });
      dialog.value = true;
    }

    function removeAllImages() {
      store.dispatch("newPost/removeAllImages");
    }

    async function createPost() {
      q.loading.show({ message: "Uploading..." });
      const docRef = await addDoc(postsRef, {
        ...newPost.value,
        createdAt: serverTimestamp(),
      });

      if (imagesList.value && imagesList.value.length > 0) {
        let imageURLList = [];
        for (const image of imagesList.value) {
          if (imagesList.value.length > 1) {
            q.loading.show({
              spinnerColor: "red",
              messageColor: "black",
              backgroundColor: "yellow",
              message: `Uploading ${
                imagesList.value.indexOf(`${image}`) + 1
              } of ${imagesList.value.length} images`,
            });
          } else {
            q.loading.show({
              spinnerColor: "red",
              messageColor: "black",
              backgroundColor: "yellow",
              message: "Uploading image",
            });
          }

          const blob = dataURItoBlob(image);
          const postRef = storageRef(imagesRef, docRef.id);
          const fileName = `${uid()}.jpg`;
          const imageRef = storageRef(postRef, fileName);
          await uploadBytes(imageRef, blob).then(() =>
            getDownloadURL(imageRef)
              .then((downloadURL) => imageURLList.push(downloadURL))
              .catch((err) => console.log(err))
          );
        }
        const postRef = doc(db, "posts", docRef.id);
        updateDoc(postRef, {
          imagesList: imageURLList,
        });
      }

      store.dispatch("newPost/getPostsCollection", await getDocs(postsRef));
      q.loading.hide();
      router.push(`/posts/${docRef.id}`);
    }

    function dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString });
      return blob;
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

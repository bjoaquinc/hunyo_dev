<template>
  <q-card
    class="bg-black text-white overflow-hidden-y justify-center items-center"
  >
    <q-card-section
      :style="{
        maxWidth: q.platform.is.desktop || q.platform.is.ipad ? '30vw' : 'none',
      }"
      class="flex q-pa-sm q-mx-auto"
    >
      <q-btn @click="cleanAndExitCropper" icon="close" dense flat round />

      <q-toolbar-title class="text-center">Crop</q-toolbar-title>

      <q-btn
        @click="saveImages"
        label="Done"
        class="same-width"
        align="right"
        size="md"
        dense
        flat
      />
    </q-card-section>

    <div
      class="flex q-mx-auto"
      ref="cropperContainer"
      style="position: relative"
      :style="{
        maxWidth: q.platform.is.desktop || q.platform.is.ipad ? '30vw' : 'none',
      }"
    >
      <q-btn
        v-if="uploadedImagesList.length > 1"
        @click="removeMessage = true"
        class="remove-image-button z-max bg-white"
        color="black"
        icon="fas fa-times"
        size="sm"
        flat
        round
      />
      <div
        v-for="({ value, id }, index) in uploadedImagesList"
        :key="id"
        :style="{
          height: cropperWidth + 'px',
          visibility: isSelectedImage(id) ? 'visible' : 'hidden',
          order: isSelectedImage(id) ? '1' : '3',
        }"
        class="full-width q-my-auto flex items-center"
      >
        <img
          :ref="
            (el) => {
              if (el) imgRefList[index] = el;
            }
          "
          class="image-display"
          :src="value"
        />
      </div>

      <q-list
        v-if="uploadedImagesList && uploadedImagesList.length > 1"
        class="flex q-mt-xs"
        style="order: 2"
      >
        <q-item
          v-for="{ id, order, value } in uploadedImagesList"
          :style="{ order: order ? order : uploadedImagesList.length + 1 }"
          :key="id"
          clickable
          @click="selectImage(id)"
        >
          <q-avatar
            square
            :size="`${(cropperWidth * selectorWidthPercentage) / 100}px`"
          >
            <q-badge
              @click="order ? removeOrder(id, order) : addOrder(id)"
              :label="order ? `${order}` : ''"
              class="z-top"
              :style="{
                fontSize:
                  q.platform.is.mobile && !q.platform.is.ipad ? '' : '15px',
              }"
              color="primary"
              floating
              rounded
            />
            <img
              :src="value"
              :class="isSelectedImage(id) ? 'selected-image' : ''"
              style="object-fit: cover"
            />
          </q-avatar>
        </q-item>
      </q-list>
    </div>
    <q-dialog
      v-model="removeMessage"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-white text-black" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Remove image</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to delete this image?
        </q-card-section>

        <q-card-actions align="right" class="bg-white">
          <q-btn flat label="Yes" @click="removeImage" v-close-popup />
          <q-btn flat label="Cancel" outline v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { ref, computed, onMounted, onBeforeUpdate } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import amplitude from "amplitude-js";
import Cropper from "cropperjs";

export default {
  setup(_1, { emit }) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const q = useQuasar();
    const uploadedImagesList = computed(
      () => store.getters["newPost/getUploadedImagesList"]
    );
    const imgRefList = ref([]);
    const croppersList = ref([]);
    const selectedImage = ref(uploadedImagesList.value[0].id);
    const removeMessage = ref(false);
    const cropperContainer = ref(null);
    const cropperWidth = ref(0);
    const selectorWidthPercentage = computed(() =>
      q.platform.is.mobile && !q.platform.is.ipad ? 25 : 20
    );

    onBeforeUpdate(() => {
      imgRefList.value = [];
    });

    onMounted(() => {
      cropperWidth.value = cropperContainer.value.clientWidth;

      for (let index = 0; index < imgRefList.value.length; index++) {
        const { type, id, canvasData } = uploadedImagesList.value[index];

        const cropper = new Cropper(imgRefList.value[index], {
          aspectRatio: 1,
          minCropBoxWidth: cropperWidth.value,
          viewMode: 0,
          dragMode: "move",
          background: false,
          cropBoxMovable: false,
          cropBoxResizable: false,
          ready() {
            if (canvasData) {
              this.cropper.setCanvasData(canvasData);
            }
          },
        });

        croppersList.value.push({ cropper: cropper, fileType: type, id: id });
      }
    });

    function selectImage(uid) {
      selectedImage.value = uid;
    }

    function isSelectedImage(uid) {
      return selectedImage.value === uid ? true : false;
    }

    async function removeImage() {
      q.loading.show("Removing image...");
      const image = uploadedImagesList.value.find(
        (imageObject) => imageObject.id === selectedImage.value
      );
      const imageIndex = uploadedImagesList.value.indexOf(image);
      const cropperObject = croppersList.value.find(
        (cropperObject) => image.id === cropperObject.id
      );
      removeOrder(image.id, image.order);
      await store.dispatch("newPost/removeUploadedImage", image.id);
      cropperObject.cropper.destroy();
      croppersList.value.splice(imageIndex, 1);
      imgRefList.value.splice(imageIndex, 1);
      selectedImage.value = uploadedImagesList.value[0].id;
      q.loading.hide();
    }

    function removeOrder(uid, order) {
      store.commit("newPost/removeOrder", { id: uid, order: order });
    }

    function addOrder(uid) {
      store.commit("newPost/addOrder", { id: uid });
    }

    async function saveImages() {
      q.loading.show();
      try {
        const orderedImagesList = reorderImages();
        const imagesListWithCropData = await getCropData(orderedImagesList);
        await store.dispatch(
          "newPost/uploadAndCropImagesList",
          imagesListWithCropData
        );
        sendEventAddImagesSuccess();
        cleanAndExitCropper();
        q.loading.hide();
      } catch (error) {
        console.log(error);
        q.loading.hide();
      }
    }

    function reorderImages() {
      const orderedImagesList = [];
      // Generate image order if null
      uploadedImagesList.value.forEach((image) => {
        if (!image.order) {
          store.commit("newPost/addOrder", { id: image.id });
        }
      });
      // Create new reference list with id and order
      uploadedImagesList.value.forEach((image) => {
        orderedImagesList.push({ id: image.id, order: image.order });
      });
      // Sort images according to order
      orderedImagesList.sort((a, b) => {
        return a.order - b.order;
      });
      return orderedImagesList;
    }

    async function getCropData(orderedImagesList) {
      const imagesListWithCropData = [];
      for (const image of orderedImagesList) {
        const { id } = image;
        const cropper = croppersList.value.find((cropperObject) => {
          if (cropperObject.id === id) {
            return true;
          }
        }).cropper;
        const cropData = await cropper.getData();
        imagesListWithCropData.push({ id, cropData });
      }
      return imagesListWithCropData;
    }

    function sendEventAddImagesSuccess() {
      const createId = store.getters["amplitude/getCreateId"];
      const numOfImages = uploadedImagesList.value.length;
      amplitude
        .getInstance()
        .logEventWithTimestamp("create - add images successful", {
          "create id": createId,
          "number of images": numOfImages,
        });
      // console.log("Successfully sent add images successful event");
    }

    function cleanAndExitCropper() {
      emit("closeDialog");
      router.go(-1);
      croppersList.value.forEach((cropperObject) => {
        cropperObject.cropper.destroy();
      });
      store.commit("newPost/clearStateSelectedImages");
      if (route.name !== "NewPostImageCropper") {
        const unsubscribePostItem =
          store.getters["newPost/getUnsubscribePostItem"];
        if (unsubscribePostItem) unsubscribePostItem();
        store.commit("newPost/clearState");
      }
    }

    return {
      uploadedImagesList,
      imgRefList,
      croppersList,
      selectImage,
      isSelectedImage,
      removeOrder,
      addOrder,
      cleanAndExitCropper,
      saveImages,
      removeMessage,
      removeImage,
      cropperContainer,
      cropperWidth,
      q,
      selectorWidthPercentage,
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

.selected-image
  filter: brightness(3)

.remove-image-button
  position: absolute
  top: 10px
  right: 10px
</style>

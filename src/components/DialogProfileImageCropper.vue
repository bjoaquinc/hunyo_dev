<template>
  <q-card>
    <q-card-section
      class="full-width"
      :class="q.platform.is.desktop || q.platform.is.ipad ? 'q-mx-auto' : ''"
      style="max-height: 50vh"
    >
      <div class="flex full-width justify-between items-center">
        <q-btn flat icon="fas fa-times" v-close-popup />
        <div class="text-h6">Profile Image Cropper</div>
        <q-btn flat label="Done" @click="changeProfilePicture" />
      </div>
    </q-card-section>
    <q-card-section>
      <div
        ref="cropperContainer"
        :style="{
          height: cropperWidth + 'px',
          width: q.platform.is.desktop || q.platform.is.ipad ? '400px' : '',
        }"
      >
        <img ref="imageRef" :src="uploadedImage.value" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Cropper from "cropperjs";

export default {
  setup(_1, { emit }) {
    const q = useQuasar();
    const store = useStore();
    const imageRef = ref(null);
    const uploadedImage = computed(
      () => store.getters["profile/getUploadedImage"]
    );
    const cropperContainer = ref(null);
    const cropper = ref(null);
    const router = useRouter();
    const cropperWidth = ref(0);

    onMounted(() => {
      cropperWidth.value = cropperContainer.value.clientWidth;
      cropper.value = new Cropper(imageRef.value, {
        aspectRatio: 1,
        viewMode: 3,
        dragMode: "move",
        background: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        minCropBoxWidth: cropperContainer.value.offsetWidth,
      });
    });

    async function cropImage(fileType) {
      const croppedImage = await cropper.value
        .getCroppedCanvas({
          maxWidth: 300,
          maxHeight: 300,
          imageSmoothingQuality: "high",
        })
        .toDataURL(fileType);
      return croppedImage;
    }

    async function changeProfilePicture() {
      const croppedImage = await cropImage(uploadedImage.value.fileType);
      store.commit("profile/setNewProfilePicture", croppedImage);
      emit("closeDialog");
      router.push({ name: "ProfileEdit" });
    }

    return {
      q,
      uploadedImage,
      imageRef,
      cropperContainer,
      changeProfilePicture,
      cropperWidth,
    };
  },
};
</script>

<style lang="sass" scoped>
img
  display: block
  max-width: 100%
</style>

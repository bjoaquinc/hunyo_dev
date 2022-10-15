<template>
  <q-card>
    <q-card-section
      class="full-width"
      :class="q.platform.is.desktop || q.platform.is.ipad ? 'q-mx-auto' : ''"
      style="max-height: 50vh"
    >
      <div class="flex full-width justify-between items-center">
        <q-btn flat icon="fas fa-times" v-close-popup />
        <div class="text-h6">Supplier Logo Cropper</div>
        <q-btn flat label="Done" @click="changeLogo" />
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
import { useRouter, useRoute } from "vue-router";
import Cropper from "cropperjs";

export default {
  setup(_1, { emit }) {
    const q = useQuasar();
    const store = useStore();
    const imageRef = ref(null);
    const uploadedImage = computed(
      () => store.getters["images/getUploadedImage"]
    );
    const cropperContainer = ref(null);
    const cropper = ref(null);
    const router = useRouter();
    const route = useRoute();
    const cropperWidth = ref(0);

    console.log("Page opened");

    onMounted(() => {
      cropperWidth.value = cropperContainer.value.clientWidth;
      cropper.value = new Cropper(imageRef.value, {
        aspectRatio: 1,
        viewMode: 0,
        dragMode: "move",
        background: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        minCropBoxWidth: cropperContainer.value.offsetWidth,
      });
    });

    async function changeLogo() {
      const cropData = await getCropData();
      const croppedImage = await getCroppedImage();
      store.commit("images/setCropData", cropData);
      if (route.name !== "SupplierProductCatalogue") {
        store.commit("suppliers/setLogo", croppedImage);
        emit("closeDialog");
        router.push({ name: "SupplierCreateLogo" });
      } else {
        store.commit("suppliers/updateEditedSupplier", {
          field: "logo",
          value: croppedImage,
        });
        emit("closeDialog");
      }
    }

    async function getCropData() {
      return await cropper.value.getData();
    }

    async function getCroppedImage() {
      const croppedImage = await cropper.value
        .getCroppedCanvas({
          imageSmoothingQuality: "high",
        })
        .toDataURL();
      return croppedImage;
    }

    return {
      q,
      uploadedImage,
      imageRef,
      cropperContainer,
      changeLogo,
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

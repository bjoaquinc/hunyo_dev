<template>
  <div>
    <!-- <div
      class="q-px-lg full-width flex column lt-sm"
      v-if="$q.platform.is.mobile && !$q.platform.is.ipad"
    >
      <q-select
        @blur="sendSelectTopicsEvent"
        v-model="topics"
        :rules="[
          (val) => val.length > 0 || 'At least one topic must be chosen.',
        ]"
        :options="options"
        multiple
        counter
        class="full-width"
        label="Topic(s) *"
        hint="You can pick more than one topic per post"
      />

      <q-input
        v-model="title"
        @blur="sendWriteTitleEvent"
        @focus="setTitle"
        :rules="[(val) => !!val || 'Title is required']"
        class="q-mx-none q-mt-sm"
        hint="Briefly describe the main idea of your post"
        label="Title *"
        placeholder="An example title on details here..."
      />
      <div class="q-gutter-sm q-mt-lg text-grey-7">
        <q-checkbox
          v-model="isQuestion"
          class="q-ma-none"
          label="Check if you are asking a question."
        />
      </div>
      <DialogSaveDraft />
    </div> -->
    <q-card
      bordered
      class="my-card absolute-center gt-xs"
      style="
        max-width: 700px;
        min-width: 50vw;
        max-height: 80vh;
        overflow: auto;
      "
    >
      <q-card-section class="flex q-pa-sm">
        <q-btn
          :to="{ name: 'ProductsNewDetails' }"
          icon="fas fa-chevron-left"
          dense
          flat
          round
        />
        <q-toolbar-title class="text-center">Create Product</q-toolbar-title>
        <div class="filler" />
      </q-card-section>

      <q-card-section class="row q-pb-none">
        <q-toolbar-title class="col-12">Images</q-toolbar-title>
        <q-btn
          @click="manageImageUploader"
          class="q-mt-sm q-pa-none"
          label="add images"
          icon="fas fa-plus"
          color="positive"
          flat
          dense
        />
        <input
          :style="{ display: 'none' }"
          @change="addImages"
          accept="image/*"
          ref="imageInput"
          type="file"
          multiple
        />
      </q-card-section>
      <q-card-section class="flex items- q-pt-none" v-if="hasImages">
        <div class="flex items-center" @click="editImages">
          <div class="text-subtitle1 text-primary">
            Added
            <span class="text-weight-bold"
              >{{ product.imagesList.length }}
              {{ product.imagesList.length > 1 ? "images" : "image" }}</span
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
          @click="removeMessage = true"
          label="Delete"
          class="q-px-sm q-py-none"
          unelevated
          outline
          color="warning"
          size="md"
        />
      </q-card-section>

      <q-card-section class="row">
        <q-toolbar-title class="col-12">Downloadable Content</q-toolbar-title>
        <q-btn
          @click="manageFileUploader"
          class="q-mt-sm q-pa-none"
          label="add downloadable content"
          icon="fas fa-plus"
          color="positive"
          flat
          dense
        />
        <input
          :style="{ display: 'none' }"
          @change="addFiles"
          accept="*"
          ref="fileInput"
          type="file"
          multiple
        />
        <div v-if="hasFiles" class="row col-12 q-mt-sm">
          <div
            class="row col-12 q-pa-none"
            v-for="(file, index) in product.uploadedFiles"
            :key="index"
          >
            <q-item
              class="q-mx-none q-ml-auto col-11 q-pa-none"
              style="min-height: 0 !important"
              :href="file.file"
              target="_blank"
              clickable
            >
              <div class="text-subtitle1 text-primary text-weight-bold">
                {{ `${file.name} | ${Math.floor(file.size / 1000)} KB` }}
              </div>
            </q-item>
            <q-btn
              @click="removeUploadedFile(file)"
              icon="fas fa-times"
              color="negative"
              dense
              class="col-1"
              flat
              size="sm"
            />
          </div>
        </div>
        <div v-if="newFiles && newFiles.length" class="row col-12 q-mt-sm">
          <div
            class="row col-12 q-mt-sm"
            v-for="(downloadable, index) in newFiles"
            :key="index"
          >
            <q-input
              outlined
              class="q-mx-none col-3"
              label="Name"
              v-model="downloadable.name"
            />
            <div class="q-my-auto text-h5 q-mx-auto">:</div>
            <div class="q-mx-none q-my-auto q-ml-auto col-7">
              <div class="text-subtitle1">
                {{
                  `${downloadable.file.name} | ${Math.floor(
                    downloadable.file.size / 1000
                  )} KB`
                }}
              </div>
            </div>
            <q-btn
              @click="removeFile(index)"
              icon="fas fa-times"
              color="negative"
              dense
              class="col-1"
              flat
              size="sm"
            />
          </div>
          <q-btn
            @click="uploadFiles"
            label="Upload files"
            icon="fas fa-upload"
            color="primary"
            dense
            flat
            class="q-mt-sm"
          />
        </div>
      </q-card-section>

      <q-card-actions class="q-px-md">
        <q-btn
          :to="{
            name: 'ProductsNewPreview',
            params: { supplierId, productId },
          }"
          :disable="!hasImages"
          label="Preview"
          color="primary"
          unelevated
          class="full-width q-mt-sm"
        />
      </q-card-actions>
      <router-view v-slot="{ Component }">
        <q-dialog v-model="cropperDialog" persistent maximized>
          <component
            :is="Component"
            @closeDialog="closeDialog"
            :supplierId="supplierId"
            :productId="productId"
            :uploadedImagesList="uploadedImagesList"
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
              @click="removeImages"
              color="negative"
              label="Delete all"
              flat
            />
            <q-btn v-close-popup label="Cancel" flat outline />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default {
  props: ["supplierId", "productId"],
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const q = useQuasar();
    const product = computed(() => store.getters["products/getProduct"]);
    const hasImages = computed(
      () =>
        product.value &&
        product.value.imagesList &&
        product.value.imagesList.length
    );
    const hasFiles = computed(
      () =>
        product.value &&
        product.value.uploadedFiles &&
        product.value.uploadedFiles.length
    );
    const imageInput = ref(null);
    const fileInput = ref(null);
    const cropperDialog = ref(false);
    const uploadedImagesList = computed(
      () => store.getters["images/getUploadedImages"]
    );
    const removeMessage = ref(false);
    const newFiles = ref([]);

    onMounted(async () => {
      if (!product.value) {
        try {
          console.log("set product running");
          const product = await store.dispatch(
            "products/setProduct",
            props.productId
          );
          store.commit("products/setProductData", product);
        } catch (error) {
          console.log("error: ", error);
        }
      }
    });

    function manageImageUploader() {
      imageInput.value.click();
    }

    async function addImages(event) {
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
      console.log(totalSize, files);
      if (files && files.length) {
        cropperDialog.value = true;
        q.loading.show();
        await store.dispatch("images/setUploadedImages", { files });
        store.commit("images/generateImageOrder");
        q.loading.hide();
        router.push({ name: "ProductImagesCropper" });
      }
    }

    async function editImages() {
      await store.dispatch("images/setUploadedImages");
      store.commit("images/generateImageOrder");
      router.push({ name: "ProductImagesCropper" });
      cropperDialog.value = true;
    }

    async function removeImages() {
      await store.dispatch("images/removeImages");
    }

    function manageFileUploader() {
      fileInput.value.click();
    }

    function addFiles(event) {
      const files = event.target.files;
      for (const file of files) {
        newFiles.value.push({
          file,
          name: file.name,
        });
      }
    }

    function removeFile(index) {
      newFiles.value.splice(index, 1);
    }

    async function uploadFiles() {
      try {
        await store.dispatch("products/uploadFile", {
          newFiles: newFiles.value,
          supplierId: props.supplierId,
          productId: props.productId,
        });
        newFiles.value = [];
        console.log(fileInput.value.value);
        fileInput.value.value = null;
      } catch (error) {
        console.log(error);
      }
    }

    async function removeUploadedFile(file) {
      await store.dispatch("products/removeUploadedFile", {
        productId: props.productId,
        file,
      });
    }

    function closeDialog() {
      cropperDialog.value = false;
    }

    return {
      product,
      hasImages,
      imageInput,
      hasFiles,
      fileInput,
      cropperDialog,
      manageImageUploader,
      uploadedImagesList,
      addImages,
      editImages,
      removeImages,
      newFiles,
      manageFileUploader,
      addFiles,
      removeFile,
      uploadFiles,
      removeUploadedFile,
      closeDialog,
      removeMessage,
    };
  },
};
</script>

<style lang="sass" scoped>
.filler
  width: 24px
  height: 24px
</style>

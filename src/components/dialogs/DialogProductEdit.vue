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
      <q-card-section class="full-width q-px-md">
        <q-input
          v-model="name"
          class="q-mx-none full-width"
          label="Name of Product"
        />
      </q-card-section>
      <q-card-section class="row">
        <q-toolbar-title class="col-12">Overview</q-toolbar-title>
        <div
          v-for="(value, key) in editedProduct.overview"
          class="row col-12 text-subtitle1"
          :key="key"
        >
          <div class="col-2">{{ key }}</div>
          <strong>:</strong>
          <div class="col-7 q-ml-lg">{{ value }}</div>
          <div class="col-2 q-ml-auto flex justify-end items-start">
            <q-btn
              @click="removeOverview(key)"
              class="q-ml-xs"
              icon="fas fa-times"
              size="sm"
              dense
              flat
              color="negative"
            />
          </div>
        </div>
        <q-btn
          @click="openDialogOverviewAdd"
          class="q-mt-sm q-pa-none"
          label="add/edit"
          icon="fas fa-plus"
          color="positive"
          flat
          dense
        />
      </q-card-section>
      <q-card-section class="full-width q-px-md">
        <q-input
          v-model="moreInformation"
          type="textarea"
          autogrow
          class="q-mx-none full-width"
          label="More Information"
        />
      </q-card-section>
      <q-card-actions class="full-width q-px-md">
        <q-btn
          @click="editProductData"
          :disable="isDeepEqual(product, editedProduct)"
          v-close-popup
          class="full-width"
          color="primary"
          label="Edit Product"
          unelevated
          no-caps
        />
      </q-card-actions>
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
      </q-card-section>
      <q-dialog v-model="cropperDialog" persistent maximized>
        <cropper
          @closeDialog="closeImageDialog"
          :supplierId="product.supplier.id"
          :productId="product.id"
          :uploadedImagesList="product.imagesList"
        />
      </q-dialog>
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
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import {
  ref,
  computed,
  onMounted,
  defineAsyncComponent,
  onUnmounted,
} from "vue";
import { isDeepEqual } from "src/logic/DeepEqual.js";
import DialogFilesAdd from "src/components/dialogs/DialogFilesAdd.vue";
import DialogOverviewAdd from "src/components/dialogs/DialogOverviewAdd.vue";

export default {
  props: ["postData"],
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  components: {
    cropper: defineAsyncComponent(() =>
      import("src/components/ProductImagesCropper.vue")
    ),
  },
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
    const q = useQuasar();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const product = computed(() => store.getters["products/getProduct"]);
    const editedProduct = computed(
      () => store.getters["products/getEditedProduct"]
    );
    const name = computed({
      get: () => editedProduct.value.name,
      set: (value) =>
        store.commit("products/updateEditedProduct", { field: "name", value }),
    });
    const moreInformation = computed({
      get: () => editedProduct.value.moreInformation,
      set: (value) =>
        store.commit("products/updateEditedProduct", {
          field: "moreInformation",
          value,
        }),
    });
    const hasImages = computed(
      () =>
        product.value &&
        product.value.imagesList &&
        product.value.imagesList.length
    );
    const imageInput = ref(null);
    const cropperDialog = ref(false);
    const removeMessage = ref(false);
    const fileInput = ref(null);
    const hasFiles = computed(
      () =>
        product.value &&
        product.value.uploadedFiles &&
        product.value.uploadedFiles.length
    );

    onMounted(async () => {
      const productProperties = Object.keys(product.value);
      for (const property of productProperties) {
        store.commit("products/updateEditedProduct", {
          field: property,
          value: product.value[property],
        });
      }
    });

    function removeOverview(key) {
      const newOverview = { ...editedProduct.value.overview };
      delete newOverview[key];
      store.commit("products/updateEditedProduct", {
        field: "overview",
        value: newOverview,
      });
    }

    function openDialogOverviewAdd() {
      q.dialog({
        component: DialogOverviewAdd,
        componentProps: {
          overview: { ...editedProduct.value.overview },
          overviewKeys: product.value.supplier.overviewKeys,
        },
      }).onOk((payload) => {
        store.commit("products/updateEditedProduct", {
          field: "overview",
          value: payload.overview,
        });
      });
    }

    function addOverview() {
      overview.value[newOverview.value.key] = newOverview.value.value;
      console.log(overview.value);
      store.commit("products/updateEditedProduct", {
        field: "overview",
        value: overview.value,
      });
      newOverview.value = {
        key: "",
        value: "",
      };
    }

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
      if (files && files.length) {
        q.loading.show();
        await store.dispatch("images/setUploadedImages", { files });
        store.commit("images/generateImageOrder");
        cropperDialog.value = true;
        q.loading.hide();
      }
    }

    async function editImages() {
      await store.dispatch("images/setUploadedImages");
      store.commit("images/generateImageOrder");
      cropperDialog.value = true;
    }

    async function removeImages() {
      await store.dispatch("images/removeImages");
    }

    function closeImageDialog() {
      cropperDialog.value = false;
      imageInput.value.value = null;
    }

    function manageFileUploader() {
      fileInput.value.click();
    }

    async function addFiles(event) {
      const files = event.target.files;
      q.loading.show({
        message: "Uploading files...",
      });
      await new Promise((resolve, reject) => {
        q.dialog({
          component: DialogFilesAdd,
          componentProps: { files },
        })
          .onOk(async (payload) => {
            await store.dispatch("products/uploadFiles", {
              newFiles: payload.files,
              supplierId: product.value.supplier.id,
              productId: product.value.id,
            });
          })
          .onCancel();
        resolve();
      });
      q.loading.hide();
      fileInput.value.value = null;
    }

    async function removeUploadedFile(file) {
      await store.dispatch("products/removeUploadedFile", {
        productId: product.value.id,
        file,
      });
    }

    async function editProductData() {
      try {
        const updatedData = {
          imagesList: product.value.imagesList,
        };
        if (product.value.uploadedFiles) {
          updatedData["uploadedFiles"] = [...product.value.uploadedFiles];
        }
        for (const [key, value] of Object.entries(updatedData)) {
          store.commit("products/updateEditedProduct", {
            field: key,
            value,
          });
        }
        await store.dispatch("products/editProduct");
        onDialogOK();
      } catch (error) {
        console.log(error);
      }
    }

    onUnmounted(() => {
      store.commit("products/clearEditProduct");
      return true;
    });

    //   try {
    //     await store.dispatch("posts/editPost", {
    //       postId: props.postData.postId,
    //       title: newTitle.value,
    //       content: newContent.value,
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    return {
      q,
      dialogRef,
      onDialogHide,
      product,
      editedProduct,
      isDeepEqual,
      name,
      openDialogOverviewAdd,
      addOverview,
      removeOverview,
      moreInformation,
      hasImages,
      imageInput,
      cropperDialog,
      removeMessage,
      manageImageUploader,
      addImages,
      editImages,
      removeImages,
      closeImageDialog,
      fileInput,
      manageFileUploader,
      addFiles,
      hasFiles,
      removeUploadedFile,
      editProductData,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

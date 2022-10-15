<template>
  <div>
    <div>
      <div class="full-width flex justify-between q-mt-sm">
        <q-btn
          color="secondary"
          icon="fas fa-chevron-left"
          dense
          flat
          :to="{ name: 'SupplierCreateInformation' }"
        />
        <div class="text-h5">Logo and Contact</div>
      </div>
      <div class="q-mt-md flex items-center">
        <q-btn
          @click="manageUploader"
          outline
          color="primary"
          :label="logo ? 'Change Logo' : 'Upload Logo'"
          icon="fas fa-plus"
          flat
        />
        <input
          :style="{ display: 'none' }"
          @change="fileChanged"
          accept="image/*"
          ref="imageInput"
          type="file"
        />
        <q-img
          ratio="1"
          class="q-ml-auto"
          style="max-width: 50%; border: 2px solid #7b95a3"
          :src="logo"
        />
      </div>
    </div>
    <div class="full-width flex justify-center q-mt-lg">
      <q-btn
        @click="createSupplier"
        :disable="logo ? false : true"
        class="full-width"
        label="Create Supplier"
        color="primary"
      />
    </div>
    <router-view v-slot="{ Component }">
      <q-dialog
        v-model="cropperDialog"
        persistent
        style="max-height: 50vh"
        :maximized="
          $q.platform.is.mobile && !$q.platform.is.ipad ? true : false
        "
      >
        <component :is="Component" @closeDialog="closeDialog" />
      </q-dialog>
    </router-view>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import amplitude from "amplitude-js";
import { collection, doc } from "@firebase/firestore";
import { db } from "src/boot/firebase";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const q = useQuasar();
    const imageInput = ref(null);
    const cropperDialog = ref(false);
    const logo = computed(() => store.getters["suppliers/getLogo"]);
    const name = computed(() => store.getters["suppliers/getName"]);
    const description = computed(
      () => store.getters["suppliers/getDescription"]
    );
    const website = computed(() => store.getters["suppliers/getWebsite"]);
    const emails = computed(() => store.getters["suppliers/getEmails"]);
    const productGroup = computed(
      () => store.getters["suppliers/getProductGroup"]
    );
    const categories = computed(() => store.getters["suppliers/getCategories"]);
    const socialMedia = computed(
      () => store.getters["suppliers/getSocialMedia"]
    );
    const contact = computed(() => store.getters["suppliers/getContact"]);

    function manageUploader() {
      imageInput.value.click();
    }

    async function fileChanged(event) {
      const file = event.target.files[0];
      try {
        await store.dispatch("images/convertUploadedImage", file);
        console.log("store passed");
        cropperDialog.value = true;
        console.log("cropper value changed");
        router.push({ name: "SupplierCreateLogoCropper" });
      } catch (error) {
        console.log(error);
      }
    }

    function closeDialog() {
      cropperDialog.value = false;
    }

    async function createSupplier() {
      try {
        q.loading.show();
        const newSupplierId = createSupplierUID();
        // console.log("Created supplier ID", newSupplierId);
        await uploadAndCropLogo(newSupplierId);
        // console.log("Uploaded and cropped photo successfully");
        updateSupplierData();
        // console.log("Updated supplier data in state");
        createSupplierDoc(newSupplierId);
        // console.log("Created supplier doc in firestore successfully");
        clearState();
        // console.log("Cleared data in state");
        q.loading.hide();
        router.push({
          name: "SupplierProductCatalogue",
          params: { supplierId: newSupplierId },
        }); // Move to supplier page after creating the document
      } catch (error) {
        console.log(error);
      }
    }

    function createSupplierUID() {
      const newSupplierId = doc(collection(db, "suppliers")).id;
      console.log(newSupplierId);
      return newSupplierId;
    }

    async function uploadAndCropLogo(id) {
      const photoData = {
        storageFolder: "supplier_logo_pics",
        id,
      };
      const downloadURL = await store.dispatch(
        "images/cropAndUpdatePhotoURL",
        photoData
      );
      store.commit("suppliers/updateSupplierData", { logo: downloadURL });
      console.log("Updated firestore supplier logo in state");
      return;
    }

    function updateSupplierData() {
      const newSupplierData = {
        name: name.value,
        description: description.value,
        website: website.value,
        emails: emails.value,
        productGroup: productGroup.value,
        categories: categories.value,
        socialMedia: socialMedia.value,
        contact: contact.value,
      };
      return store.commit("suppliers/updateSupplierData", newSupplierData);
    }

    async function createSupplierDoc(supplierId) {
      await store.dispatch("suppliers/updateSupplierDoc", supplierId);
    }

    function clearState() {
      store.commit("suppliers/clearCreateSupplier");
      store.commit("suppliers/clearSupplierData");
      store.commit("images/clearUploadedImage");
    }

    return {
      imageInput,
      manageUploader,
      fileChanged,
      cropperDialog,
      closeDialog,
      logo,
      createSupplier,
    };
  },
};
</script>

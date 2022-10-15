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
      v-if="supplier"
      :style="
        q.platform.is.desktop || q.platform.is.ipad
          ? { width: '600px', maxWidth: '70vw' }
          : null
      "
    >
      <q-card-actions>
        <q-btn v-close-popup icon="fas fa-times" dense flat round />
      </q-card-actions>
      <q-card-section class="flex column">
        <q-img
          ratio="1"
          :src="editedSupplier.logo"
          class="q-mx-auto"
          style="max-width: 200px"
        />
        <q-btn
          @click="manageUploader"
          label="Edit Logo"
          outline
          dense
          color="primary"
        />
        <input
          :style="{ display: 'none' }"
          @change="fileChanged"
          accept="image/*"
          ref="imageInput"
          type="file"
        />
      </q-card-section>
      <q-card-section class="full-width q-px-md">
        <q-input
          v-model="name"
          class="q-mx-none full-width"
          label="Name of Supplier"
        />
        <q-input
          v-model="description"
          type="textarea"
          autogrow
          class="q-mx-none q-mt-sm full-width"
          label="Description"
        />
        <q-input
          v-model="contact"
          type="textarea"
          autogrow
          class="q-mx-none q-mt-sm full-width"
          label="Contact Us"
        />
        <q-input
          v-model="website"
          class="q-mx-none q-mt-sm full-width"
          label="Website"
        />
        <q-select
          v-model="socialMediaType"
          :options="socialMediaOptions"
          class="q-mx-none q-mt-sm full-width"
          label="Social Media Type"
        />
        <q-input
          v-model="socialMediaLink"
          class="q-mx-none q-mt-sm full-width"
          label="Social Media Link"
        />
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Emails</div>
        <q-list>
          <q-item
            v-for="(email, index) in emails"
            :key="index"
            class="q-pa-none"
          >
            <q-item-section>{{ email }}</q-item-section>
            <q-item-section avatar>
              <q-btn
                @click="removeEmail(index)"
                icon="fas fa-times"
                color="negative"
                flat
                dense
              />
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn
          v-if="!showEmailInput"
          class="q-mt-sm"
          @click="showEmailInput = true"
          flat
          icon="fas fa-plus"
          label="Email"
          color="primary"
          dense
        />
        <q-input
          @keyup.enter="addEmail"
          v-if="showEmailInput"
          autofocus
          @blur="showEmailInput = false"
          class="q-mt-xs"
          type="email"
          outlined
          label="Email"
          v-model="email"
        >
          <template v-slot:append>
            <q-btn
              :disable="!email"
              @click="addEmail"
              label="add"
              color="positive"
              unelevated
              size="small"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Overview Keys</div>
        <q-list v-if="overviewKeys">
          <q-item
            v-for="(overviewKey, index) in overviewKeys"
            :key="index"
            class="q-pa-none"
          >
            <q-item-section>{{ overviewKey }}</q-item-section>
            <q-item-section avatar>
              <q-btn
                @click="removeOverviewKey(index)"
                icon="fas fa-times"
                color="negative"
                flat
                dense
              />
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn
          v-if="!showOverviewKeyInput"
          class="q-mt-sm"
          @click="showOverviewKeyInput = true"
          flat
          icon="fas fa-plus"
          label="Overview Key"
          color="primary"
          dense
        />
        <q-input
          @keyup.enter="addOverviewKey"
          v-if="showOverviewKeyInput"
          autofocus
          @blur="showOverviewKeyInput = false"
          class="q-mt-xs"
          type="text"
          outlined
          label="Overview Key"
          v-model="overviewKey"
        >
          <template v-slot:append>
            <q-btn
              :disable="!overviewKey"
              @click="addOverviewKey"
              label="add"
              color="positive"
              unelevated
              size="small"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Product Categories</div>
        <q-input
          class="q-mt-md"
          outlined
          label="Product Group"
          v-model="productGroup"
          :rules="[
            (val) => (val && val.length > 0) || 'This field is required.',
          ]"
        />
        <q-list>
          <q-item
            v-for="(category, index) in categories"
            :key="index"
            class="q-pa-none"
          >
            <q-item-section>{{ category }}</q-item-section>
            <q-item-section avatar>
              <q-btn
                @click="removeCategory(index)"
                icon="fas fa-times"
                color="negative"
                flat
                dense
              />
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn
          v-if="!showCategoryInput"
          class="q-mt-sm"
          @click="showCategoryInput = true"
          flat
          icon="fas fa-plus"
          label="Category"
          color="primary"
          dense
        />
        <q-input
          @keyup.enter="addCategory"
          v-if="showCategoryInput"
          autofocus
          @blur="showCategoryInput = false"
          class="q-mt-xs"
          outlined
          label="Category"
          v-model="category"
        >
          <template v-slot:append>
            <q-btn
              :disable="!category"
              @click="addCategory"
              label="add"
              color="positive"
              unelevated
              size="small"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Cascading Data</div>
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
        <div
          v-if="supplier.uploadedFiles && supplier.uploadedFiles.length"
          class="row col-12 q-mt-sm"
        >
          <div
            class="row col-12 q-pa-none"
            v-for="(file, index) in supplier.uploadedFiles"
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
        <q-input
          v-model="moreInformation"
          type="textarea"
          autogrow
          class="q-mx-none q-mt-sm full-width"
          label="More Information"
        />
      </q-card-section>
      <q-card-actions>
        <q-btn
          :disable="disableEditButton"
          @click="editSupplier"
          class="q-mt-sm full-width"
          label="Edit Supplier Information"
          color="primary"
        />
      </q-card-actions>
    </q-card>
    <q-dialog v-model="cropper">
      <LogoCropper @closeDialog="closeDialog" />
    </q-dialog>
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
  onUnmounted,
  defineAsyncComponent,
} from "vue";
import { isDeepEqual } from "src/logic/DeepEqual.js";
import DialogFilesAdd from "src/components/dialogs/DialogFilesAdd.vue";

export default {
  props: [],
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  components: {
    LogoCropper: defineAsyncComponent(() =>
      import("src/components/SupplierCreateLogoCropper")
    ),
  },
  setup(props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const q = useQuasar();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const supplier = computed(() => store.getters["suppliers/getSupplier"]);
    const editedSupplier = computed(
      () => store.getters["suppliers/getEditedSupplier"]
    );
    const imageInput = ref(null);
    const cropper = ref(false);
    const name = computed({
      get: () => editedSupplier.value.name,
      set: (value) =>
        store.commit("suppliers/updateEditedSupplier", {
          field: "name",
          value,
        }),
    });
    const description = computed({
      get: () => editedSupplier.value.description,
      set: (value) =>
        store.commit("suppliers/updateEditedSupplier", {
          field: "description",
          value,
        }),
    });
    const contact = computed({
      get: () => editedSupplier.value.contact,
      set: (value) =>
        store.commit("suppliers/updateEditedSupplier", {
          field: "contact",
          value,
        }),
    });
    const website = computed({
      get: () => editedSupplier.value.website,
      set: (value) =>
        store.commit("suppliers/updateEditedSupplier", {
          field: "website",
          value,
        }),
    });
    const socialMediaOptions = ref(["Facebook", "Instagram"]);
    const socialMediaType = computed({
      get: () => editedSupplier.value.socialMedia.type,
      set: (value) =>
        store.commit("suppliers/updateEditedSupplier", {
          field: "socialMedia",
          value: {
            type: value,
            link: socialMediaLink.value,
          },
        }),
    });
    const socialMediaLink = computed({
      get: () => editedSupplier.value.socialMedia.link,
      set: (value) =>
        store.commit("suppliers/updateEditedSupplier", {
          field: "socialMedia",
          value: {
            type: socialMediaType.value,
            link: value,
          },
        }),
    });
    const email = ref("");
    const emails = computed(() => editedSupplier.value.emails);
    const showEmailInput = ref(false);
    const overviewKey = ref("");
    const overviewKeys = computed(() => editedSupplier.value.overviewKeys);
    const showOverviewKeyInput = ref(false);
    const productGroup = computed({
      get: () => editedSupplier.value.productGroup,
      set: (value) =>
        store.commit("suppliers/updateEditedSupplier", {
          field: "productGroup",
          value,
        }),
    });
    const category = ref("");
    const categories = computed(() => editedSupplier.value.categories);
    const showCategoryInput = ref(false);
    const disableEditButton = computed(() =>
      isDeepEqual(supplier.value, editedSupplier.value)
    );
    const fileInput = ref(null);
    const moreInformation = computed({
      get: () => editedSupplier.value.moreInformation,
      set: (value) =>
        store.commit("suppliers/updateEditedSupplier", {
          field: "moreInformation",
          value,
        }),
    });

    onMounted(async () => {
      const supplierProperties = Object.keys(supplier.value);
      for (const property of supplierProperties) {
        store.commit("suppliers/updateEditedSupplier", {
          field: property,
          value: supplier.value[property],
        });
      }
    });

    async function uploadAndCropLogo() {
      const photoData = {
        storageFolder: "supplier_logo_pics",
        id: supplier.value.id,
      };
      const downloadURL = await store.dispatch(
        "images/cropAndUpdatePhotoURL",
        photoData
      );
      store.commit("suppliers/updateEditedSupplier", {
        field: "logo",
        value: downloadURL,
      });
      console.log("Updated supplier logo in state");
    }

    function manageUploader() {
      imageInput.value.click();
    }

    async function fileChanged(event) {
      const file = event.target.files[0];
      try {
        await store.dispatch("images/convertUploadedImage", file);
        console.log("store passed");
        cropper.value = true;
      } catch (error) {
        console.log(error);
      }
    }

    function closeDialog() {
      cropper.value = false;
    }

    function addEmail() {
      store.commit("suppliers/updateEditedSupplier", {
        field: "emails",
        value: [...emails.value, email.value],
      });
      email.value = "";
      showEmailInput.value = false;
      showEmailInput.value = true;
    }

    function removeEmail(index) {
      const updatedEmails = [...emails.value];
      updatedEmails.splice(index, 1);
      store.commit("suppliers/updateEditedSupplier", {
        field: "emails",
        value: updatedEmails,
      });
    }

    function addOverviewKey() {
      if (!overviewKeys.value) {
        store.commit("suppliers/updateEditedSupplier", {
          field: "overviewKeys",
          value: [overviewKey.value],
        });
      } else {
        store.commit("suppliers/updateEditedSupplier", {
          field: "overviewKeys",
          value: [...overviewKeys.value, overviewKey.value],
        });
      }
      overviewKey.value = "";
      showOverviewKeyInput.value = false;
      showOverviewKeyInput.value = true;
    }

    function removeOverviewKey(index) {
      const updatedOverviewKeys = [...overviewKeys.value];
      updatedOverviewKeys.splice(index, 1);
      store.commit("suppliers/updateEditedSupplier", {
        field: "overviewKeys",
        value: updatedOverviewKeys,
      });
    }

    function addCategory() {
      store.commit("suppliers/updateEditedSupplier", {
        field: "categories",
        value: [...categories.value, category.value],
      });
      category.value = "";
    }

    function removeCategory(index) {
      const updatedCategories = [...categories.value];
      updatedCategories.splice(index, 1);
      store.commit("suppliers/updateEditedSupplier", {
        field: "categories",
        value: updatedCategories,
      });
    }

    function manageFileUploader() {
      fileInput.value.click();
    }

    async function addFiles(event) {
      const files = event.target.files;
      await new Promise((resolve, reject) => {
        q.dialog({
          component: DialogFilesAdd,
          componentProps: {
            files,
          },
        })
          .onOk(async (payload) => {
            // vuex command to add cascading files to a supplier
            await store.dispatch("suppliers/uploadFiles", payload);
          })
          .onCancel();
        resolve();
      });
      fileInput.value.value = null;
    }

    async function removeUploadedFile(file) {
      try {
        await store.dispatch("suppliers/removeFile", file);
      } catch (error) {
        console.log(error);
      }
    }

    async function editSupplier() {
      try {
        q.loading.show({
          message: "Updating supplier information",
        });
        if (editedSupplier.value.logo !== supplier.value.logo) {
          await uploadAndCropLogo();
        }
        store.commit("suppliers/updateSupplierData", {
          ...editedSupplier.value,
        });
        await store.dispatch("suppliers/updateSupplierDoc", supplier.value.id);
        q.loading.hide();
        onDialogHide();
      } catch (error) {
        q.loading.hide();
        console.log(error);
      }
    }

    onUnmounted(() => {
      store.commit("suppliers/clearEditedSupplier");
      store.commit("suppliers/clearSupplierData");
      store.commit("images/clearUploadedImage");
    });

    return {
      q,
      dialogRef,
      onDialogHide,
      supplier,
      editedSupplier,
      imageInput,
      fileInput,
      manageUploader,
      fileChanged,
      closeDialog,
      cropper,
      name,
      description,
      contact,
      website,
      socialMediaOptions,
      socialMediaType,
      socialMediaLink,
      showEmailInput,
      email,
      emails,
      addEmail,
      removeEmail,
      overviewKey,
      overviewKeys,
      showOverviewKeyInput,
      addOverviewKey,
      removeOverviewKey,
      productGroup,
      showCategoryInput,
      category,
      categories,
      addCategory,
      removeCategory,
      manageFileUploader,
      addFiles,
      removeUploadedFile,
      moreInformation,
      disableEditButton,
      editSupplier,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

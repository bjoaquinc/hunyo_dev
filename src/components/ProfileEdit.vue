<template>
  <div class="q-pa-md" v-if="userId">
    <div class="flex items-center q-mb-md desktop-only">
      <q-btn
        :to="{ name: 'PageProfile' }"
        color="primary"
        icon="fas fa-arrow-left"
        label="Back to Profile"
        dense
        flat
      />
    </div>
    <q-form class="q-gutter-sm">
      <div class="flex column flex-center">
        <q-btn round align="center" @click="manageUploader">
          <q-avatar size="110px">
            <img :src="photoURL" />
          </q-avatar>
        </q-btn>
        <q-btn
          @click="manageUploader"
          color="secondary"
          label="Change Profile Photo"
          size="sm"
          class="q-mt-sm"
          dense
          flat
        />
        <div class="text-caption text-italic text-negative">
          We're an informal community so please upload a picture of yourself not
          your company logo.
        </div>
      </div>

      <input
        :style="{ display: 'none' }"
        @change="fileChanged"
        accept="image/*"
        ref="imageInput"
        type="file"
      />

      <q-input
        v-model="name"
        dense
        class="full-width"
        filled
        label="Full name *"
        hint="Real Name Required"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        v-model="profession"
        dense
        class="full-width"
        filled
        label="Profession"
        hint="For Verification Purposes"
        lazy-rules
      />

      <q-input
        v-model="licenseNumber"
        dense
        class="full-width"
        filled
        label="License Number"
        hint="Will Not Be Made Public. For Verification Purposes"
        lazy-rules
      />

      <q-input
        v-model="birthdate"
        filled
        dense
        class="full-width"
        :rules="['date']"
        label="Birthdate"
        hint="yyyy/mm/dd. For Verification Purposes"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="qDateProxy"
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="birthdate">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-select
        v-model="experience"
        :options="experienceOptions"
        filled
        dense
        class="full-width"
        label="Years of Professional Experience"
        hint="Will Not Be Made Public"
      />

      <q-input
        v-model="employerName"
        dense
        class="full-width"
        filled
        label="Employer Name"
        hint="Name of Company, University, or Self-Employed"
        lazy-rules
      />

      <q-select
        v-model="employerSize"
        :options="employerSizeOptions"
        :class="q.platform.is.mobile ? 'q-mb-md' : ''"
        filled
        dense
        class="full-width"
        label="Company Size"
        hint="Select size only if your company is based locally, otherwise select Based Abroad or Academe"
      />

      <q-input
        v-model="location"
        dense
        class="full-width"
        filled
        label="Location"
        hint="City, Country"
        lazy-rules
      />

      <q-input
        v-model="website"
        dense
        class="full-width"
        filled
        label="Website"
        hint="Professional website or LinkedIn Account"
        lazy-rules
      />

      <q-input
        v-model="bio"
        autogrow
        dense
        class="full-width q-mb-md"
        filled
        type="textarea"
        label="Bio"
        hint="Describe Yourself. Ex: Job Title, Professional interests/specialties, and maybe one hobby or interesting fact about you. (Designers are fun, too!)"
        lazy-rules
      />

      <q-btn
        @click="updateUserData"
        label="Done"
        color="primary"
        class="full-width q-mt-md"
        :disable="!isEdited"
        unelevated
      />
    </q-form>
    <router-view v-slot="{ Component }">
      <q-dialog
        v-model="cropperDialog"
        persistent
        :maximized="q.platform.is.mobile ? true : false"
      >
        <component :is="Component" @closeDialog="closeDialog" />
      </q-dialog>
    </router-view>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useQuasar } from "quasar";
import DialogSaveDraft from "src/components/DialogSaveDraft.vue";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const q = useQuasar();
    const cropperDialog = ref(false);
    const imageInput = ref(null);
    const userData = computed(() => store.getters["profile/getUserData"]);
    const userId = computed(() => store.getters["profile/getUserId"]);
    const editedUserData = computed(
      () => store.getters["profile/getEditedUserData"]
    );
    const experienceOptions = ref(["0-2", "3-4", "5-10", "11+"]);
    const employerSizeOptions = ref([
      "1-5 people",
      "6-15 people",
      "16+ people",
      "Based Abroad",
      "Academe",
      "Unsure",
    ]);
    store.commit("profile/setEditedUserData", userData.value);
    const name = computed({
      get: () => editedUserData.value.displayName,
      set: (value) =>
        store.commit("profile/updateEditedUserData", {
          key: "displayName",
          value,
        }),
    });
    const profession = computed({
      get: () => editedUserData.value.profession,
      set: (value) =>
        store.commit("profile/updateEditedUserData", {
          key: "profession",
          value,
        }),
    });
    const licenseNumber = computed({
      get: () => editedUserData.value.licenseNumber,
      set: (value) =>
        store.commit("profile/updateEditedUserData", {
          key: "licenseNumber",
          value,
        }),
    });
    const birthdate = computed({
      get: () => editedUserData.value.birthdate,
      set: (value) =>
        store.commit("profile/updateEditedUserData", {
          key: "birthdate",
          value,
        }),
    });
    const experience = computed({
      get: () => editedUserData.value.experience,
      set: (value) =>
        store.commit("profile/updateEditedUserData", {
          key: "experience",
          value,
        }),
    });
    const employerName = computed({
      get: () => editedUserData.value.employerName,
      set: (value) =>
        store.commit("profile/updateEditedUserData", {
          key: "employerName",
          value,
        }),
    });
    const employerSize = computed({
      get: () => editedUserData.value.employerSize,
      set: (value) =>
        store.commit("profile/updateEditedUserData", {
          key: "employerSize",
          value,
        }),
    });
    const location = computed({
      get: () => editedUserData.value.location,
      set: (value) =>
        store.commit("profile/updateEditedUserData", {
          key: "location",
          value,
        }),
    });
    const website = computed({
      get: () => editedUserData.value.website,
      set: (value) =>
        store.commit("profile/updateEditedUserData", { key: "website", value }),
    });
    const bio = computed({
      get: () => editedUserData.value.bio,
      set: (value) =>
        store.commit("profile/updateEditedUserData", { key: "bio", value }),
    });
    const newProfilePicture = computed(
      () => store.getters["profile/newProfilePicture"]
    );
    const photoURL = computed(() => editedUserData.value.photoURL);

    function shallowEqual(object1, object2) {
      const keys1 = Object.keys(object1);
      const keys2 = Object.keys(object2);
      if (keys1.length !== keys2.length) {
        return false;
      }
      for (let key of keys1) {
        if (object1[key] !== object2[key]) {
          return false;
        }
      }
      return true;
    }

    watch(userId, (newValue, oldValue) => {
      if (newValue) {
        store.commit("profile/setEditedUserData", userData.value);
      }
    });

    const isEdited = computed(() =>
      shallowEqual(editedUserData.value, userData.value) ? false : true
    );

    function manageUploader() {
      imageInput.value.click();
    }

    async function fileChanged(event) {
      const file = event.target.files[0];
      try {
        await store.dispatch("profile/convertUploadedImage", file);
        cropperDialog.value = true;
        router.push({ name: "ProfileImageCropper" });
      } catch (error) {
        console.log(error);
      }
    }

    function closeDialog() {
      cropperDialog.value = false;
    }

    async function updateUserData() {
      try {
        if (userData.value.photoURL !== photoURL.value) {
          await store.dispatch(
            "profile/uploadAndUpdatePhotoURL",
            photoURL.value
          );
        }
        if (userData.value.displayName !== editedUserData.value.displayName) {
          await store.dispatch(
            "auth/updateUserName",
            editedUserData.value.displayName
          );
        }
        await store.dispatch("profile/updateUserData", {
          ...editedUserData.value,
        });
        store.commit("profile/setEditedUserData", userData.value);
        router.push({ name: "PageProfile" });
      } catch (error) {
        console.log(error);
      }
    }

    function confirmSaveDraft() {
      return new Promise((resolve) => {
        q.dialog({
          component: DialogSaveDraft,
        })
          .onOk(() => {
            resolve("Save Changes");
            updateUserData();
          })
          .onCancel(() => {
            resolve("Delete Changes");
          });
      });
    }

    onBeforeRouteLeave(async (to) => {
      if (isEdited.value) {
        const result = await confirmSaveDraft();
        console.log(result);
      }
      if (to.name !== "ProfileImageCropper") {
        store.commit("profile/clearImages");
      }
    });

    return {
      q,
      cropperDialog,
      experienceOptions,
      employerSizeOptions,
      name,
      profession,
      licenseNumber,
      birthdate,
      experience,
      employerName,
      employerSize,
      bio,
      location,
      website,
      photoURL,
      newProfilePicture,
      updateUserData,
      isEdited,
      manageUploader,
      fileChanged,
      imageInput,
      closeDialog,
      userId,
    };
  },
};
</script>

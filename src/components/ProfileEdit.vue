<template>
  <div class="q-pa-md">
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
            <img :src="newProfilePicture ? newProfilePicture : photoURL" />
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
        hint="Name and surname"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        v-model="work"
        dense
        class="full-width"
        filled
        label="Work"
        hint="Current employment or self employed"
        lazy-rules
      />

      <q-input
        v-model="bio"
        dense
        class="full-width"
        filled
        type="textarea"
        label="Bio"
        hint="Describe yourself"
        lazy-rules
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
        hint="Professional website or linkedin page"
        lazy-rules
      />

      <q-btn
        @click="updateUserData"
        :disable="isDisabled"
        label="Done"
        color="primary"
        class="full-width q-mt-md"
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
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useQuasar } from "quasar";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const q = useQuasar();
    const cropperDialog = ref(false);
    const imageInput = ref(null);

    const name = ref("");
    const work = ref("");
    const bio = ref("");
    const location = ref("");
    const website = ref("");

    const userData = computed(() => store.getters["profile/getUserData"]);
    const newProfilePicture = computed(
      () => store.getters["profile/newProfilePicture"]
    );
    const { displayName, photoURL } = userData.value;
    const isDisabled = computed(() => {
      if (
        name.value !== displayName ||
        work.value !== userData.value.work ||
        bio.value !== userData.value.bio ||
        location.value !== userData.value.location ||
        website.value !== userData.value.website ||
        newProfilePicture.value
      ) {
        return false;
      } else {
        return true;
      }
    });

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

    name.value = displayName;
    work.value = userData.value.work ? userData.value.work : "";
    bio.value = userData.value.bio ? userData.value.bio : "";
    location.value = userData.value.location ? userData.value.location : "";
    website.value = userData.value.website ? userData.value.website : "";

    async function updateUserData() {
      try {
        await store.dispatch("profile/updateUserData", {
          displayName: name.value,
          work: work.value,
          bio: bio.value,
          location: location.value,
          website: website.value,
        });
        if (newProfilePicture.value) {
          await store.dispatch(
            "profile/uploadAndUpdatePhotoURL",
            newProfilePicture.value
          );
        }
        router.push({ name: "PageProfile" });
      } catch (error) {
        console.log(error);
      }
    }

    onBeforeRouteLeave((to) => {
      if (to.name !== "ProfileImageCropper") {
        store.commit("profile/clearImages");
      }
    });

    return {
      q,
      cropperDialog,
      name,
      work,
      bio,
      location,
      website,
      photoURL,
      newProfilePicture,
      updateUserData,
      isDisabled,
      manageUploader,
      fileChanged,
      imageInput,
      closeDialog,
    };
  },
};
</script>

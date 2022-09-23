<template>
  <div style="height: 100%">
    <q-card
      class="full-width flex justify-between q-py-sm q-px-sm bg-grey-1"
      flat
      bordered
    >
      <q-btn
        color="secondary"
        icon="fas fa-chevron-left"
        dense
        flat
        :to="{ path: '/settings' }"
      />
      <div class="text-h6">Email</div>
      <q-btn
        @click="changeEmail"
        :loading="isLoading"
        class="lt-sm"
        color="secondary"
        label="Submit"
        dense
        flat
      />
      <div class="gt-xs" style="width: 28px; height: 28px" />
    </q-card>
    <div class="q-mx-md q-mt-md">
      <q-input
        v-model="email"
        class="q-mt-sm"
        outlined
        label="Email"
        type="email"
        :rules="[(val) => (val && val.length > 0) || 'This field is required.']"
      />
      <q-btn
        @click="changeEmail"
        :loading="isLoading"
        label="Submit"
        class="full-width gt-xs q-mt-sm"
        color="primary"
        :disable="!isEdited"
        unelevated
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { getAuth, reauthenticateWithCredential } from "firebase/auth";
import DialogReauthenticatePrompt from "src/components/dialogs/DialogReauthenticatePrompt.vue";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const q = useQuasar();
    const user = computed(() => store.getters["auth/getUser"]);
    const userData = computed(() => store.getters["profile/getUserData"]);
    const email = ref("");
    onMounted(() => {
      email.value = user.value.email;
      console.log(user.value.emailVerified);
    });
    const isEdited = computed(() => {
      return email.value !== userData.value.email ? true : false;
    });
    const isLoading = ref(false);

    async function changeEmail() {
      isLoading.value = true;
      try {
        const credential = await getCredential();
        if (!credential) return (isLoading.value = false);
        await reauthenticateUser(credential);
        await store.dispatch("auth/changeEmail", email.value);
        store.dispatch("auth/updateUser");
        q.notify({
          message: "Successfully changed your email.",
          color: "positive",
        });
        isLoading.value = false;
        router.push({
          name: "SignUpEmailVerification",
          params: { changeEmail: true },
        });
      } catch (error) {
        console.log(error);
        if (error.code === "auth/wrong-password") {
          q.notify({
            message: "Wrong password. Please try again.",
            color: "negative",
          });
        } else {
          q.notify({
            message:
              "An error occurred, please refresh the page and try again.",
            color: "negative",
          });
        }
        isLoading.value = false;
      }
    }

    async function getCredential() {
      const credential = await new Promise((resolve) => {
        q.dialog({
          component: DialogReauthenticatePrompt,
        })
          .onOk(async (credential) => {
            resolve(credential);
          })
          .onCancel(() => {
            resolve();
          });
      });
      return credential;
    }

    async function reauthenticateUser(credential) {
      const auth = getAuth();
      await reauthenticateWithCredential(auth.currentUser, credential);
    }

    return {
      email,
      isEdited,
      isLoading,
      changeEmail,
    };
  },
};
</script>

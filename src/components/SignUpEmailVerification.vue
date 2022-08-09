<template>
  <div v-if="user">
    <div class="full-width flex justify-between q-mt-sm" v-if="!changeEmail">
      <q-btn
        color="secondary"
        icon="fas fa-chevron-left"
        dense
        flat
        @click="goBack"
      />
      <div class="text-h6">Step 3 of 3</div>
    </div>

    <div class="text-h5 q-mt-lg text-weight-bold text-grey-8">
      We Emailed You a Link
    </div>
    <div class="text-subtitle1">
      Click on the link to verify {{ user.email }}. Please check your spam
      folder. It may take up to 5 minutes.
      <strong>Do not click the back button.</strong>
      <q-btn
        padding="0"
        class="q-ml-xs"
        @click="resendVerifyEmail"
        :disable="disableResendEmail"
        label="Resend Email."
        no-caps
        flat
        size="16px"
        color="primary"
        style="line-height: 0 !important"
        dense
      />
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import amplitude from "amplitude-js";
import DialogPromptReturn from "src/components/DialogPromptReturn";

export default {
  setup() {
    const store = useStore();
    const user = computed(() => store.getters["auth/getUser"]);
    const q = useQuasar();
    const route = useRoute();
    const router = useRouter();
    const disableResendEmail = ref(false);
    const changeEmail = ref(false);
    if (route.params.changeEmail) {
      changeEmail.value = true;
    }

    function logEvent(event, eventProperties) {
      try {
        amplitude
          .getInstance()
          .logEventWithTimestamp(event, eventProperties, null, () => {
            console.log(`Successfully logged ${event} event`);
          });
      } catch (error) {
        console.log(error);
      }
    }

    async function verifyEmail() {
      try {
        await store.dispatch("auth/verifyEmail");
        logEvent("signup - sent verification email", null);
      } catch (error) {
        logEvent("signup - error verification email", { error: error.code });
        q.dialog({
          message: error.message,
        });
      }
    }

    verifyEmail();

    async function resendVerifyEmail() {
      try {
        disableResendEmail.value = true;
        await verifyEmail();
        logEvent("signup - resend verification email", null);
        setTimeout(() => {
          disableResendEmail.value = false;
        }, 90000);
      } catch (error) {
        logEvent("signup - error resend verification email", {
          error: error.code,
        });
      }
    }

    async function goBack() {
      await new Promise((resolve) => {
        q.dialog({
          component: DialogPromptReturn,
        })
          .onOk(async () => {
            await signout();
            store.commit("auth/clearState");
            router.push("/signup/");
            resolve();
          })
          .onCancel(() => {
            resolve();
            return;
          });
      });
    }

    async function signout() {
      await store.dispatch("auth/signout");
      logEvent("signup - pressed back button and signed out", null);
    }

    return {
      changeEmail,
      user,
      resendVerifyEmail,
      disableResendEmail,
      goBack,
    };
  },
};
</script>

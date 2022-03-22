<template>
  <div>
    <div class="full-width flex justify-between q-mt-sm">
      <q-btn
        color="secondary"
        icon="fas fa-chevron-left"
        dense
        flat
        :to="{ path: '/signup/new-password' }"
        @click="signout"
      />
      <div class="text-h6">Step 3 of 3</div>
    </div>

    <div class="text-h6 q-mt-lg text-weight-bold text-grey-8">
      We Emailed You a Link
    </div>
    <div>
      Click on the link to verify {{ email }}.
      <q-btn
        padding="0"
        @click="resendVerifyEmail"
        :disable="disableResendEmail"
        label="Resend Email."
        no-caps
        flat
        size="14px"
        color="primary"
        dense
      />
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { auth } from "src/boot/firebase";

export default {
  setup() {
    const store = useStore();
    const email = computed(() => store.getters["auth/getEmail"]);
    const q = useQuasar();
    const disableResendEmail = ref(false);

    async function verifyEmail() {
      try {
        await store.dispatch("auth/verifyEmail");
      } catch (error) {
        q.dialog({
          message: error.message,
        });
      }
    }

    verifyEmail();

    async function resendVerifyEmail() {
      disableResendEmail.value = true;
      await verifyEmail();
      setTimeout(() => {
        disableResendEmail.value = false;
      }, 5000);
    }

    async function signout() {
      await store.dispatch("auth/signout");
    }

    return {
      email,
      resendVerifyEmail,
      disableResendEmail,
      signout,
    };
  },
};
</script>

<template>
  <div>
    <div
      class="q-px-lg full-width flex column mobile-only"
      v-if="$q.platform.is.mobile"
    >
      <q-input
        v-model="email"
        class="q-mx-none q-mt-sm"
        hint="Enter your email and we'll send you a link to get back into your account."
        label="Email *"
      />

      <q-btn
        :disable="email ? false : true"
        @click="sendPasswordEmail"
        label="Send Reset Link"
        color="primary"
        unelevated
        class="full-width q-mt-lg"
      />
    </div>
    <q-card
      bordered
      class="my-card absolute-center desktop-only"
      style="min-width: 30vw"
      v-else
    >
      <q-card-section class="flex q-pa-sm">
        <q-btn
          :to="{ name: 'PageLanding' }"
          icon="fas fa-times"
          dense
          flat
          round
        />
        <q-toolbar-title class="text-center"
          >Trouble Logging In?</q-toolbar-title
        >
        <div class="filler" />
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="email"
          class="q-mx-none q-mt-sm"
          hint="Enter your email and we'll send you a link to get back into your account."
          label="Email *"
        />
      </q-card-section>

      <q-card-actions>
        <q-btn
          :disable="email ? false : true"
          @click="sendPasswordEmail"
          label="Send Reset Link"
          color="primary"
          unelevated
          class="full-width q-mt-sm"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default {
  setup() {
    const email = ref("");
    const store = useStore();
    const q = useQuasar();

    async function sendPasswordEmail() {
      try {
        await store.dispatch("auth/resetPasswordEmail", email.value);
        email.value = "";
        q.notify({ message: "Successfully sent reset password email." });
      } catch (error) {
        console.log(error.message);
        let message = "";
        if (error.code === "auth/invalid-email") {
          message = "Invalid email, please check and try again.";
        } else if (error.code === "auth/user-not-found") {
          message = "There is no user with this email.";
        }
        q.notify({
          message: message ? message : error.message,
          color: "negative",
        });
      }
    }

    return {
      email,
      sendPasswordEmail,
    };
  },
};
</script>

<style lang="sass" scoped>
.filler
  width: 24px
  height: 24px
</style>

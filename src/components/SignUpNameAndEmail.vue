<template>
  <div>
    <div class="full-width flex justify-center">
      <q-avatar size="80px" style="border: none !important">
        <img src="hunyo_logo_small.png" />
      </q-avatar>
    </div>
    <div class="full-width flex justify-center">
      <div class="text-h4 q-mt-md">Congratulations!</div>
    </div>
    <div class="q-mt-md">
      You've been invited to join Hunyo, a closed community of designers in the
      built environment dedicated to knowledge sharing across Southeast Asia.
      Together we can create a better tommorow.
    </div>
    <div class="text-h5 q-mt-md text-weight-bold">Join now for free.</div>
    <q-input
      class="q-mt-md"
      outlined
      label="Full Name (Real Name Required)"
      v-model="name"
      :rules="[(val) => (val && val.length > 0) || 'This field is required.']"
    />
    <q-input
      class="q-mt-sm"
      outlined
      label="Email"
      v-model="email"
      type="email"
      :rules="[(val) => (val && val.length > 0) || 'This field is required.']"
    />
    <div class="full-width flex justify-center">
      <q-btn
        :disable="name && email ? false : true"
        class="q-mt-sm full-width"
        label="Join"
        color="primary"
        @click="logEvent"
      />
    </div>
    <div class="text-caption q-mt-sm">
      By joining, you agree to our
      <q-btn padding="0" size="13px" dense flat color="primary" no-caps
        >Terms of Service</q-btn
      >
      and
      <q-btn padding="0" size="13px" dense flat color="primary" no-caps
        >Privacy Policy</q-btn
      >, including
      <q-btn padding="0" size="13px" flat color="primary" no-caps
        >Cookie Use</q-btn
      >.
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import amplitude from "amplitude-js";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const name = computed({
      get: () => store.getters["auth/getNewUser"].name,
      set: (value) => store.commit("auth/setName", value),
    });
    const email = computed({
      get: () => store.getters["auth/getNewUser"].email,
      set: (value) => store.commit("auth/setEmail", value),
    });

    function logEvent() {
      try {
        router.push("/signup/new-password");
      } catch (error) {
        console.log(error);
      }
    }

    return {
      name,
      email,
      logEvent,
    };
  },
};
</script>

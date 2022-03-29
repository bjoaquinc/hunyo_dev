<template>
  <div style="height: 100%">
    <div class="full-width flex justify-between q-mt-sm">
      <q-btn
        color="secondary"
        icon="fas fa-chevron-left"
        dense
        flat
        :to="{ path: '/signup' }"
      />
      <div class="text-h6">Step 2 of 3</div>
    </div>
    <div class="text-h5 q-mt-lg text-weight-bold">Create Password</div>
    <q-input
      class="q-mt-md"
      :type="isPassword ? 'password' : 'text'"
      v-model="password"
      outlined
      :rules="[
        (val) => (val && val.length > 0) || 'Field is required.',
        (val) =>
          val.length > 6 || 'Password must be at least than 6 characters',
      ]"
      label="New Password"
    >
      <template v-slot:append>
        <q-icon
          :name="isPassword ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPassword = !isPassword"
        />
      </template>
    </q-input>
    <div class="full-width flex justify-center">
      <q-btn
        @click="signUp"
        :disable="password && password.length > 6 ? false : true"
        class="q-mt-md full-width"
        label="Next"
        color="primary"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const q = useQuasar();
    const password = computed({
      get: () => store.getters["auth/getNewUser"].password,
      set: (value) => store.commit("auth/setPassword", value),
    });
    const newUser = computed(() => store.getters["auth/getNewUser"]);
    const { email, name } = newUser.value;
    const isPassword = ref(true);

    async function signUp() {
      try {
        await store.dispatch("auth/createUser", {
          email,
          password: password.value,
        });
        await store.dispatch("auth/updateUser", name);
        router.push("/signup/email-verification");
      } catch (error) {
        q.dialog({
          message: error.message,
        });
        console.log(error);
      }
    }

    return {
      password,
      isPassword,
      signUp,
    };
  },
};
</script>

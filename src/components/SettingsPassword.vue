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
      <div class="text-h6">Change Password</div>
      <q-btn
        :disable="disableChangePassword"
        @click="changePassword"
        class="mobile-only"
        color="secondary"
        label="Done"
        dense
        flat
      />
      <div class="desktop-only" style="width: 28px; height: 28px" />
    </q-card>
    <div class="q-mx-md q-mt-md">
      <q-input
        class="full-width q-mt-sm"
        :type="isPasswordNew ? 'password' : 'text'"
        outlined
        label="New Password"
        v-model="passwordNew"
      >
        <template v-slot:append>
          <q-icon
            :name="isPasswordNew ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPasswordNew = !isPasswordNew"
          />
        </template>
      </q-input>

      <q-input
        class="full-width q-mt-sm"
        :type="isPasswordConfirm ? 'password' : 'text'"
        outlined
        label="Confirm New Password"
        v-model="passwordConfirm"
      >
        <template v-slot:append>
          <q-icon
            :name="isPasswordConfirm ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPasswordConfirm = !isPasswordConfirm"
          />
        </template>
      </q-input>

      <q-btn
        :disable="disableChangePassword"
        @click="changePassword"
        label="Done"
        class="full-width desktop-only q-mt-lg"
        color="primary"
        unelevated
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

export default {
  setup() {
    const q = useQuasar();
    const store = useStore();
    const isPasswordNew = ref(true);
    const isPasswordConfirm = ref(true);
    const passwordNew = ref("");
    const passwordConfirm = ref("");
    const disableChangePassword = computed(() => {
      return passwordNew.value !== passwordConfirm.value ||
        passwordNew.value === "" ||
        passwordConfirm.value === ""
        ? true
        : false;
    });

    async function changePassword() {
      try {
        await store.dispatch("auth/changePassword", passwordNew.value);
        passwordNew.value = "";
        passwordConfirm.value = "";
        q.notify({
          message: "Successfully changed your password.",
        });
      } catch (error) {
        console.log(error.message);
        q.notify({
          message: error.message,
          color: "negative",
        });
      }
    }

    return {
      isPasswordNew,
      isPasswordConfirm,
      passwordNew,
      passwordConfirm,
      disableChangePassword,
      changePassword,
    };
  },
};
</script>

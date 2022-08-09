<template>
  <q-dialog @hide="onDialogHide" ref="dialogRef" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">Please sign in again to perform this action.</div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="password"
          class="full-width q-mt-sm"
          :type="isPassword ? 'password' : 'text'"
          outlined
          label="Password"
        >
          <template v-slot:append>
            <q-icon
              :name="isPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPassword = !isPassword"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="onCancel" />
        <q-btn label="Submit" color="primary" @click="onOk" unelevated />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { ref } from "vue";
import { getAuth, EmailAuthProvider } from "firebase/auth";

export default {
  props: {
    // ...your custom props
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    const q = useQuasar();
    const password = ref("");
    const isPassword = ref(true);

    async function onOk() {
      try {
        const auth = getAuth();
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          password.value
        );
        onDialogOK(credential);
      } catch (error) {
        q.notify({
          message: "Something went wrong. Please try again later.",
          color: "negative",
        });
      }
    }

    return {
      dialogRef,
      password,
      isPassword,
      onDialogHide,
      onOk,
      onCancel: onDialogCancel,
    };
  },
};
</script>

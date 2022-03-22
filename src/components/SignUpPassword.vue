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

      // const auth = getAuth();

      // if (email && password) {
      //   createUserWithEmailAndPassword(auth, email, password)
      //     .then((cred) => {
      //       // console.log('User succssfully created!')
      //       const user = cred.user;
      //       updateProfile(user, {
      //         displayName: name,
      //         photoURL:
      //           "https://firebasestorage.googleapis.com/v0/b/hunyo-109e6.appspot.com/o/profile_pics%2Fdefault.png?alt=media&token=6311df79-fcb6-4245-8e84-c1afb9ed459f",
      //       })
      //         .then(() => {
      //           // console.log('User successfully updated: ', user.displayName, user.photoURL)
      //           if (!user.emailVerified) {
      //             sendEmailVerification(user, {
      //               url: "http://localhost:8080/",
      //             });
      //           }
      //         })
      //         .catch((error) => {
      //           console.log(error.code);
      //         });
      //     })
      //     .catch((error) => {
      //       const errorCode = error.code;
      //       const errorMessage = error.message;
      //       console.log(errorCode, errorMessage);
      //       if (errorCode === "auth/email-already-in-use") {
      //         q.dialog({
      //           message: "Email is already in use. Please try another one.",
      //         });
      //       }
      //       // ..
      //     });
      // } else {
      //   console.log(
      //     "Missing email, password or name. Please fill in all required fields."
      //   );
      // }

      // onAuthStateChanged(auth, (user) => {
      //   if (user) {
      //     router.push("/signup/email-verification");
      //   } else {
      //     console.log("User is Signed Out.");
      //   }
      // });
    }

    return {
      password,
      isPassword,
      signUp,
    };
  },
};
</script>

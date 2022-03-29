<template>
  <div
    class="row"
    :class="q.platform.is.mobile ? 'justify-center' : 'justify-between'"
  >
    <div
      class="flex column items-start col-12 col-sm-6 q-px-md q-mt-xl"
      style="min-height: 79vh"
    >
      <!-- Title mobile sizing -->
      <div class="text-h4 mobile-only text-grey-8 text-weight-bold">
        Welcome to Your Design Community
      </div>

      <!-- Title desktop sizing -->
      <div class="text-h3 desktop-only text-grey-8">
        Welcome to Your Design Community
      </div>

      <q-input
        v-model="email"
        class="q-mt-xl full-width"
        outlined
        label="Email"
        type="email"
      />

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

      <q-btn
        class="q-mt-sm"
        :to="{ name: 'LandingPasswordReset' }"
        label="Forgot Password?"
        color="primary"
        flat
        no-caps
        padding="0"
      />

      <q-btn
        @click="signIn"
        class="full-width q-mt-lg"
        size="lg"
        label="Sign In"
        no-caps
        unelevated
        color="primary"
      />
    </div>

    <div class="desktop-only q-px-md q-mt-xl col-5">
      <q-img
        src="https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        :ratio="1"
      />
    </div>

    <div
      class="col-12 flex column items-center q-px-md"
      style="min-height: 80vh"
    >
      <q-avatar size="100px" style="border: none !important" square>
        <img src="hunyo_logo_small.png" />
      </q-avatar>
      <div class="text-h4">About Hunyo</div>
      <div
        class="q-mt-sm text-center"
        :style="{ maxWidth: q.platform.is.mobile ? '100%' : '50%' }"
      >
        Hunyo is a free, closed community of Southeast Asian designers in the
        built environment dedicated to knowledge sharing. Community members post
        about their professional experiences related to details, materials,
        design approaches, and methods. We reject the status quo and instead
        choose to help each other because together, we can create a better
        tomorrow.
      </div>
      <div class="flex justify-around q-mt-md" style="min-width: 340px">
        <q-btn
          class="q-mt-sm"
          :to="{ name: 'LandingJoin' }"
          :style="{ minWidth: q.platform.is.mobile ? '100%' : '45%' }"
          color="primary"
          label="Join Hunyo"
          no-caps
          unelevated
        />
        <q-btn
          :to="{ name: 'LandingPosts' }"
          class="q-mt-sm"
          :style="{ minWidth: q.platform.is.mobile ? '100%' : '45%' }"
          color="primary"
          label="See Posts"
          no-caps
          outline
        />
      </div>
    </div>
    <q-card
      class="col-12 flex justify-center items-center bg-grey-1"
      flat
      bordered
    >
      <q-btn icon="fab fa-facebook" flat size="lg" dense />
      <q-btn icon="fab fa-instagram" flat size="lg" dense />
      <q-btn icon="fab fa-twitter" flat size="lg" dense />
    </q-card>
    <q-card class="col-12 flex column items-center bg-grey-1" flat>
      <q-card-section class="items-start" horizontal>
        <q-card-section class="flex column">
          <q-btn label="Community Guidelines" flat dense />
          <q-btn label="Terms of Use" flat dense />
          <q-btn label="Privacy Policy" flat dense />
        </q-card-section>
        <q-card-section class="flex column justify-start">
          <q-btn
            label="Level 10-1 One Global Place 5th Ave., BGC, Metro Manila, PH"
            style="max-width: 250px"
            no-caps
            flat
            dense
          />
          <q-btn label="hello@hunyo.com" no-caps flat dense />
        </q-card-section>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2">
          &copy; 2022 Hunyo, Inc. All Rights Reserved
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    const isPassword = ref(true);
    const q = useQuasar();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const email = ref("");
    const password = ref("");

    async function signIn() {
      if (email.value && password.value) {
        try {
          await store.dispatch("auth/signIn", {
            email: email.value,
            password: password.value,
          });
          if (route.query.next) {
            router.push(route.query.next);
          } else {
            router.push({ name: "PageHome" });
          }
        } catch (error) {
          q.dialog({
            message: error.message,
          });
        }
      }
    }

    return {
      isPassword,
      q,
      email,
      password,
      signIn,
    };
  },
};
</script>

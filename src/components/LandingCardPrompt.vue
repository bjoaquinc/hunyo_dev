<template>
  <q-card
    class="bg-white"
    :style="
      (q.platform.is.desktop || q.platform.is.ipad) &&
      $route.name === 'LandingPost'
        ? { maxWidth: '70vw', minWidth: '600px' }
        : null
    "
    :bordered="$route.name === 'LandingUser' ? true : false"
    flat
  >
    <q-card-section
      v-if="$route.name === 'LandingPost'"
      class="full-width"
      :class="q.platform.is.desktop || q.platform.is.ipad ? 'q-mx-auto' : ''"
      style="width: fit-content"
    >
      <!-- <div class="flex full-width justify-between items-center">
        <q-btn flat icon="fas fa-times" v-close-popup />
      </div> -->
    </q-card-section>

    <q-card-section class="flex column justify-center items-center">
      <q-avatar style="border: none !important" square>
        <img src="hunyo_logo_small.png" />
      </q-avatar>
      <div class="text-h6">Welcome to Hunyo</div>
      <div
        v-if="$route.name === 'LandingPost'"
        class="text-subtitle1 text-center"
      >
        {{
          q.platform.is.mobile && !q.platform.is.ipad
            ? "Free, unlimited access to design tips"
            : "Free, unlimited access to design tips, ideas and more"
        }}
      </div>
      <div class="text-subtitle1" v-if="$route.name === 'LandingUser'">
        Unlock this profile
      </div>
    </q-card-section>

    <q-card-actions class="flex column justify-center">
      <q-btn
        :to="{ name: 'LandingJoin' }"
        label="Join the Waitlist Now"
        color="primary"
        class="full-width q-mx-auto"
        style="max-width: 80%"
        no-caps
        unelevated
      />
      <q-btn
        :to="{ name: 'PageLanding' }"
        label="Already a member? Log in"
        color="primary"
        class="full-width q-mx-auto"
        style="max-width: 80%"
        flat
        no-caps
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";

export default {
  setup() {
    const q = useQuasar();

    return {
      q,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px

.filler
  width: 24px
  height: 24px
</style>

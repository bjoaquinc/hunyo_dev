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
      <div class="text-h6">Email</div>
      <q-btn class="mobile-only" color="secondary" label="Submit" dense flat />
      <div class="desktop-only" style="width: 28px; height: 28px" />
    </q-card>
    <div class="q-mx-md q-mt-md">
      <q-input
        v-model="email"
        class="q-mt-sm"
        outlined
        label="Email"
        type="email"
        :rules="[(val) => (val && val.length > 0) || 'This field is required.']"
      />
      <q-btn
        label="Submit"
        class="full-width desktop-only q-mt-sm"
        color="primary"
        :disable="email && email === 'fatima.arkin@gmail.com'"
        unelevated
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const email = ref("fatima.arkin@gmail.com");

    return {
      email,
    };
  },
};
</script>

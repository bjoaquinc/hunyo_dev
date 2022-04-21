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
      <q-btn class="lt-sm" color="secondary" label="Submit" dense flat />
      <div class="gt-xs" style="width: 28px; height: 28px" />
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
        class="full-width gt-xs q-mt-sm"
        color="primary"
        :disable="!isEdited"
        unelevated
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const user = computed(() => store.getters["auth/getUser"]);
    const email = ref("");
    onMounted(() => {
      email.value = user.value.email;
    });
    const isEdited = computed(() => {
      return email.value !== user.value.email ? true : false;
    });

    return {
      email,
      isEdited,
    };
  },
};
</script>

<template>
  <div v-if="supplier">
    <div class="flex justify-around items-center">
      <q-img v-if="supplier" :src="supplier.logo" style="max-width: 180px" />
      <q-img src="logo.png" style="max-width: 180px" />
    </div>
    <div class="q-pt-lg">
      <div v-if="supplier" class="text-subtitle1">
        Register to review {{ supplier.name }} on Hunyo, a completely free,
        members-only Filipino database of locally available materials,
        interiors, details, and more. By designers, for designers. View database
        <q-btn
          padding="0"
          size="16px"
          class="text-weight-bolder"
          dense
          flat
          color="positive"
          no-caps
          style="line-height: 0 !important"
          to="/landing/posts"
          target="_blank"
          @click="logEvent('signup - open posts tab', null)"
          >here.</q-btn
        >
        Supplier section coming soon.
      </div>
      <div class="text-h4 q-mt-md text-weight-bold">Register now for free.</div>
    </div>
    <q-select
      @blur="logEvent('signup - profession', { profession: profession.value })"
      class="q-mt-md"
      outlined
      label="What kind of a designer are you?"
      v-model="profession"
      :options="options"
      :rules="[
        (val) =>
          (val && Object.keys(val).length > 0) || 'This field is required.',
      ]"
    />
    <q-input
      @blur="logEvent('signup - name', { name })"
      class="q-mt-xs"
      outlined
      label="Full Name (Real name required)"
      v-model="name"
      :rules="[(val) => (val && val.length > 0) || 'This field is required.']"
    />
    <q-input
      @blur="logEvent('signup - email', { email })"
      class="q-mt-xs"
      outlined
      label="Email"
      v-model="email"
      type="email"
      :rules="[(val) => (val && val.length > 0) || 'This field is required.']"
    />
    <div class="full-width flex justify-center">
      <q-btn
        :disable="name && email && profession ? false : true"
        class="q-mt-sm full-width"
        label="Join"
        color="primary"
        @click="join"
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
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import amplitude from "amplitude-js";

export default {
  props: ["supplierId", "designerId"],
  setup(props) {
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
    const profession = computed({
      get: () => store.getters["auth/getNewUser"].profession,
      set: (value) => store.commit("auth/setProfession", value),
    });
    const options = [
      { label: "I am a licensed architect", value: "architect" },
      { label: "I am a licensed interior designer", value: "interiorDesigner" },
      { label: "I work at a design studio", value: "studioEmployee" },
    ];
    const supplier = computed(() => store.getters["auth/getSupplier"]);

    onMounted(async () => {
      logEvent("signup - start", null);
      if (props.supplierId && props.designerId) {
        await store.dispatch("auth/setSupplier", props.supplierId);
        await store.dispatch("auth/setDesigner", props.designerId);
      }
      if (props.designerId) {
        console.log(props.designerId);
      }
    });

    function logEvent(event, eventProperties) {
      try {
        amplitude
          .getInstance()
          .logEventWithTimestamp(event, eventProperties, null, () => {
            console.log(`Successfully logged ${event} event`);
          });
      } catch (error) {
        console.log(error);
      }
    }

    function join() {
      try {
        logEvent("signup - join", {
          name: name.value,
          email: email.value,
          profession: profession.value.value,
        });
        router.push("/signup/new-password");
      } catch (error) {
        console.log(error);
      }
    }

    return {
      name,
      email,
      profession,
      options,
      join,
      logEvent,
      supplier,
    };
  },
};
</script>

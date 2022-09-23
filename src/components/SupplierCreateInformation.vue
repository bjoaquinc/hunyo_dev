<template>
  <div>
    <div class="full-width q-mt-lg q-mb-md flex justify-center">
      <q-avatar size="100px" style="border: none !important">
        <img src="hunyo_logo_small.png" />
      </q-avatar>
    </div>
    <div class="full-width flex justify-center">
      <div class="text-h4 q-mt-md">Create Supplier!</div>
    </div>
    <div class="q-mt-md text-subtitle1">
      When creating a supplier make sure to include all of the necessary fields
      and create at least 6 posts in the process.
    </div>
    <div class="text-h4 q-mt-md text-weight-bold">Register below.</div>
    <q-input
      autofocus
      class="q-mt-md"
      outlined
      label="Name of Supplier"
      v-model="name"
      :rules="[(val) => (val && val.length > 0) || 'This field is required.']"
    />
    <q-input
      class="q-mt-xs"
      outlined
      type="textarea"
      autogrow
      label="Description"
      v-model="description"
      :rules="[(val) => (val && val.length > 0) || 'This field is required.']"
    />
    <q-input
      class="q-mt-xs"
      outlined
      label="Website"
      v-model="website"
      :rules="[(val) => (val && val.length > 0) || 'This field is required.']"
    />
    <div class="text-h6 q-mt-sm">Emails</div>
    <q-list>
      <q-item v-for="(email, index) in emails" :key="index" class="q-pa-none">
        <q-item-section>{{ email }}</q-item-section>
        <q-item-section avatar>
          <q-btn
            @click="removeEmail(index)"
            icon="fas fa-times"
            color="negative"
            flat
            dense
          />
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn
      v-if="!showEmailInput"
      class="q-my-sm"
      @click="showEmailInput = true"
      flat
      icon="fas fa-plus"
      label="Email"
      color="primary"
      dense
    />
    <q-input
      @keyup.enter="addEmail"
      v-if="showEmailInput"
      autofocus
      @blur="showEmailInput = false"
      class="q-mt-xs"
      type="email"
      outlined
      label="Email"
      v-model="email"
    >
      <template v-slot:append>
        <q-btn
          :disable="!email"
          @click="addEmail"
          label="add"
          color="positive"
          unelevated
          size="small"
        />
      </template>
    </q-input>
    <div class="text-h6 q-mt-sm">Product Categories</div>
    <q-list>
      <q-item
        v-for="(category, index) in categories"
        :key="index"
        class="q-pa-none"
      >
        <q-item-section>{{ category }}</q-item-section>
        <q-item-section avatar>
          <q-btn
            @click="removeCategory(index)"
            icon="fas fa-times"
            color="negative"
            flat
            dense
          />
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn
      v-if="!showCategoryInput"
      class="q-my-sm"
      @click="showCategoryInput = true"
      flat
      icon="fas fa-plus"
      label="Category"
      color="primary"
      dense
    />
    <q-input
      @keyup.enter="addCategory"
      v-if="showCategoryInput"
      autofocus
      @blur="showCategoryInput = false"
      class="q-mt-xs"
      outlined
      label="Category"
      v-model="category"
    >
      <template v-slot:append>
        <q-btn
          :disable="!category"
          @click="addCategory"
          label="add"
          color="positive"
          unelevated
          size="small"
        />
      </template>
    </q-input>
    <div class="full-width flex justify-center">
      <q-btn
        :disable="
          name && description && website && categories && categories.length
            ? false
            : true
        "
        class="q-mt-sm full-width"
        label="Add Logo and Contact"
        color="primary"
        :to="{ name: 'SupplierCreateLogo' }"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import amplitude from "amplitude-js";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const name = computed({
      get: () => store.getters["suppliers/getName"],
      set: (value) => store.commit("suppliers/setName", value),
    });
    const description = computed({
      get: () => store.getters["suppliers/getDescription"],
      set: (value) => store.commit("suppliers/setDescription", value),
    });
    const website = computed({
      get: () => store.getters["suppliers/getWebsite"],
      set: (value) => store.commit("suppliers/setWebsite", value),
    });
    const showEmailInput = ref(false);
    const email = ref("");
    const emails = computed(() => store.getters["suppliers/getEmails"]);
    const showCategoryInput = ref(false);
    const category = ref("");
    const categories = computed(() => store.getters["suppliers/getCategories"]);

    function addCategory() {
      if (!category.value) return;
      store.commit("suppliers/addCategory", category.value);
      showCategoryInput.value = false;
      category.value = "";
      return;
    }

    function removeCategory(index) {
      store.commit("suppliers/removeCategory", index);
      return;
    }

    function addEmail() {
      console.log("triggered", email.value);
      if (!email.value) return;
      store.commit("suppliers/addEmail", email.value);
      showEmailInput.value = false;
      email.value = "";
    }

    function removeEmail(index) {
      store.commit("suppliers/removeEmail", index);
      return;
    }

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

    return {
      name,
      description,
      website,
      logEvent,
      showEmailInput,
      email,
      addEmail,
      removeEmail,
      emails,
      showCategoryInput,
      category,
      addCategory,
      removeCategory,
      categories,
    };
  },
};
</script>

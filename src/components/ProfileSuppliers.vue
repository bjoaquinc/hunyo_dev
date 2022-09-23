<template>
  <div class="row constrain">
    <div
      v-if="this.$q.platform.is.desktop || this.$q.platform.is.ipad"
      class="flex items-center q-mb-md q-mt-lg gt-xs full-width"
    >
      <q-btn
        :to="{ name: 'PageHome' }"
        color="primary"
        icon="fas fa-arrow-left"
        label="Back to Home"
        no-caps
        dense
        flat
      />

      <div class="text-h5 q-mx-auto">Suppliers</div>

      <div style="width: 104px; height: 24px" />
    </div>
    <q-list class="full-width">
      <q-item
        class="full-width border-bottom"
        v-for="({ name, logo, id }, index) in suppliers"
        :key="index"
        :href="`http://localhost:8080/#/products/catalogues/${id}`"
        clickable
        v-ripple
      >
        <q-item-section top thumbnail>
          <img style="width: 80px; height: 80px" class="q-ml-md" :src="logo" />
        </q-item-section>
        <q-item-section class="q-mx-sm">
          <q-item-label class="text-subtitle1">{{ name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const suppliers = computed(() => store.getters["suppliers/getSuppliers"]);

    onMounted(async () => {
      await store.dispatch("suppliers/setSuppliers");
    });

    return {
      suppliers,
    };
  },
};
</script>

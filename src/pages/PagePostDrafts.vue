<template>
  <div class="row constrain">
    <div class="col-12 col-sm-7 q-mx-auto">
      <div
        v-if="this.$q.platform.is.desktop || this.$q.platform.is.ipad"
        class="flex items-center q-mb-md q-mt-lg gt-xs"
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

        <div class="text-h5 q-mx-auto">Drafts</div>

        <div style="width: 104px; height: 24px" />
      </div>
      <q-list bordered>
        <DraftsList />
      </q-list>
    </div>
  </div>
</template>

<script>
import DraftsList from "src/components/DraftsList.vue";
export default {
  components: {
    DraftsList,
  },
  setup() {},
};
</script>

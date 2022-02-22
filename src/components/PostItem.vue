<template>
  <q-card class="my-card" flat bordered>
    <q-card-section>
      <div class="row">
        <q-item-label
          class="text-weight-bold q-mt-sm q-mb-sm col"
          :class="$q.platform.is.mobile ? 'text-subtitle1' : 'text-h6'"
          >{{ title }}</q-item-label
        >
        <q-btn
          class="col-1 q-mb-auto q-mt-xs"
          @click="openPostActionsDialog"
          color="primary"
          icon="fas fa-ellipsis-h"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
          dense
          flat
        />
      </div>
    </q-card-section>

    <BaseCarousel
      :imagesList="imagesList"
      v-if="imagesList && imagesList.length > 0"
    />

    <q-item class="q-pt-none">
      <q-item-section avatar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-weight-bold" caption
          >Joaquin Coromina •
          <span>
            <q-btn
              align="center"
              color="inherit"
              label="5 recommendations"
              size="inherit"
              no-caps
              dense
              flat
            /> </span
        ></q-item-label>
      </q-item-section>
    </q-item>
    <q-card-actions>
      <q-btn
        color="primary"
        unelevated
        icon="fas fa-folder"
        label="Save for Later"
      />
      <q-space />
      <q-btn
        align="right"
        color="primary"
        flat
        label="Read now"
        icon-right="fas fa-chevron-right"
        :to="{ name: 'PagePost', params: { postId: id } }"
      />
    </q-card-actions>

    <DialogPostActions />
  </q-card>
</template>

<script>
import BaseCarousel from "src/components/BaseCarousel.vue";
import DialogPostActions from "src/components/DialogPostActions.vue";

export default {
  name: "PostItem",
  components: {
    BaseCarousel,
    DialogPostActions,
  },
  props: ["imagesList", "date", "id", "title"],
  data() {
    return {
      tagsList: ["details", "design-approaches", "residential", "makati"],
    };
  },
  methods: {
    openPostActionsDialog() {
      this.$q.dialog({
        component: DialogPostActions,
      });
    },
  },
  mounted() {
    console.log(this.title);
  },
};
</script>

<style lang="sass" scoped>
.q-card

  margin-top: 8px

.q-card__actions
  .q-btn
    width: 50%


.q-card__section
  padding: 8px 16px

.q-item__section
  padding-right: 0 !important
</style>

<template>
  <q-card class="my-card" bordered flat>
    <q-item>
      <q-item-label class="text-weight-bold text-h6 q-my-md desktop-only">{{
        title
      }}</q-item-label>
      <q-item-label class="text-weight-bold text-subtitle1 mobile-only">{{
        title
      }}</q-item-label>
    </q-item>

    <BaseCarousel
      :imagesList="imagesList"
      v-if="imagesList && imagesList.length"
    />

    <q-card-section>
      {{ content }}
    </q-card-section>

    <q-item>
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

    <q-separator />

    <q-card-actions align="around">
      <q-btn
        color="primary"
        icon="fas fa-check"
        label="Recommend"
        size="md"
        flat
        style="width: 45%"
      />
      <q-btn
        color="primary"
        icon="fas fa-folder"
        label="Save"
        size="md"
        unelevated
        style="width: 45%"
      />
    </q-card-actions>

    <q-separator />

    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-btn
          @click="openDialogCommentNew"
          align="left"
          color="grey-3"
          label="Add a comment..."
          text-color="grey-7"
          no-caps
          rounded
          unelevated
        />
      </q-item-section>
    </q-item>

    <DialogCommentNew />
  </q-card>
</template>

<script>
import BaseCarousel from "src/components/BaseCarousel.vue";
import DialogCommentNew from "src/components/DialogCommentNew.vue";

export default {
  name: "PostItem",
  components: {
    BaseCarousel,
    DialogCommentNew,
  },
  props: ["content", "title", "imagesList"],
  data() {
    return {
      tagsList: ["details", "design-approaches", "residential", "makati"],
    };
  },
  methods: {
    openDialogCommentNew() {
      this.$q.dialog({
        component: DialogCommentNew,
      });
    },
  },
};
</script>

<style lang="sass" scoped>

.my-card
  max-width: 100vw

.q-card__section
  padding: 8px 16px

.q-item__section
  padding-right: 0 !important

.q-expansion-item__container
  color: $primary

.caption
  margin: 0
</style>

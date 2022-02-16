<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :maximized="q.platform.is.mobile"
  >
    <q-card class="bg-white">
      <q-card-actions>
        <q-btn
          v-close-popup
          icon="fas fa-times"
          class="q-pa-none"
          dense
          flat
          round
        />
      </q-card-actions>
      <q-card-section class="q-mb-md">
        <div class="text-h5 text-center">
          First, Agree to our Community Guidelines.
        </div>
        <div class="text-subtitle2 text-center">
          Please help make Hunyo a safe and inspiring community for designers in
          the built environment by reading and agreeing to our Community
          Guidelines before posting.
        </div>
      </q-card-section>
      <q-card-section class="bg-white q-pt-none">
        <div class="text-h5 q-mb-md text-weight-bolder">I agree to:</div>
        <div class="text-h6">Share knowledge, not self-promote</div>
        <div class="text-caption q-mb-sm text-grey-7">
          We want to help you gain more exposure. The best way to be a thought
          leader is to share genuinely useful posts on Hunyo rather than just
          pushing people to vote for your project, sign up for your boot camp,
          join your webinar, etc. Marketing and sales are better done on social
          media.
        </div>
        <div class="text-h6">Be respectful</div>
        <div class="text-caption q-mb-sm text-grey-7">
          Don’t insult or put others down. The “best” approach to design varies
          depending on each designer’s unique situation.
        </div>
        <div class="text-h6">Be transparent</div>
        <div class="text-caption q-mb-sm text-grey-7">
          Be honest about your professional experience. If you’re posting about
          other people’s work or sharing content on Hunyo that you did as part
          of a team, make sure that you’re allowed to publicly share it on
          Hunyo. And always give credit where credit is due.
        </div>
        <div class="text-h6">Check my facts</div>
        <div class="text-caption q-mb-sm text-grey-7">
          Ensure information is accurate and factual
        </div>
        <div class="text-h6">Only post about official Hunyo topics</div>
        <div class="text-caption q-mb-sm text-grey-7">
          Hunyo is not a place to discuss politics, finance, etc. We are a
          learning platform.
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn
          label="I agree"
          color="primary"
          unelevated
          class="full-width q-mt-sm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";

export default {
  props: {
    // ...your custom props
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const q = useQuasar();

    return {
      dialogRef,
      onDialogHide,
      q,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
    :full-width="q.platform.is.mobile"
    transition-show="slide-up"
    transition-hide="slide-down"
    :position="q.platform.is.mobile ? 'bottom' : 'standard'"
  >
    <q-card
      class="bg-white"
      style="max-height: 100%; min-height: 200px"
      :style="
        q.platform.is.desktop ? { width: '600px', maxWidth: '70vw' } : null
      "
    >
      <q-card-section
        class="full-width"
        :class="q.platform.is.desktop ? 'q-mx-auto' : ''"
        style="width: fit-content"
      >
        <div class="flex full-width justify-between items-center">
          <q-btn flat icon="fas fa-times" v-close-popup />
          <div class="text-h6">Flag</div>
          <div style="width: 53px; height: 36px" />
        </div>
      </q-card-section>

      <q-separator />
      <q-card-section style="height: inherit">
        <div class="text-subtitle2">
          If you feel this post or comment is violating Hunyo’s Community
          Guidelines, please message us at
          <span class="text-primary text-weight-bold">hello@hunyo.com</span
          ><br />
          <br />
          In your message include: i) the name of the person who wrote the
          offending comment or post ii) the title of the post and iii) briefly
          explain the problem with the post or comment you are reporting.<br />
          <br />
          Thank you for helping us keep Hunyo a safe and inspiring community for
          designers in the built environment!
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { ref } from "vue";

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
    const recommendMessage = ref("");

    return {
      dialogRef,
      onDialogHide,
      q,
      recommendMessage,
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

.is-selected
  border: 3px solid $accent
</style>

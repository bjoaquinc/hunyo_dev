<template>
  <q-dialog
    v-if="$route.name === 'LandingPost'"
    @hide="onDialogHide"
    ref="dialogRef"
    :full-width="q.platform.is.mobile && !q.platform.is.ipad"
    transition-show="slide-up"
    transition-hide="slide-down"
    :position="
      q.platform.is.mobile && !q.platform.is.ipad ? 'bottom' : 'standard'
    "
    persistent
  >
    <LandingCardPrompt />
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import LandingCardPrompt from "src/components/LandingCardPrompt.vue";

export default {
  props: {
    // ...your custom props
  },
  components: {
    LandingCardPrompt,
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

.filler
  width: 24px
  height: 24px
</style>

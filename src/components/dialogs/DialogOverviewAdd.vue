<template>
  <q-dialog
    persistent
    @hide="onDialogHide"
    ref="dialogRef"
    :full-width="q.platform.is.mobile && !q.platform.is.ipad"
    transition-show="slide-up"
    transition-hide="slide-down"
    :position="
      q.platform.is.mobile && !q.platform.is.ipad ? 'bottom' : 'standard'
    "
  >
    <q-card
      class="bg-white row"
      style="max-height: 100%; min-height: 200px"
      :style="
        q.platform.is.desktop || q.platform.is.ipad
          ? { width: '600px', maxWidth: '70vw' }
          : null
      "
    >
      <q-card-section
        class="full-width col-12"
        :class="q.platform.is.desktop || q.platform.is.ipad ? 'q-mx-auto' : ''"
        style="width: fit-content"
      >
        <div class="flex full-width justify-between items-center">
          <q-btn flat icon="fas fa-times" v-close-popup />
          <div class="text-h6">Add Overview</div>
          <div style="width: 53px; height: 36px" />
        </div>
      </q-card-section>

      <q-separator />
      <q-card-section class="full-width col-12" style="height: inherit">
        <div
          v-if="overviewKeys && overviewKeys.length"
          class="row col-12 q-mt-sm"
        >
          <div
            class="row col-12 q-mt-sm"
            v-for="(key, index) in overviewKeys"
            :key="index"
          >
            <div class="q-mx-none q-my-auto q-ml-auto col-3">{{ key }}</div>
            <div class="q-my-auto text-h5 q-mx-auto">:</div>
            <q-input
              class="q-mx-none q-my-auto q-ml-auto col-8"
              outline
              clearable
              type="textarea"
              autogrow
              label="Value"
              v-model="newOverview[key]"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="full-width q-mr-sm col-12">
        <q-btn
          class="q-ml-auto"
          label="Done"
          @click="onOkClick"
          color="positive"
        />
        <q-btn label="Cancel" @click="onCancelClick" color="secondary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { ref } from "vue";

export default {
  props: ["overviewKeys", "overview"],
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    const q = useQuasar();
    const newOverview = ref({ ...props.overview });

    return {
      dialogRef,
      onDialogHide,
      q,
      onOkClick() {
        for (let key of Object.keys(newOverview.value)) {
          if (!newOverview.value[key]) {
            delete newOverview.value[key];
          }
        }
        onDialogOK({ overview: newOverview.value });
      },
      onCancelClick: onDialogCancel,
      newOverview,
    };
  },
};
</script>

<style lang="sass" scoped>

.filler
  width: 24px
  height: 24px
</style>

<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
    :full-width="q.platform.is.mobile && !q.platform.is.ipad"
    transition-show="slide-up"
    transition-hide="slide-down"
    :position="
      q.platform.is.mobile && !q.platform.is.ipad ? 'bottom' : 'standard'
    "
  >
    <q-card class="bg-white">
      <q-card-actions class="full-width q-mt-md q-mb-sm q-px-md" align="around">
        <q-btn
          v-close-popup
          class="button-width"
          padding="16px 5px"
          text-color="secondary"
          color="grey-3"
          icon="fas fa-flag"
          label="Flag"
          unelevated
          stack
        />
        <q-btn
          v-close-popup
          @click="openDialogProductEdit"
          class="button-width"
          padding="16px 5px"
          text-color="secondary"
          color="grey-3"
          icon="fas fa-pencil-ruler"
          label="Edit"
          unelevated
          stack
        />
        <!-- <q-btn
          v-if="isYours"
          v-close-popup
          class="button-width"
          padding="16px 5px"
          text-color="secondary"
          color="grey-3"
          icon="fas fa-times"
          label="Remove"
          unelevated
          stack
        /> -->
      </q-card-actions>
      <q-card-actions class="full-width q-mb-md q-px-md">
        <q-btn
          @click="onDialogHide"
          class="full-width"
          text-color="secondary"
          color="grey-3"
          label="cancel"
          unelevated
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useDialogPluginComponent, useQuasar } from "quasar";
import DialogProductEdit from "src/components/dialogs/DialogProductEdit.vue";

export default {
  props: ["postData"],
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const store = useStore();
    const q = useQuasar();
    const user = computed(() => store.getters["auth/getUser"]);
    const userData = computed(() => store.getters["profile/getUserData"]);

    const openDialogProductEdit = () => {
      q.dialog({
        component: DialogProductEdit,
      });
    };

    return {
      dialogRef,
      onDialogHide,
      q,
      userData,
      openDialogProductEdit,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

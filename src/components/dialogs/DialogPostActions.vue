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
          v-if="!isYours"
          v-close-popup
          @click="openDialogFlag"
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
          v-if="isYours || (userData && userData.admin)"
          @click="openDialogPostEdit"
          v-close-popup
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
import DialogPostEdit from "src/components/dialogs/DialogPostEdit.vue";
import DialogFlag from "src/components/dialogs/DialogFlag.vue";

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
    const isYours = computed(() => {
      return user.value.uid === props.postData.user.id ? true : false;
    });

    function openDialogPostEdit() {
      q.dialog({
        component: DialogPostEdit,
        componentProps: {
          postData: props.postData,
        },
      });
    }

    function openDialogFlag() {
      q.dialog({
        component: DialogFlag,
      });
    }

    return {
      dialogRef,
      onDialogHide,
      q,
      openDialogPostEdit,
      openDialogFlag,
      isYours,
      userData,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px
</style>

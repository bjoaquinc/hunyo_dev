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
    <q-card
      class="bg-white flex column"
      style="max-height: 100%; min-height: 200px"
      :style="
        q.platform.is.desktop || q.platform.is.ipad
          ? { width: '600px', maxWidth: '70vw' }
          : null
      "
    >
      <q-card-section
        class="full-width"
        :class="q.platform.is.desktop || q.platform.is.ipad ? 'q-mx-auto' : ''"
        style="width: fit-content"
      >
        <div class="flex full-width justify-between items-center">
          <q-btn flat icon="fas fa-times" v-close-popup />
          <div class="text-h6">Add Files</div>
          <div style="width: 53px; height: 36px" />
        </div>
      </q-card-section>

      <q-separator />
      <q-card-section style="height: inherit">
        <div v-if="newFiles && newFiles.length" class="row col-12 q-mt-sm">
          <div
            class="row col-12 q-mt-sm"
            v-for="(downloadable, index) in newFiles"
            :key="index"
          >
            <q-input
              outlined
              class="q-mx-none col-3"
              label="Name"
              v-model="downloadable.name"
            />
            <div class="q-my-auto text-h5 q-mx-auto">:</div>
            <div class="q-mx-none q-my-auto q-ml-auto col-7">
              <div class="text-subtitle1">
                {{
                  `${downloadable.file.name} | ${Math.floor(
                    downloadable.file.size / 1000
                  )} KB`
                }}
              </div>
            </div>
            <q-btn
              @click="removeFile(index)"
              icon="fas fa-times"
              color="negative"
              dense
              class="col-1"
              flat
              size="sm"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="q-ml-auto q-mr-sm">
        <q-btn label="Done" @click="onOkClick" color="positive" />
        <q-btn label="Cancel" @click="onCancelClick" color="secondary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { ref, onMounted } from "vue";

export default {
  props: ["files"],
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    const q = useQuasar();
    const newFiles = ref([]);

    onMounted(() => {
      for (let file of props.files) {
        newFiles.value.push({
          name: file.name,
          file: file,
          size: file.size,
          type: file.type,
        });
      }
    });

    function removeFile(index) {
      newFiles.value.splice(index, 1);
    }

    return {
      dialogRef,
      onDialogHide,
      q,
      onOkClick() {
        onDialogOK({ files: newFiles.value });
      },
      onCancelClick: onDialogCancel,
      newFiles,
      removeFile,
    };
  },
};
</script>

<style lang="sass" scoped>

.filler
  width: 24px
  height: 24px
</style>

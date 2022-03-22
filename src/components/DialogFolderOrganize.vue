<template>
  <q-dialog
    @hide="onDialogHide"
    persistent
    ref="dialogRef"
    :full-width="q.platform.is.mobile"
    transition-show="slide-up"
    transition-hide="slide-down"
    :position="q.platform.is.mobile ? 'bottom' : 'standard'"
  >
    <q-card
      class="bg-white"
      style="max-height: 100%"
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
          <div style="width: 53px; height: 36px" />
          <div class="text-h6">
            {{
              selectedPostsList.length > 0
                ? `${selectedPostsList.length} Selected`
                : "Click Posts to Organize"
            }}
          </div>
          <q-btn flat icon="fas fa-times" v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section
        class="justify-around items-center q-mt-sm full-width q-gutter-none q-gutter-sm-md"
        style="
          flex-wrap: wrap !important;
          max-height: 400px;
          overflow-y: scroll;
        "
        horizontal
      >
        <FolderPostItem
          v-for="{ postData, id } in unorganizedPosts"
          :key="id"
          :id="id"
          :postData="postData"
          style="width: 45%"
          @click="updateSelectedPost(id)"
          class="q-mt-md q-mt-sm-none"
          :class="selectedPostsList.includes(id) ? 'is-selected' : ''"
        />
      </q-card-section>
      <q-card-actions>
        <q-btn
          v-close-popup
          @click="openDialogFoldersList"
          class="full-width"
          color="primary"
          label="Next"
          :disable="selectedPostsList.length > 0 ? false : true"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useStore } from "vuex";
import { computed } from "vue";
import FolderPostItem from "src/components/FolderPostItem.vue";
import DialogFoldersList from "src/components/DialogFoldersList";

export default {
  props: {
    // ...your custom props
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  components: {
    FolderPostItem,
    // eslint-disable-next-line vue/no-unused-components
  },
  setup() {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const q = useQuasar();
    const store = useStore();
    const unorganizedPosts = computed(
      () => store.getters["folder/getUnorganizedPosts"]
    );
    const selectedPostsList = computed(
      () => store.getters["folder/getSelectedPostsList"]
    );

    function updateSelectedPost(id) {
      store.commit("folder/updateSelectedPostsList", id);
    }

    function openDialogFoldersList() {
      q.dialog({
        component: DialogFoldersList,
        componentProps: {
          organize: true,
        },
      });
    }

    console.log(unorganizedPosts.value);

    return {
      dialogRef,
      onDialogHide,
      q,
      unorganizedPosts,
      updateSelectedPost,
      selectedPostsList,
      openDialogFoldersList,
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

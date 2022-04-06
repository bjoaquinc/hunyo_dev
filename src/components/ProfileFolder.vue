<template>
  <q-card
    class="bg-white container items-start"
    :class="q.platform.is.mobile ? 'q-pa-none' : ''"
    flat
    bordered
  >
    <q-card-section class="desktop-only">
      <q-btn
        color="primary"
        icon="fas fa-arrow-left"
        label="Back to Profile"
        :to="{ name: 'PageProfile' }"
        dense
        flat
      />
    </q-card-section>
    <!-- FoldersList and FolderItem Desktop -->
    <q-card-section class="flex justify-start q-mb-sm desktop-only">
      <q-item
        :to="{
          name: 'FolderDetail',
          params: { folderId: id },
        }"
        class="q-px-sm q-py-sm item-width"
        clickable
        v-ripple
        v-for="{ name, id } in foldersList"
        :key="id"
        style="max-width: 130px"
      >
        <q-item-section class="q-pr-none" avatar>
          <q-avatar
            style="border: none !important"
            class="q-mx-auto"
            text-color="primary"
            size="100px"
            icon="fas fa-folder"
          />
          <q-item-label class="q-mx-auto q-mt-sm" caption>{{
            name
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
    <!-- FoldersList and FolderItem Mobile -->
    <q-list bordered separator class="full-width mobile-only">
      <q-item
        :to="{
          name: 'FolderDetail',
          params: { folderId: id, folderName: name },
        }"
        v-for="{ name, id } in foldersList"
        :key="id"
        clickable
        class="full-width"
        v-ripple
      >
        <q-item-section avatar>
          <q-icon size="lg" color="primary" name="fas fa-folder" />
        </q-item-section>
        <q-item-section class="text-subtitle1">{{ name }}</q-item-section>
      </q-item>
    </q-list>

    <q-separator />
    <q-card-section class="justify-between q-mt-lg q-pa-md" horizontal>
      <div class="text-h6">Unorganized Posts</div>
      <q-btn
        :disable="unorganizedPosts.length ? false : true"
        @click="openDialogFolderOrganize"
        label="Organize"
        outline
        unelevated
        color="primary"
      />
    </q-card-section>
    <q-card-section
      class="justify-between items-center q-mt-sm q-pa-md q-gutter-md"
      style="flex-wrap: wrap !important"
      horizontal
      v-if="unorganizedPosts.length"
    >
      <FolderPostItem
        style="max-width: 45%"
        v-for="{ postData, id } in unorganizedPosts"
        :key="id"
        :id="id"
        :postData="postData"
        :route="{ name: 'ProfilePost', params: { postId: postData.id } }"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { useStore } from "vuex";
import { onBeforeRouteLeave } from "vue-router";
import { useQuasar } from "quasar";
import { computed, onMounted } from "vue";
import FolderPostItem from "src/components/FolderPostItem.vue";
import DialogFolderOrganize from "src/components/DialogFolderOrganize.vue";

export default {
  components: {
    FolderPostItem,
  },
  setup() {
    const store = useStore();
    const q = useQuasar();
    const foldersList = computed(() => store.getters["folder/getFolders"]);
    const unorganizedPosts = computed(
      () => store.getters["folder/getUnorganizedPosts"]
    );
    const unsubscribeFolders = computed(
      () => store.getters["folder/getUnsubscribeFolders"]
    );
    const unsubscribeUnorganizedPosts = computed(
      () => store.getters["folder/getUnsubscribeUnorganizedPosts"]
    );

    onMounted(async () => {
      try {
        await store.dispatch("folder/setFolders");
        await store.dispatch("folder/setUnorganizedPosts");
      } catch (error) {
        console.log(error);
      }
    });

    function openDialogFolderOrganize() {
      q.dialog({
        component: DialogFolderOrganize,
      });
    }

    onBeforeRouteLeave(() => {
      if (unsubscribeFolders.value) {
        unsubscribeFolders.value();
      }
      if (unsubscribeUnorganizedPosts.value) {
        unsubscribeUnorganizedPosts.value();
      }
    });

    return {
      q,
      openDialogFolderOrganize,
      foldersList,
      unorganizedPosts,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-avatar
  height: auto

.item-width
  min-width: 33%
  display: flex
  justify-content: center
</style>

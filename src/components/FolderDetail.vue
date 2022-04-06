<template>
  <q-card class="q-pa-md bg-white container items-start" flat bordered>
    <q-card-section class="desktop-only q-px-none">
      <q-btn
        color="primary"
        icon="fas fa-arrow-left"
        label="Back to Saved Posts"
        :to="{ name: 'ProfileFolder' }"
        dense
        flat
      />
    </q-card-section>

    <q-separator />
    <q-card-section v-if="folder && !remove" class="q-mt-lg" horizontal>
      <div class="text-h6">{{ folder.name }}</div>
      <q-btn
        v-if="!remove"
        @click="openDialogFolderEdit"
        class="q-ml-auto"
        label="Edit"
        outline
        unelevated
        color="primary"
      />
    </q-card-section>
    <q-card-section v-else-if="remove" class="q-mt-lg" horizontal>
      <div class="text-h6">Select Posts</div>
      <div class="q-ml-auto">
        <q-btn
          @click="removePosts"
          class="q-mr-sm"
          label="Remove"
          outline
          unelevated
          color="negative"
          :disable="removeList.length ? false : true"
        />
        <q-btn
          @click="cancelRemove"
          label="Cancel"
          outline
          unelevated
          color="primary"
        />
      </div>
    </q-card-section>
    <q-card-section
      class="justify-between items-center q-mt-sm q-gutter-md"
      style="flex-wrap: wrap !important"
      horizontal
      v-if="posts.length"
    >
      <FolderPostItem
        @click="remove ? updateRemoveList(id) : null"
        style="max-width: 45%"
        v-for="{ postData, id } in posts"
        :key="id"
        :id="id"
        :postData="postData"
        :route="
          remove
            ? null
            : { name: 'ProfilePost', params: { postId: postData.id } }
        "
        :class="removeList.includes(id) ? 'is-selected' : ''"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { useStore } from "vuex";
import { onBeforeRouteLeave } from "vue-router";
import { useQuasar } from "quasar";
import { computed, onMounted, ref } from "vue";
import FolderPostItem from "src/components/FolderPostItem.vue";
import DialogFolderCreateAndEdit from "src/components/DialogFolderCreateAndEdit.vue";
import DialogFolderEdit from "src/components/DialogFolderEdit.vue";

export default {
  components: {
    FolderPostItem,
  },
  props: ["folderId"],
  setup(props) {
    const store = useStore();
    const q = useQuasar();
    const posts = computed(() => store.getters["folder/getPosts"]);
    const folder = computed(() => store.getters["folder/getFolder"]);
    const unsubscribeFolder = computed(
      () => store.getters["folder/getUnsubscribeFolder"]
    );
    const unsubscribePosts = computed(
      () => store.getters["folder/getUnsubscribePosts"]
    );
    const remove = ref(false);
    const removeList = ref([]);

    console.log(posts.value);

    onMounted(async () => {
      try {
        if (props.folderId) {
          await store.dispatch("folder/setFolder", props.folderId);
        }
        await store.dispatch("folder/setPosts", props.folderId);
      } catch (error) {
        console.log(error);
      }
    });

    function openDialogFolderEdit() {
      q.dialog({
        component: DialogFolderEdit,
        componentProps: {
          folderId: folder.value.id,
        },
      }).onOk(() => {
        remove.value = true;
      });
    }

    function updateRemoveList(id) {
      if (removeList.value.includes(id)) {
        removeList.value.splice(removeList.value.indexOf(id), 1);
      } else {
        removeList.value.push(id);
      }
    }

    function cancelRemove() {
      remove.value = false;
      removeList.value = [];
    }

    async function removePosts() {
      try {
        await store.dispatch("folder/removePosts", removeList.value);
        cancelRemove();
      } catch (error) {
        console.log(error);
      }
    }

    onBeforeRouteLeave(() => {
      if (unsubscribeFolder.value) {
        unsubscribeFolder.value();
        console.log("Successfully unsubscribed folder");
      }
      if (unsubscribePosts.value) {
        unsubscribePosts.value();
        console.log("Successfully unsubscribed posts");
      }
    });

    return {
      posts,
      folder,
      openDialogFolderEdit,
      remove,
      removeList,
      updateRemoveList,
      cancelRemove,
      removePosts,
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

.is-selected
  border: 3px solid $negative
</style>

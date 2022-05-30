<template>
  <q-list bordered class="bg-white" id="comments">
    <q-item v-for="{ id, title, imagesList } in drafts" :key="id">
      <DraftItem :postId="id" :title="title" :imagesList="imagesList" />
    </q-item>
  </q-list>
</template>

<script>
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import DraftItem from "src/components/DraftItem.vue";

export default {
  components: { DraftItem },
  setup() {
    const store = useStore();
    const q = useQuasar();
    const drafts = computed(() => store.getters["newPost/getDrafts"]);
    const unsubscribeDrafts = computed(
      () => store.getters["newPost/getUnsubscribeDrafts"]
    );

    onMounted(async () => {
      try {
        q.loading.show();
        await store.dispatch("newPost/setDrafts");
        q.loading.hide();
      } catch (error) {
        console.log(error);
      }
    });

    onUnmounted(() => {
      if (unsubscribeDrafts.value) {
        unsubscribeDrafts.value();
      }
      store.commit("newPost/clearStateDrafts");
    });

    return {
      drafts,
    };
  },
};
</script>

<style lang="sass" scoped>
.q-item
  padding: 0
</style>

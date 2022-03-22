<template>
  <div>
    <div class="flex items-center q-mb-md desktop-only">
      <q-btn
        :to="{ name: 'PageProfile' }"
        color="primary"
        icon="fas fa-arrow-left"
        label="Back to Profile"
        dense
        flat
      />
    </div>
    <q-list class="bg-grey-1">
      <q-item v-if="feedItem">
        <RecommendItem :feedItem="feedItem" />
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import RecommendItem from "src/components/RecommendItem.vue";

export default {
  components: {
    RecommendItem,
  },
  props: ["recommendId"],
  setup(props) {
    const store = useStore();
    const feedItem = computed(() => store.getters["profile/getRecommendItem"]);

    async function setRecommendItem(recommendId) {
      try {
        console.log("setRecommendItem: ", recommendId);
        await store.dispatch("profile/setRecommendItem", recommendId);
      } catch (error) {
        console.log(error);
      }
    }

    console.log(props.recommendId);

    onMounted(async () => {
      console.log("Mounted functions triggered");
      await setRecommendItem(props.recommendId);
    });

    return {
      feedItem,
    };
  },
};
</script>

<style lang="sass" scoped>
.q-item
  flex-wrap: wrap
  display: inherit
  position: inherit
  padding: 2px 0 0 0
</style>

<template>
  <q-toolbar class="constrain mobile-only bg-white">
    <q-btn
      color="secondary"
      icon="fas fa-chevron-left"
      class="same-width"
      align="left"
      :to="{ name: 'PagePostNewTitle' }"
      size="sm"
      dense
      flat
    />

    <q-toolbar-title class="text-center">Create Post</q-toolbar-title>

    <q-btn
      :disable="missingFields"
      color="primary"
      :to="{ name: 'PagePostNewContent' }"
      label="Post"
      class="same-width"
      align="right"
      size="md"
      dense
      flat
    />
  </q-toolbar>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const title = computed(() => store.getters["posts/getTitle"]);
    const topicsList = computed(() => store.getters["posts/getTopicsList"]);
    const content = computed(() => store.getters["posts/getContent"]);
    const missingFields = computed(() => {
      return !topicsList.value.length || !title.value || !content.value
        ? true
        : false;
    });

    return {
      missingFields,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-toolbar__title
  color: $secondary

.filler
  width: 24px
  height: 24px
  padding: 4px

.same-width
  width: 50px
</style>

<template>
  <q-toolbar class="constrain mobile-only bg-white">
    <q-btn
      color="secondary"
      icon="fas fa-times"
      class="same-width"
      align="left"
      :to="
        previousRouteName ? { name: previousRouteName } : { name: 'PageHome' }
      "
      size="sm"
      dense
      flat
    />

    <q-toolbar-title class="text-center">Create Post</q-toolbar-title>

    <q-btn
      color="primary"
      :to="{ name: 'PagePostNewContent' }"
      :disable="missingFields"
      label="Next"
      class="same-width"
      align="right"
      size="md"
      dense
      flat
    />
    <DialogCommunityGuidelines />
  </q-toolbar>
</template>

<script>
import DialogCommunityGuidelines from "src/components/DialogCommunityGuidelines.vue";

export default {
  components: { DialogCommunityGuidelines },
  computed: {
    title() {
      return this.$store.getters["newPost/getTitle"];
    },
    topicsList() {
      return this.$store.getters["newPost/getTopicsList"];
    },
    missingFields() {
      return !this.topicsList.length || !this.title ? true : false;
    },
    previousRouteName() {
      return this.$store.getters["newPost/getPreviousRouteName"];
    },
  },
  async created() {},
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

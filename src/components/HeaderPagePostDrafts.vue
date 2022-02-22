<template>
  <q-toolbar class="constrain mobile-only text-black bg-white">
    <div class="filler" />
    <q-toolbar-title class="text-center">Drafts</q-toolbar-title>
    <q-btn
      :to="{ name: previousRouteName ? previousRouteName : 'PageHome' }"
      size="sm"
      icon="fas fa-times"
      dense
      flat
      round
    />
  </q-toolbar>
</template>

<script>
export default {
  data() {
    return {
      previousRouteName: "PageHome",
    };
  },
  methods: {
    setRouteName(previousRouteName) {
      this.previousRouteName = previousRouteName;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.setRouteName(from.name));
  },
};
</script>

<style lang="sass" scoped>

.filler
  width: 24px
  height: 24px
</style>

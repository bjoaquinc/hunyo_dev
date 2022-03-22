<template>
  <q-toolbar class="constrain mobile-only text-black bg-white">
    <div class="filler" />
    <q-toolbar-title class="text-center">Drafts</q-toolbar-title>
    <q-btn
      :to="{ name: 'PageHome' }"
      size="sm"
      icon="fas fa-times"
      dense
      flat
      round
    />
  </q-toolbar>
</template>

<style lang="sass" scoped>

.filler
  width: 24px
  height: 24px
</style>

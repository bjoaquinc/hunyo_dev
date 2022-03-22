<template>
  <q-toolbar class="constrain mobile-only bg-white">
    <q-btn
      color="secondary"
      icon="fas fa-chevron-left"
      class="same-width"
      align="left"
      :to="{ name: 'ProfileFolder' }"
      dense
      flat
    />

    <q-toolbar-title class="text-center">Folder</q-toolbar-title>

    <div style="width: 24px; height: 24px" />
  </q-toolbar>
</template>

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

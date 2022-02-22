<template>
  <q-toolbar class="constrain mobile-only bg-white">
    <q-btn
      color="secondary"
      icon="fas fa-chevron-left"
      class="same-width"
      align="left"
      :to="{ name: 'PageProfile' }"
      dense
      flat
    />

    <q-toolbar-title class="text-center">Edit Profile</q-toolbar-title>

    <q-btn
      color="primary"
      label="done"
      class="same-width"
      align="right"
      dense
      flat
    />
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

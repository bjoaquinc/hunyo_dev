<template>
  <div>
    <div class="full-width flex column mobile-only">
      <router-view />
    </div>
    <q-card
      bordered
      class="my-card absolute-center desktop-only"
      style="max-width: 600px; min-width: 400px; min-height: 400px"
    >
      <router-view />
    </q-card>
  </div>
</template>

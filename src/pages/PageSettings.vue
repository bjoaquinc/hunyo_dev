<template>
  <div>
    <div class="full-width flex column lt-sm">
      <router-view />
    </div>
    <q-card
      bordered
      class="my-card absolute-center gt-xs"
      style="max-width: 600px; min-width: 400px; min-height: 400px"
    >
      <router-view />
    </q-card>
  </div>
</template>

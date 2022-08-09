<template>
  <div>
    <div
      class="full-width flex column lt-sm"
      v-if="$q.platform.is.mobile && !$q.platform.is.ipad"
    >
      <router-view />
    </div>
    <q-card
      v-else
      bordered
      class="my-card absolute-center gt-xs"
      style="max-width: 600px; min-width: 400px; min-height: 400px"
    >
      <router-view />
    </q-card>
  </div>
</template>

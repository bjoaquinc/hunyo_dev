<template>
  <q-item clickable v-ripple>
    <q-item-section avatar top right>
      <q-icon color="positive" name="far fa-smile" size="md" />
    </q-item-section>

    <q-item-section avatar>
      <q-avatar class="q-mb-sm">
        <img :src="notification.avatar" />
      </q-avatar>
      <q-item-label
        ><span class="text-weight-bold">{{ notification.user }}</span>
        read your
        <span class="text-weight-bold">recommendation</span>.</q-item-label
      >
      <q-item-label caption>{{ notification.content }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: ["notification"],
};
</script>

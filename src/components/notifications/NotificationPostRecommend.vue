<template>
  <q-item clickable v-ripple :to="route">
    <q-item-section avatar top right>
      <q-icon color="positive" name="fas fa-check" size="md" />
    </q-item-section>

    <q-item-section avatar>
      <q-avatar class="q-mb-sm">
        <img :src="user.photo" />
      </q-avatar>
      <q-item-label
        ><span class="text-weight-bold">{{ user.name }}</span>
        recommended your
        <span class="text-weight-bold">post</span>.</q-item-label
      >
      <q-item-label v-if="content" caption>{{ content }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: ["content", "route", "user"],
};
</script>

<template>
  <q-item clickable v-ripple :to="route">
    <q-item-section avatar top right>
      <q-icon color="primary" name="fas fa-plus" size="md" />
    </q-item-section>

    <q-item-section avatar>
      <q-avatar class="q-mb-sm">
        <img :src="user.photo" />
      </q-avatar>
      <q-item-label
        ><span class="text-weight-bold">{{ user.name }}</span> created a new
        post.</q-item-label
      >
      <q-item-label caption>{{ content }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: ["content", "user", "route"],
};
</script>

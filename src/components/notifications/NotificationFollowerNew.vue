<template>
  <q-item clickable v-ripple :to="route">
    <q-item-section avatar top right>
      <q-avatar class="q-mb-sm">
        <img :src="user.photo" />
      </q-avatar>
    </q-item-section>

    <q-item-section avatar>
      <q-item-label
        ><span class="text-weight-bold">{{ user.name }}</span> subscribed to
        you.</q-item-label
      >
    </q-item-section>

    <q-separator />
  </q-item>
</template>

<script>
export default {
  props: ["user", "route"],
};
</script>

<template>
  <q-item clickable v-ripple :to="route">
    <q-item-section avatar top right>
      <q-icon color="accent" name="fas fa-user" size="md" />
    </q-item-section>

    <q-item-section avatar>
      <q-avatar class="q-mb-sm">
        <img :src="user.photo" />
      </q-avatar>
      <q-item-label
        ><span class="text-weight-bold">{{ user.name }}</span> followed
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

<template>
  <q-page>
    <NotificationsList />
  </q-page>
</template>

<script>
import NotificationsList from "src/components/NotificationsList.vue";

export default {
  name: "PageActivity",
  components: {
    NotificationsList,
  },
  created() {},
};
</script>

<template>
  <q-page>
    <router-view />
  </q-page>
</template>

<script>
export default {
  computed: {
    isAuth() {
      return this.$store.getters["auth/getIsAuth"];
    },
  },
  watch: {
    isAuth(newValue) {
      console.log(newValue);
      if (newValue === true) {
        this.$router.push("/");
      }
    },
  },
};
</script>

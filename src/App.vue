<template>
  <router-view />
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style lang="sass">

body
  width: 100%
  overflow-x: hidden
  background: $grey-1

.q-tab__content
  min-width: 10px !important
</style>

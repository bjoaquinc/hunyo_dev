<template>
  <q-page class="flex flex-center">
    <h5>Search Page</h5>
  </q-page>
</template>

<script>

export default{
  name: 'PageSearch',
  created() {
    this.$emit('change-header')
  }
}
</script>

<template>
  <q-list class="bg-grey-1">
    <q-item>
      <PostItem />
    </q-item>
    <q-item>
      <PostItem />
    </q-item>
    <q-item>
      <PostItem />
    </q-item>
  </q-list>
</template>

<script>
import PostItem from 'src/components/PostItem.vue'

export default {
  name: 'PostsList',
  components: {
    PostItem
  }
}
</script>

<style lang="sass" scoped>
.q-item
  flex-wrap: wrap
  display: inherit
  position: inherit
  padding: 2px 0 0 0

</style>  

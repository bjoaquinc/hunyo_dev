<template>
  <q-list bordered class="bg-white">
    <q-item>
      <CommentItem />
    </q-item>
    <q-item>
      <CommentItem />
    </q-item>
    <q-item>
      <CommentItem />
    </q-item>
  </q-list>
</template>

<script>
import CommentItem from 'src/components/CommentItem.vue'

export default {
  components: {CommentItem}
}
</script>

<style lang="sass" scoped>

.q-item
  padding: 0

</style>
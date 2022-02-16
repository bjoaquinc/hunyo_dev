<template>
  <q-page>
    <ActivityList />
  </q-page>
</template>

<script>
import ActivityList from 'src/components/ActivityList.vue'

export default{
  name: 'PageActivity',
  components: {
    ActivityList
  }
}
</script>

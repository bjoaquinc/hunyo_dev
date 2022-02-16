<template>
  <q-list class="bg-white">
    <ActivityItem
      v-for="notification, index in notifications"
      :key="index"
      :notification="notification"
    />
  </q-list>
</template>

<script>
import ActivityItem from 'src/components/ActivityItem.vue'

export default {
  name: 'ActivityList',
  components: {
    ActivityItem
  },
  data() {
    return {
      notifications: [
        {
          type: 'recommendation',
          content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem consequatur pariatur totam sequi officia consectetur nulla. Minima, error. Iure ea id recusandae sequi a non? Voluptatum cupiditate ipsum qui exercitationem.',
          user: 'Joaquin Coromina',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
        },
        {
          type: 'helpful-comment',
          content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem consequatur pariatur totam sequi officia consectetur nulla. Minima, error. Iure ea id recusandae sequi a non? Voluptatum cupiditate ipsum qui exercitationem.',
          user: 'Jimmy James',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
        },
        {
          type: 'helpful-recommendation',
          content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem consequatur pariatur totam sequi officia consectetur nulla. Minima, error. Iure ea id recusandae sequi a non? Voluptatum cupiditate ipsum qui exercitationem.',
          user: 'Joaquin Coromina',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
        },
        {
          type: 'flag',
          content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem consequatur pariatur totam sequi officia consectetur nulla. Minima, error. Iure ea id recusandae sequi a non? Voluptatum cupiditate ipsum qui exercitationem.',
          target: {
            type: 'comment'
          },
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
        },
        {
          type: 'follow',
          user: 'Joaquin Coromina',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
        },
      ]
    }  
  }
}
</script>

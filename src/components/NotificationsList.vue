<template>
  <q-list class="bg-white">
    <component
      :is="type"
      v-for="{ id, content, route, type, user } in notifications"
      :key="id"
      :route="route"
      :content="content"
      :user="user"
    />
  </q-list>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import NotificationFollowerNew from "src/components/notifications/NotificationFollowerNew.vue";
import NotificationFollowPost from "src/components/notifications/NotificationFollowPost.vue";
import NotificationFollowRecommend from "src/components/notifications/NotificationFollowRecommend.vue";
import NotificationPostComment from "src/components/notifications/NotificationPostComment.vue";
import NotificationPostRead from "src/components/notifications/NotificationPostRead.vue";
import NotificationPostRecommend from "src/components/notifications/NotificationPostRecommend.vue";
import NotificationPostSave from "src/components/notifications/NotificationPostSave.vue";
import NotificationRecommendClicked from "src/components/notifications/NotificationRecommendClicked.vue";

export default {
  components: {
    followerNew: NotificationFollowerNew,
    followPost: NotificationFollowPost,
    followRecommend: NotificationFollowRecommend,
    postComment: NotificationPostComment,
    postRead: NotificationPostRead,
    postRecommend: NotificationPostRecommend,
    //   postSave: NotificationPostSave,
    //   recommendClicked: NotificationRecommendClicked,
  },
  setup() {
    const store = useStore();
    const notifications = computed(
      () => store.getters["notifications/getNotifications"]
    );

    async function setNotifications() {
      try {
        await store.dispatch("notifications/setNotifications");
      } catch (error) {
        console.log(error);
      }
    }

    onMounted(async () => {
      await setNotifications();
    });

    return {
      notifications,
    };
  },
};
</script>

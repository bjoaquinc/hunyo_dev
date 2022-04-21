<template>
  <q-list class="bg-white">
    <component
      style="border: 1px solid rgba(0, 0, 0, 0.12)"
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
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import NotificationFollowerNew from "src/components/notifications/NotificationFollowerNew.vue";
import NotificationFollowPost from "src/components/notifications/NotificationFollowPost.vue";
import NotificationFollowRecommend from "src/components/notifications/NotificationFollowRecommend.vue";
import NotificationPostComment from "src/components/notifications/NotificationPostComment.vue";
import NotificationPostRead from "src/components/notifications/NotificationPostRead.vue";
import NotificationPostRecommend from "src/components/notifications/NotificationPostRecommend.vue";
import NotificationsPostReply from "src/components/notifications/NotificationPostReply.vue";
import NotificationPostSave from "src/components/notifications/NotificationPostSave.vue";

export default {
  components: {
    followerNew: NotificationFollowerNew,
    followPost: NotificationFollowPost,
    followRecommend: NotificationFollowRecommend,
    postComment: NotificationPostComment,
    postRead: NotificationPostRead,
    postRecommend: NotificationPostRecommend,
    postReply: NotificationsPostReply,
    postSave: NotificationPostSave,
    //   recommendClicked: NotificationRecommendClicked,
  },
  setup() {
    const store = useStore();
    const notifications = computed(
      () => store.getters["notifications/getNotifications"]
    );
    const userData = computed(() => store.getters["profile/getUserData"]);

    onMounted(async () => {
      try {
        await store.dispatch("notifications/setNotifications");
        if (userData.value.counter) {
          await store.dispatch("profile/updateUserData", {
            counter: 0,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });

    onUnmounted(() => {
      store.commit("notifications/clearState");
    });

    return {
      notifications,
    };
  },
};
</script>

<template>
  <q-list bordered class="bg-white" id="comments">
    <q-item v-for="{ comment, id, user } in commentsList" :key="id">
      <CommentItem :comment="comment" :user="user" :id="id" :postId="postId" />
    </q-item>
  </q-list>
</template>

<script>
import { computed, onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";
import CommentItem from "src/components/CommentItem.vue";

export default {
  props: ["postId"],
  components: { CommentItem },
  setup(props) {
    const store = useStore();
    const commentsList = computed(
      () => store.getters["comments/getCommentsList"]
    );
    const unsubscribeComments = computed(
      () => store.getters["comments/getUnsubscribeComments"]
    );
    const unsubscribeRepliesList = computed(
      () => store.getters["comments/getUnsubscribeRepliesList"]
    );

    async function setCommentsList(postId) {
      try {
        await store.dispatch("comments/setCommentsList", postId);
      } catch (error) {
        console.log(error);
      }
    }

    onMounted(async () => {
      await setCommentsList(props.postId);
    });

    onBeforeRouteLeave(() => {
      try {
        if (
          unsubscribeRepliesList.value &&
          unsubscribeRepliesList.value.length
        ) {
          unsubscribeRepliesList.value.forEach((unsubscribe) => {
            unsubscribe();
            // console.log("Successfully unsubscribed replies");
          });
        }
        if (unsubscribeComments.value) {
          unsubscribeComments.value();
          // console.log("Successfully unsubscribed comments");
        }
        store.commit("comments/clearState");
      } catch (error) {
        console.log(error);
      }
    });

    return {
      commentsList,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-item
  padding: 0
</style>

<template>
  <q-list class="bg-white q-pl-md">
    <q-item
      v-for="{ reply, id, user, thumbnailList, imagesList } in repliesList"
      :key="id"
    >
      <ReplyItem
        :reply="reply"
        :id="id"
        :user="user"
        :thumbnailList="thumbnailList"
        :imagesList="imagesList"
        :commentId="commentId"
        :postId="postId"
        :postUser="postUser"
      />
    </q-item>
  </q-list>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import ReplyItem from "src/components/ReplyItem.vue";

export default {
  props: ["postId", "postUser", "commentId"],
  components: { ReplyItem },
  setup(props) {
    const store = useStore();
    const replies = computed(() => store.getters["comments/getRepliesList"]);
    const repliesList = computed(() => replies.value[props.commentId]);

    async function setRepliesList(postId, commentId) {
      try {
        await store.dispatch("comments/setRepliesList", { postId, commentId });
      } catch (error) {
        console.log(error);
      }
    }

    setRepliesList(props.postId, props.commentId);

    return {
      repliesList,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-item
  padding: 0
</style>

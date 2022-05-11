<template>
  <q-card class="full-width" flat>
    <q-item
      clickable
      :to="{ name: userRoute, params: { userId: user.id, souce: 'comment' } }"
      style="width: fit-content"
    >
      <q-item-section avatar>
        <q-avatar size="30px">
          <img :src="user.photo" />
        </q-avatar>
      </q-item-section>

      <q-space />

      <q-item-section>
        <q-item-label lines="1" class="comment-user text-grey-6"
          >{{ user.name }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-card-section>
      {{ reply }}
    </q-card-section>
    <q-card-actions>
      <q-btn
        @click="openDialogReplyCreate"
        flat
        no-caps
        size="sm"
        dense
        color="primary"
        icon="fas fa-reply"
        label="Reply"
      />
      <q-btn-dropdown
        flat
        size="sm"
        dense
        color="primary"
        icon="fas fa-ellipsis-h"
        :dropdown-icon="'none'"
        style="max-width: 32px; overflow: hidden; margin-left: 0"
        align="left"
      >
        <q-list>
          <q-item
            clickable
            v-close-popup
            @click="openDialogReplyEdit"
            v-if="isYours"
          >
            <q-item-section>
              <q-item-label>Edit</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            @click="openDialogPromptDelete"
            v-if="isYours"
          >
            <q-item-section>
              <q-item-label>Delete</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="openDialogFlag" v-else>
            <q-item-section>
              <q-item-label>Flag</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <!-- <q-btn
        @click="deleteReply"
        v-if="isYours"
        flat
        size="sm"
        dense
        color="primary"
        icon="fas fa-times"
        label="Remove"
      /> -->
    </q-card-actions>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute } from "vue-router";
import DialogFlag from "src/components/DialogFlag.vue";
import DialogReplyCreate from "src/components/DialogReplyCreate.vue";
import DialogReplyEdit from "src/components/DialogReplyEdit.vue";
import DialogPromptDelete from "src/components/DialogPromptDelete.vue";

export default {
  props: ["reply", "id", "user", "commentId", "postId", "postUser"],
  setup(props) {
    const q = useQuasar();
    const route = useRoute();
    const store = useStore();
    const userRoute = computed(() => {
      const userLocation = route.meta.location;
      if (userLocation && userLocation === "feed") {
        return "FeedUser";
      } else if (userLocation && userLocation === "profile") {
        return "ProfileUser";
      } else {
        return "LandingUser";
      }
    });
    const user = computed(() => store.getters["auth/getUser"]);
    const isYours = computed(() => {
      return props.user.id === user.value.uid ? true : false;
    });

    async function openDialogReplyCreate() {
      q.dialog({
        component: DialogReplyCreate,
        componentProps: {
          commentId: props.commentId,
          postId: props.postId,
          postUser: props.postUser,
          userId: props.user.id,
          replyId: props.id,
          replyMessage: props.reply,
          replyUser: props.user,
        },
      });
    }

    async function openDialogReplyEdit() {
      q.dialog({
        component: DialogReplyEdit,
        componentProps: {
          commentId: props.commentId,
          postId: props.postId,
          userId: props.user.id,
          replyId: props.id,
          reply: props.reply,
        },
      });
    }

    function openDialogFlag() {
      q.dialog({
        component: DialogFlag,
      });
    }

    async function deleteReply() {
      try {
        await store.dispatch("comments/deleteReply", {
          replyId: props.id,
          commentId: props.commentId,
          postId: props.postId,
        });
      } catch (error) {
        console.log(error);
      }
    }

    function openDialogPromptDelete() {
      q.dialog({
        component: DialogPromptDelete,
        componentProps: { isComment: false },
      }).onOk(async () => {
        await deleteReply();
      });
    }

    return {
      openDialogFlag,
      userRoute,
      isYours,
      openDialogPromptDelete,
      openDialogReplyCreate,
      openDialogReplyEdit,
    };
  },
};
</script>

<style lang="sass" scoped>
.q-item__section
  padding-right: 0
  min-width: 37px
.comment-user
  font-size: 13px
  font-weight: bold

.q-card__section
  padding: 0 16px
</style>

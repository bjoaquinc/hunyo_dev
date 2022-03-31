<template>
  <q-card class="full-width" flat>
    <q-item
      clickable
      :to="{ name: userRoute, params: { userId: user.id } }"
      style="width: fit-content"
    >
      <q-item-section avatar>
        <q-avatar size="30px">
          <img :src="user.photo" />
        </q-avatar>
      </q-item-section>

      <q-space />

      <q-item-section>
        <q-item-label lines="1" class="comment-user"
          >{{ user.name }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-card-section>
      {{ reply }}
    </q-card-section>
    <q-card-actions>
      <q-btn
        @click="openDialogFlag"
        flat
        size="sm"
        dense
        color="primary"
        icon="fas fa-flag"
        label="Flag"
      />
      <q-btn
        @click="deleteReply"
        v-if="isYours"
        flat
        size="sm"
        dense
        color="primary"
        icon="fas fa-times"
        label="Remove"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { auth } from "src/boot/firebase";
import DialogFlag from "src/components/DialogFlag.vue";

export default {
  props: ["reply", "id", "user", "commentId", "postId"],
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
    const isYours = computed(() => {
      return props.user.id === auth.currentUser.uid ? true : false;
    });

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

    return {
      openDialogFlag,
      userRoute,
      isYours,
      deleteReply,
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

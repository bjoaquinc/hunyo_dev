<template>
  <div class="flex column full-width">
    <q-card class="full-width" bordered flat>
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
          <q-item-label lines="1" class="comment-user text-grey-6"
            >{{ user.name }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section>
        {{ comment }}
      </q-card-section>
      <q-card-actions>
        <q-btn
          @click="openDialogReplyCreate"
          flat
          size="sm"
          dense
          color="primary"
          icon="fas fa-reply"
          label="Reply"
        />
        <q-btn
          @click="openDialogFlag"
          flat
          size="sm"
          dense
          color="primary"
          icon="fas fa-flag"
          label="Flag"
        />
        <!-- <q-btn
          @click="deleteComment"
          v-if="isYours"
          flat
          size="sm"
          dense
          color="primary"
          icon="fas fa-times"
          label="Remove"
        /> -->
      </q-card-actions>
      <q-card-section class="q-pl-lg">
        <ReplyList :commentId="id" :postId="postId" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { computed } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import DialogReplyCreate from "src/components/DialogReplyCreate.vue";
import DialogFlag from "src/components/DialogFlag.vue";
import ReplyList from "src/components/ReplyList.vue";

export default {
  props: ["comment", "id", "user", "postId"],
  components: { ReplyList },

  setup(props) {
    const q = useQuasar();
    const route = useRoute();
    const store = useStore();
    const user = computed(() => store.getters["auth/getUser"]);
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
      return props.user.id === user.value.uid ? true : false;
    });

    function openDialogReplyCreate() {
      q.dialog({
        component: DialogReplyCreate,
        componentProps: {
          commentId: props.id,
          postId: props.postId,
          userId: props.user.id,
        },
      });
    }

    function openDialogFlag() {
      q.dialog({
        component: DialogFlag,
      });
    }

    async function deleteComment() {
      try {
        await store.dispatch("comments/deleteComment", {
          commentId: props.id,
          postId: props.postId,
        });
      } catch (error) {
        console.log(error);
      }
    }

    return {
      openDialogReplyCreate,
      openDialogFlag,
      userRoute,
      isYours,
      deleteComment,
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

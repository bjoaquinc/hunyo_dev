<template>
  <div class="flex column full-width">
    <q-card class="full-width" bordered flat>
      <q-item clickable :to="{ name: userRoute, params: { userId: user.id } }">
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
        {{ comment }}
      </q-card-section>
      <q-card-actions>
        <!-- <q-btn
          flat
          size="sm"
          dense
          color="primary"
          icon="far fa-smile"
          label="Helpful"
        /> -->
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
    const userRoute = computed(() =>
      route.meta.profile ? "ProfileUser" : "FeedUser"
    );

    function openDialogReplyCreate() {
      q.dialog({
        component: DialogReplyCreate,
        componentProps: {
          commentId: props.id,
          postId: props.postId,
        },
      });
    }

    function openDialogFlag() {
      q.dialog({
        component: DialogFlag,
      });
    }

    return {
      openDialogReplyCreate,
      openDialogFlag,
      userRoute,
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

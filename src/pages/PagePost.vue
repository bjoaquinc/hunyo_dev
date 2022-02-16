<template>
  <q-page class="constrain">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-7 q-ml-sm-sm">
        <div class="flex items-center q-mb-md desktop-only">
          <q-btn
            color="primary"
            icon="fas fa-arrow-left"
            label="Return"
            @click="$router.go(-1)"
            dense
            flat
          />
          <q-btn
            class="q-ml-auto q-mr-sm"
            color="primary"
            icon="fas fa-ellipsis-h"
            @click="openDialogPostActions"
            flat
          />
          <q-btn color="primary" icon="fas fa-folder" label="Save" unelevated />
        </div>
        <PostDetail />
        <CommentsList />
      </div>
      <div class="col desktop-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="48px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">Joaquin Coromina</q-item-label>
            <q-item-label caption> Joaquin Coromina </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-page>
</template>

<script>
import PostDetail from "src/components/PostDetail.vue";
import CommentsList from "src/components/CommentsList.vue";
import DialogPostActions from "src/components/DialogPostActions.vue";

export default {
  name: "PagePost",
  components: {
    PostDetail,
    CommentsList,
  },
  methods: {
    openDialogPostActions() {
      this.$q.dialog({
        component: DialogPostActions,
      });
    },
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    margin-top: 21px
</style>

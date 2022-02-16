<template>
  <q-page class="constrain">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-7 q-ml-sm-sm">
        <PostList />
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
import PostList from "src/components/PostsList.vue";

export default {
  name: "PageHome",
  components: {
    PostList,
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    margin-top: 21px
</style>

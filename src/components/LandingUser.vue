<template>
  <q-page class="constrain">
    <div class="row q-col-gutter-md">
      <div class="main col-12 col-sm-7 q-ml-sm-sm">
        <UserDetail :userId="userId" />
      </div>
      <div class="col desktop-only"></div>
    </div>
  </q-page>
</template>

<script>
import UserDetail from "src/components/UserDetail.vue";

export default {
  components: { UserDetail },
  props: ["userId"],
  setup() {},
};
</script>

<style lang="sass" scoped>
.q-page
  @media (min-width: 690px)
    margin-top: 21px
.main
  @media (min-width: 690px)
    margin-left: 9px
</style>

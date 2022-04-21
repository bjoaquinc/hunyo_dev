<template>
  <q-page class="constrain">
    <div class="row q-col-gutter-md">
      <div class="main col-12 col-sm-7 q-mx-auto q-ml-sm-sm">
        <router-view />
      </div>
    </div>
  </q-page>
</template>

<style lang="sass" scoped>
.q-page
  @media (min-width: 690px)
    margin-top: 21px
</style>

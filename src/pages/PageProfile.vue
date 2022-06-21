<template>
  <q-page :class="$route.name !== 'ProfilePost' ? 'constrain' : ''">
    <div :class="$route.name !== 'ProfilePost' ? 'row q-col-gutter-md' : ''">
      <div
        class="main q-ml-sm-sm"
        :class="
          $route.name !== 'ProfilePost' ? 'col-12 col-sm-7 q-mx-auto' : ''
        "
      >
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

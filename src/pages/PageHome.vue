<template>
  <q-page :class="$route.name !== 'FeedPost' ? 'constrain' : ''">
    <div :class="$route.name !== 'FeedPost' ? 'row q-col-gutter-md' : ''">
      <div
        class="q-ml-sm-sm feed"
        :class="
          $route.name !== 'ProfilePost' ? 'col-12 col-sm-7 q-mx-auto' : ''
        "
      >
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </div>
  </q-page>
</template>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    padding-top: 21px
</style>

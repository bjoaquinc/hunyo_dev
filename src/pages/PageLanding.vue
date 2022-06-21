<template>
  <q-page :class="$route.name !== 'LandingPost' ? 'constrain' : ''">
    <div :class="$route.name === 'LandingPosts' ? 'row q-col-gutter-md' : ''">
      <div
        class="q-ml-sm-sm"
        :class="
          $route.name === 'LandingPosts' ? 'col-12 col-sm-7 q-mx-auto' : ''
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

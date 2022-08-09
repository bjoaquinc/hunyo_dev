<template>
  <q-page :class="$route.name !== 'Product' ? 'constrain' : ''">
    <div :class="$route.name !== 'Product' ? 'row q-col-gutter-md' : ''">
      <div
        class="q-ml-sm-sm feed"
        :class="$route.name !== 'ProductCatalogue' ? 'col-12 q-mx-auto' : ''"
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

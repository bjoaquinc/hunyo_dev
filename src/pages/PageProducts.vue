<template>
  <q-page :class="$route.name !== 'ProductDetail' ? 'constrain' : ''">
    <div :class="$route.name !== 'ProductDetail' ? 'row q-col-gutter-md' : ''">
      <div
        class="q-ml-sm-sm feed"
        :class="
          $route.name !== 'SupplierProductCatalogue' ? 'col-12 q-mx-auto' : ''
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

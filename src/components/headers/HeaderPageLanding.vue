<template>
  <q-toolbar class="constrain">
    <q-img
      @click="$router.push('/landing')"
      class="q-mr-sm logo-hover-pointer"
      height="20px"
      width="130px"
      position="0 0"
      fit="contain"
      src="logo.png"
    />

    <q-space />

    <!-- <q-btn
      label="Join"
      :to="{ name: 'LandingJoin' }"
      no-caps
      color="primary"
      outline
    /> -->
    <q-btn
      label="Sign In"
      :to="{ name: 'PageLanding' }"
      class="q-ml-sm"
      no-caps
      color="primary"
      unelevated
    />
  </q-toolbar>
</template>

<style lang="sass" scoped>
.logo-hover-pointer
  &:hover
    cursor: pointer
</style>

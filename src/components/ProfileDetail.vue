<template>
  <q-card class="q-pa-md bg-white container items-start" flat bordered>
    <div class="flex items-center full-width">
      <q-avatar size="100px">
        <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
      </q-avatar>
      <q-item class="flex column items-center q-mx-auto" clickable v-ripple>
        <div class="flex items-center">
          <q-avatar size="38px">
            <img src="hunyo_logo_small.png" />
          </q-avatar>
          <h4 class="q-my-none q-mr-xs">182</h4>
          <q-btn
            outline
            round
            color="primary"
            size="6px"
            icon="fas fa-question"
          />
        </div>
        <p class="text-weight-bold q-ma-none">Impact Score</p>
      </q-item>
    </div>
    <div class="text-subtitle2 q-mt-sm">Fatima Arkin • Current employment</div>
    <div class="full-width text-caption bio q-mb-xs">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
      accusantium, eveniet doloribus quisquam odit asperiores eius facilis
      perferendis.
    </div>
    <q-btn
      color="secondary"
      class="q-pl-none"
      size="sm"
      icon="fas fa-map-marker-alt"
      label="City, Country"
      dense
      flat
      no-caps
    />
    <q-btn
      color="secondary"
      size="sm"
      icon="fas fa-link"
      label="www.yourwebsite.com"
      dense
      flat
      no-caps
    />
    <q-btn
      class="full-width q-mt-md"
      color="primary"
      label="Edit profile"
      :to="{ name: 'PageProfileEdit' }"
      no-caps
      outline
    />
    <q-btn class="full-width q-mt-sm" color="primary" no-caps unelevated>
      <p class="text-weight-light q-ma-none">
        You have <span class="text-weight-bold">3 invites</span> remaining.
        <span class="text-weight-bold">Invite now >></span>
      </p>
    </q-btn>
    <div class="flex justify-between items-center q-mt-sm">
      <p class="text-weight-bold q-ma-none">Peers</p>
      <q-btn
        color="primary"
        class="q-pa-none"
        label="Find peers >"
        no-caps
        flat
      />
    </div>
    <q-btn
      color="secondary"
      class="q-pl-none q-pt-none"
      size="11px"
      label="13 Following"
      dense
      flat
      no-caps
    />
    <q-btn
      color="secondary"
      class="q-pt-none"
      size="11px"
      label="8 Followers"
      dense
      flat
      no-caps
    />
    <div class="flex justify-around">
      <q-item class="q-pa-none q-mt-sm" clickable v-ripple>
        <q-item-section class="q-pr-none" avatar>
          <q-avatar class="q-mx-auto" size="60px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <q-item-label class="q-mx-auto q-mt-sm" caption
            >Joaquin Coromina</q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item class="q-pa-none q-mt-sm" clickable v-ripple>
        <q-item-section class="q-pr-none" avatar>
          <q-avatar class="q-mx-auto" size="60px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <q-item-label class="q-mx-auto q-mt-sm" caption
            >Joaquin Coromina</q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item class="q-pa-none q-mt-sm" clickable v-ripple>
        <q-item-section class="q-pr-none" avatar>
          <q-avatar class="q-mx-auto" size="60px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <q-item-label class="q-mx-auto q-mt-sm" caption
            >Joaquin Coromina</q-item-label
          >
        </q-item-section>
      </q-item>
    </div>
  </q-card>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
.container
  width: 100%
  height: auto

.bio
  line-height: normal
</style>

<template>
  <q-toolbar class="constrain desktop-only">
    <q-img
      class="q-mr-sm"
      height="20px"
      width="130px"
      position="0 0"
      fit="contain"
      src="logo.png"
    />

    <q-input
      v-model="text"
      class="q-ml-md"
      input-class="text-right"
      dense
      standout="bg-primary text-white"
    >
      <template v-slot:append>
        <q-icon v-if="text === ''" name="search" />
        <q-icon v-else @click="text = ''" class="cursor-pointer" name="clear" />
      </template>
    </q-input>

    <q-space />

    <q-tabs
      class="text-primary"
      active-bg-color="primary"
      active-color="white"
      align="right"
      :breakpoint="100"
    >
      <q-route-tab :to="{ name: 'PageHome' }" icon="fas fa-home" flat />
      <q-route-tab
        @click="openDialogPostCreate()"
        :to="hasDrafts ? null : { name: 'PagePostNewTitle' }"
        icon="fas fa-plus"
        flat
      />
      <q-tab icon="fas fa-bell" flat>
        <q-badge color="red" floating>2</q-badge>
        <q-menu>
          <ActivityList style="max-width: 500px" />
        </q-menu>
      </q-tab>
      <q-route-tab :to="{ name: 'PageProfile' }" icon="fas fa-user" flat />
    </q-tabs>

    <q-btn-dropdown
      class="q-ml-md"
      color="primary"
      icon="fas fa-bars"
      flat
      dense
    >
      <div class="row no-wrap q-pa-md">
        <div class="column">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>
                <div class="text-subtitle1 q-mt-md q-mb-xs">
                  View My Profile
                </div>
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Community Guidelines</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Best Practices</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Settings & Privacy</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="fas fa-cog" />
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Help</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="fas fa-question-circle" />
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-btn-dropdown>
    <DialogPostCreate />
  </q-toolbar>
</template>

<script>
import ActivityList from "src/components/ActivityList.vue";
import DialogPostCreate from "src/components/DialogPostCreate";

export default {
  components: {
    ActivityList,
    DialogPostCreate,
  },
  props: ["pageHeader"],
  data() {
    return {
      text: "",
      drawer: false,
    };
  },
  computed: {
    hasDrafts() {
      return this.$store.getters["newPost/getHasDrafts"];
    },
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    openDialogPostCreate() {
      this.$q.dialog({
        component: DialogPostCreate,
      });
    },
  },
};
</script>

<style lang="sass" scoped>

.q-toolbar__title
  color: black

.active
  background-color: $primary !important
  color: white !important

.q-drawer__content
  .q-list
    color: $primary
</style>

<template>
  <q-toolbar class="constrain desktop-only">
    <q-img
      @click="$router.push({ name: 'PageHome' })"
      class="q-mr-sm"
      height="20px"
      width="130px"
      position="0 0"
      fit="contain"
      src="logo.png"
    />

    <q-space />

    <q-tabs
      class="text-primary"
      active-bg-color="primary"
      active-color="white"
      align="right"
      :breakpoint="100"
      dense
    >
      <q-route-tab :to="{ name: 'PageHome' }" icon="fas fa-home" no-caps flat>
        <div class="text-caption">Home</div>
      </q-route-tab>
      <q-route-tab
        @click="openDialogPostCreate()"
        :to="hasDrafts ? null : { name: 'PagePostNewTitle' }"
        icon="fas fa-plus"
        no-caps
        flat
      >
        <div class="text-caption">Create</div>
      </q-route-tab>
      <q-tab no-caps flat>
        <q-icon name="fas fa-bell" size="sm" class="items-start">
          <q-badge v-if="userData.counter" color="red" floating>{{
            userData.counter
          }}</q-badge>
        </q-icon>
        <div class="text-caption">Notifications</div>
        <q-menu>
          <NotificationsList style="max-width: 500px" />
        </q-menu>
      </q-tab>
      <q-route-tab
        :to="{ name: 'ProfileFolder' }"
        icon="fas fa-folder"
        no-caps
        flat
      >
        <div class="text-caption">Saved</div>
      </q-route-tab>
      <q-route-tab
        :to="{ name: 'PageProfile' }"
        icon="fas fa-user"
        no-caps
        flat
      >
        <div class="text-caption">Profile</div>
      </q-route-tab>
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
            <q-item clickable :to="{ name: 'PageProfile' }" v-close-popup>
              <q-item-section>
                <q-avatar size="72px" v-if="userData">
                  <img :src="userData.photoURL" />
                </q-avatar>
                <div class="text-subtitle1 q-mt-md q-mb-xs">
                  View My Profile
                </div>
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <q-item
              clickable
              @click="openDialogCommunityGuidelines"
              v-close-popup
            >
              <q-item-section>
                <q-item-label>Community Guidelines</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <q-item clickable to="/settings" v-close-popup>
              <q-item-section>
                <q-item-label>Settings & Privacy</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable @click="openDialogHelp" v-close-popup>
              <q-item-section>
                <q-item-label>Help</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />

            <q-item @click="signout" clickable v-close-popup>
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
import NotificationsList from "src/components/NotificationsList.vue";
import DialogPostCreate from "src/components/DialogPostCreate";
import DialogCommunityGuidelines from "src/components/DialogCommunityGuidelines.vue";
import DialogHelp from "src/components/DialogHelp.vue";

export default {
  components: {
    NotificationsList,
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
      return this.$store.getters["getHasDrafts"];
    },
    user() {
      return this.$store.getters["auth/getUser"];
    },
    userData() {
      return this.$store.getters["profile/getUserData"];
    },
    unsubscribeUser() {
      return this.$store.getters["profile/getUnsubscribeUser"];
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
    openDialogCommunityGuidelines() {
      this.$q.dialog({
        component: DialogCommunityGuidelines,
      });
    },
    openDialogHelp() {
      this.$q.dialog({
        component: DialogHelp,
      });
    },
    async signout() {
      try {
        if (this.unsubscribeUser) {
          this.unsubscribeUser();
        }
        await this.$store.dispatch("auth/signout");
        this.$router.push("/landing");
      } catch (error) {
        this.$q.dialog({
          message: error.message,
        });
      }
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

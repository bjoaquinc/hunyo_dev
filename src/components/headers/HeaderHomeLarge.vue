<template>
  <q-toolbar class="constrain gt-xs">
    <q-img
      @click="$router.push({ name: 'PageHome' })"
      class="q-mr-sm logo-hover-pointer"
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
      <q-route-tab :to="{ name: 'PageHome' }" icon="fas fa-users" no-caps flat>
        <div class="text-caption">Community</div>
      </q-route-tab>
      <q-route-tab to="/products" icon="fas fa-dolly-flatbed" no-caps flat>
        <div class="text-caption">Products</div>
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
      <!-- <q-route-tab
        :to="{ name: 'PageProfile' }"
        icon="fas fa-user"
        no-caps
        flat
      >
        <div class="text-caption">Profile</div>
      </q-route-tab> -->
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
              @click="openDialogPostCreate()"
              v-close-popup
              class="flex column"
            >
              <q-item-section>
                <q-item-label>Create Post</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              @click="openDialogCommunityGuidelines"
              v-close-popup
              class="flex column"
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

            <q-item
              clickable
              v-if="userData.admin && userData.admin === true"
              @click="openDialogEditContent"
              v-close-popup
            >
              <q-item-section>
                <q-item-label>Edit Content</q-item-label>
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
  </q-toolbar>
</template>

<script>
import NotificationsList from "src/components/NotificationsList.vue";
import DialogPostCreate from "src/components/dialogs/DialogPostCreate";
import DialogCommunityGuidelines from "src/components/dialogs/DialogCommunityGuidelines.vue";
import DialogHelp from "src/components/dialogs/DialogHelp.vue";
import DialogEditContent from "src/components/admin/DialogEditContent.vue";

export default {
  components: {
    NotificationsList,
  },
  props: ["pageHeader"],
  data() {
    return {
      text: "",
      drawer: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters["auth/getUser"];
    },
    userData() {
      return this.$store.getters["profile/getUserData"];
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
    openDialogEditContent() {
      this.$q.dialog({
        component: DialogEditContent,
      });
    },
    async signout() {
      try {
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

.logo-hover-pointer
  &:hover
    cursor: pointer
</style>

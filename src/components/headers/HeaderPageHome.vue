<template>
  <q-toolbar v-if="!pageHeader" class="constrain lt-sm bg-white">
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

    <q-btn
      @click="toggleDrawer"
      class="q-ml-md"
      color="primary"
      icon="fas fa-bars"
      flat
      dense
    />
    <q-drawer
      class="bg-white"
      side="right"
      v-model="drawer"
      :width="200"
      :breakpoint="500"
      overlay
      bordered
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item :to="{ name: 'PageProfile' }" clickable>
            <q-item-section>
              <q-avatar v-if="user" size="72px">
                <img :src="user.photoURL" />
              </q-avatar>
              <div class="text-subtitle1 q-mt-md q-mb-xs">View My Profile</div>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item @click="openDialogPostCreate" clickable>
            <q-item-section>
              <q-item-label>Create Post</q-item-label>
            </q-item-section>
          </q-item>

          <q-item @click="openDialogCommunityGuidelines" clickable>
            <q-item-section>
              <q-item-label>Community Guidelines</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item clickable to="/settings">
            <q-item-section>
              <q-item-label>Settings & Privacy</q-item-label>
            </q-item-section>
          </q-item>
          <q-item @click="openDialogHelp" clickable>
            <q-item-section>
              <q-item-label>Help</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item @click="signout" clickable>
            <q-item-section>
              <q-item-label>Logout</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </q-toolbar>
</template>

<script>
import DialogPostCreate from "src/components/dialogs/DialogPostCreate.vue";
import DialogCommunityGuidelines from "src/components/dialogs/DialogCommunityGuidelines.vue";
import DialogHelp from "src/components/dialogs/DialogHelp.vue";

export default {
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

.q-field
  @media (max-width: 690px)
    width: 125px

.filler
  width: 24px
  height: 24px
</style>

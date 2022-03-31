<template>
  <q-toolbar class="constrain mobile-only bg-white">
    <q-btn
      @click="$router.go(-1)"
      color="primary"
      icon="fas fa-chevron-left"
      flat
      dense
    />
    <q-btn
      v-if="!isPublic"
      @click="followItem ? toggleIsFollowing() : followUser()"
      color="primary"
      class="q-ml-auto"
      :label="followItem && followItem.isFollowing ? 'Following' : 'Follow'"
      :outline="followItem && followItem.isFollowing ? false : true"
    />
  </q-toolbar>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default {
  setup(props) {
    const store = useStore();
    const userData = computed(() => store.getters["users/getUserData"]);
    const followItem = computed(() => store.getters["users/getFollowItem"]);
    const route = useRoute();
    const isPublic = computed(() =>
      route.name === "LandingUser" ? true : false
    );
    const currentUser = computed(() => store.getters["auth/getUser"]);

    async function followUser() {
      try {
        await store.dispatch("users/followUser", {
          name: userData.value.displayName,
          id: userData.value.id,
          photo: userData.value.photoURL,
        });
        await store.dispatch("notifications/createNotification", {
          type: "followerNew",
          userId: userData.value.id,
          route: {
            name: "ProfileUser",
            params: { userId: currentUser.value.uid },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    async function toggleIsFollowing() {
      try {
        await store.dispatch("users/toggleIsFollowing", {
          followItemId: followItem.value.id,
          isFollowing: followItem.value.isFollowing,
        });
      } catch (error) {
        console.log(error);
      }
    }

    return {
      userData,
      followUser,
      followItem,
      toggleIsFollowing,
      isPublic,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-toolbar__title
  color: black

.filler
  width: 24px
  height: 24px
</style>

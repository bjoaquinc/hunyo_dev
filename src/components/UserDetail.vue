<template>
  <div>
    <div class="flex items-center q-mb-md desktop-only">
      <q-btn
        color="primary"
        icon="fas fa-arrow-left"
        label="Return"
        @click="$router.go(-1)"
        dense
        flat
      />
      <q-btn
        @click="followItem ? toggleIsFollowing() : followUser()"
        color="primary"
        class="q-ml-auto"
        :label="followItem && followItem.isFollowing ? 'Following' : 'Follow'"
        :outline="followItem && followItem.isFollowing ? false : true"
      />
    </div>
    <q-card class="q-pa-md bg-white container items-start" flat bordered>
      <div class="flex items-center full-width">
        <q-avatar size="100px" style="border: 1px solid rgba(0, 0, 0, 0.12)">
          <img :src="userData.photoURL" />
        </q-avatar>
      </div>
      <div class="text-subtitle1 q-mt-sm">
        {{ userData.displayName
        }}<span v-if="userData.work"> • {{ userData.work }}</span>
      </div>
      <div class="full-width bio q-mb-xs" v-if="userData.bio">
        {{ userData.bio }}
      </div>
      <q-btn
        v-if="userData.location"
        color="secondary"
        class="q-pl-none"
        icon="fas fa-map-marker-alt"
        :label="userData.location"
        dense
        flat
        no-caps
      />
      <q-btn
        v-if="userData.website"
        color="secondary"
        icon="fas fa-link"
        :label="userData.website"
        dense
        flat
        no-caps
      />
      <!-- <q-btn class="full-width q-mt-sm" color="primary" no-caps unelevated>
        <p class="text-weight-light q-ma-none">
          You have <span class="text-weight-bold">3 invites</span> remaining.
          <span class="text-weight-bold">Invite now >></span>
        </p>
      </q-btn> -->
    </q-card>
    <q-card class="q-mt-sm" bordered flat>
      <q-card-section class="text-weight-bold">Activity</q-card-section>
    </q-card>

    <FeedList :feedItems="feedItems" />
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { auth } from "src/boot/firebase";
import FeedList from "src/components/FeedList.vue";

export default {
  props: ["userId", "lastRoute"],
  components: {
    FeedList,
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const currentUser = computed(() => store.getters["auth/getUser"]);
    const selectedUserId = computed(() => userData.value.id);
    const userData = computed(() => store.getters["profile/getUserData"]);
    const unsubscribeUser = computed(
      () => store.getters["profile/getUnsubscribeUser"]
    );
    const feedItems = computed(() => store.getters["profile/getActivityFeed"]);
    const followItem = computed(() => store.getters["users/getFollowItem"]);
    const unsubscribeFollowItem = computed(
      () => store.getters["users/getUnsubscribeFollowItem"]
    );

    async function setUserData(userId) {
      try {
        await store.dispatch("profile/setUserData", userId);
      } catch (error) {
        console.log(error);
      }
    }

    async function setActivityFeed(userId) {
      try {
        await store.dispatch("profile/setActivityFeed", userId);
      } catch (error) {
        console.log(error);
      }
    }

    onMounted(async () => {
      if (props.userId === currentUser.value.uid) {
        router.push({ name: "PageProfile" });
      } else {
        await setUserData(props.userId);
        await setActivityFeed(props.userId);
        try {
          await store.dispatch("users/setFollowItem", props.userId);
        } catch (error) {
          console.log(error);
        }
      }
    });

    async function followUser() {
      try {
        await store.dispatch("users/followUser", {
          name: userData.value.displayName,
          id: props.userId,
          photo: userData.value.photoURL,
        });
        await store.dispatch("notifications/createNotification", {
          type: "followerNew",
          userId: userData.value.id,
          route: {
            name: "ProfileUser",
            params: { userId: auth.currentUser.uid },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    async function toggleIsFollowing() {
      try {
        console.log("Toggle is following");
        await store.dispatch("users/toggleIsFollowing", {
          followItemId: followItem.value.id,
          isFollowing: followItem.value.isFollowing,
        });
      } catch (error) {
        console.log(error);
      }
    }

    onBeforeRouteLeave(() => {
      if (unsubscribeUser.value) {
        unsubscribeUser.value();
        console.log("Unsubscribed User");
      }
      if (unsubscribeFollowItem.value) {
        unsubscribeFollowItem.value();
        console.log("Unsubscribed Follow Item");
      }
      store.commit("profile/clearState");
      store.commit("users/clearState");
    });

    return {
      userData,
      feedItems,
      followUser,
      followItem,
      toggleIsFollowing,
    };
  },
};
</script>

<style lang="sass" scoped>
.container
  width: 100%
  height: auto

.bio
  line-height: normal
</style>

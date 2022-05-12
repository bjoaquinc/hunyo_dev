<template>
  <div v-if="userData">
    <div class="flex items-center q-mb-md gt-xs">
      <q-btn
        color="primary"
        icon="fas fa-arrow-left"
        label="Return"
        @click="$router.go(-1)"
        dense
        flat
      />
    </div>
    <q-card class="q-pa-md bg-white container items-start" flat bordered>
      <div class="flex items-center justify-between no-wrap">
        <div class="flex column">
          <q-avatar size="100px">
            <img :src="userData.photoURL" />
          </q-avatar>
          <div class="text-subtitle1 text-weight-bold q-mt-sm">
            {{ userData.displayName
            }}<span v-if="userData.employerName">
              • {{ userData.employerName }}</span
            >
          </div>
        </div>
        <q-btn
          v-if="!isPublic"
          @click="followItem ? toggleIsFollowing() : subscribe()"
          color="primary"
          class="q-ml-auto"
          :label="isFollowing ? 'Subscribed' : 'Subscribe'"
          :flat="isFollowing"
          unelevated
        />
      </div>
      <div class="full-width bio q-mb-xs" v-if="userData.bio">
        {{ userData.bio }}
      </div>
      <div class="flex items-center">
        <q-btn
          v-if="userData.location"
          size="12px"
          color="secondary"
          class="q-pl-none, text-weight-regular"
          icon="fas fa-map-marker-alt"
          :label="userData.location"
          dense
          flat
          no-caps
        />
        <q-btn
          class="text-weight-regular"
          :class="userData.location ? 'q-ml-sm' : ''"
          v-if="website"
          :style="{
            maxWidth:
              q.platform.is.mobile && !q.platform.is.ipad ? '150px' : '250px',
          }"
          size="11px"
          no-wrap
          color="secondary"
          icon="fas fa-link"
          :href="website"
          @click="sendEventClickWebsite"
          target="_blank"
          dense
          flat
          no-caps
        >
          <div
            class="q-ml-sm ellipsis"
            style="max-width: 80vw; font-size: 12px"
          >
            {{ website }}
          </div>
        </q-btn>
      </div>
      <!-- <div class="full-width flex">
        <q-btn
          no-caps
          dense
          size="12px"
          class="text-weight-regular"
          :label="`${userData.followers} ${
            userData.followers > 1 ? 'Subscribers' : 'Subscriber'
          }`"
          flat
          v-if="userData.followers"
          color="secondary"
        />
      </div> -->
      <!-- <q-btn class="full-width q-mt-sm" color="primary" no-caps unelevated>
        <p class="text-weight-light q-ma-none">
          You have <span class="text-weight-bold">3 invites</span> remaining.
          <span class="text-weight-bold">Invite now >></span>
        </p>
      </q-btn> -->
    </q-card>
    <q-card v-if="!isPublic" class="q-mt-sm" bordered flat>
      <q-card-section>
        <div class="text-weight-bold">Activity</div>
      </q-card-section>
    </q-card>

    <FeedList
      v-if="!isPublic"
      :feedItems="feedItems"
      feedLocation="author profile"
    />
    <LandingCardPrompt v-else />
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, onBeforeRouteLeave, useRoute } from "vue-router";
import { auth } from "src/boot/firebase";
import FeedList from "src/components/FeedList.vue";
import LandingCardPrompt from "src/components/LandingCardPrompt.vue";
import { useQuasar } from "quasar";
import amplitude from "amplitude-js";

export default {
  props: ["userId", "lastRoute"],
  components: {
    FeedList,
    LandingCardPrompt,
  },
  setup(props) {
    const q = useQuasar();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const currentUser = computed(() => store.getters["auth/getUser"]);
    const userData = computed(() => store.getters["users/getUserData"]);
    const unsubscribeUser = computed(
      () => store.getters["users/getUnsubscribeUser"]
    );
    const website = computed(() => {
      if (!userData.value.website) return null;
      const websiteSplit = userData.value.website.split(":");
      if (websiteSplit[0] === "http" || websiteSplit[0] === "https") {
        return userData.value.website;
      } else {
        const webURL = "https://" + userData.value.website;
        return webURL;
      }
    });
    const followItem = computed(
      () => store.getters["subscriptions/getFollowItem"]
    );
    const unsubscribeFollowItem = computed(
      () => store.getters["subscriptions/unsubscribeFollowItem"]
    );
    const followingList = computed(
      () => store.getters["subscriptions/getFollowingList"]
    );
    const feedItems = computed(() => store.getters["users/getActivityFeed"]);
    const isFollowing = computed(() => {
      if (followingList.value.includes(userData.value.id)) {
        return true;
      } else {
        return false;
      }
    });
    const isPublic = computed(() =>
      route.name === "LandingUser" ? true : false
    );

    async function setUserData(userId) {
      try {
        await store.dispatch("users/setUserData", userId);
      } catch (error) {
        console.log(error);
      }
    }

    async function setActivityFeed(userId) {
      try {
        await store.dispatch("users/setActivityFeed", userId);
      } catch (error) {
        console.log(error);
      }
    }

    onMounted(async () => {
      if (currentUser.value && props.userId === currentUser.value.uid) {
        router.push({ name: "PageProfile" });
      } else {
        try {
          await setUserData(props.userId);
          await setActivityFeed(props.userId);
          if (!isPublic.value) {
            await store.dispatch("subscriptions/setFollowItem", props.userId);
            // Send enter profile event to Amplitude
            const source = route.params.source;
            amplitude.getInstance().logEventWithTimestamp(
              "profile - enter",
              {
                "member id": props.userId,
                source: source ? source : "other", // types: feed, post, comment, notification, other
                "has bio": userData.value.bio ? true : false,
                "has photo": !userData.value.photoURL.includes("default")
                  ? true
                  : false,
                "has website": userData.value.website ? true : false,
                "has location": userData.value.location ? true : false,
                "is subscribe": followingList.value.includes(props.userId),
              },
              Date.now()
            );
            // console.log("Successfully sent enter profile event");
          }
        } catch (error) {
          console.log(error);
        }
      }
    });

    async function subscribe() {
      try {
        // Send subscribe start event to Amplitude
        amplitude.getInstance().logEventWithTimestamp("subscribe start", {
          "member id": props.userId,
          location: "profile",
        });
        // console.log("Successfully sent subscribe start event");
        await store.dispatch("subscriptions/subscribe", {
          name: userData.value.displayName,
          id: props.userId,
          photo: userData.value.photoURL,
        });
        if (!userData.value.admin) {
          await store.dispatch("notifications/createNotification", {
            type: "followerNew",
            userId: userData.value.id,
            route: {
              name: "ProfileUser",
              params: { userId: currentUser.value.uid, source: "notification" },
            },
          });
        }
        // Send subscribe successful event to Amplitude
        amplitude.getInstance().logEventWithTimestamp("subscribe successful", {
          "member id": props.userId,
          location: "profile",
        });
        // console.log("Successfully sent subscribe successful event");
      } catch (error) {
        console.log(error);
        // Send subscribe error event to Amplitude
        amplitude.getInstance().logEventWithTimestamp("subscribe error", {
          "member id": props.userId,
          error,
        });
        // console.log("Successfully sent subscribe error");
      }
    }

    async function toggleIsFollowing() {
      let toggleType = "";
      try {
        if (followItem.value.isFollowing) {
          amplitude.getInstance().logEventWithTimestamp("unsubscribe", {
            "member id": props.userId,
            location: userData.value.location,
          });
          // console.log("Successfully sent to unsubscribe event");
          toggleType = "unsubscribe";
        } else {
          amplitude.getInstance().logEventWithTimestamp("resubscribe", {
            "member id": props.userId,
            location: userData.value.location,
          });
          // console.log("Successfully sent to resubscribe event");
          toggleType = "resubscribe";
        }
        await store.dispatch("subscriptions/toggleIsFollowing", {
          followItemId: followItem.value.id,
          isFollowing: followItem.value.isFollowing,
        });
      } catch (error) {
        console.log(error);
        amplitude
          .getInstance()
          .logEventWithTimestamp("toggle subscribe error", {
            "member id": props.userId,
            error,
            type: toggleType,
          });
        // console.log("Successfully sent the toggle subscribe error event");
      }
    }

    function sendEventClickWebsite() {
      try {
        amplitude
          .getInstance()
          .logEventWithTimestamp("profile - click website", {
            "member id": props.userId,
            "is subscribe": followingList.value.includes(props.userId),
          });
        // console.log("Successfully sent click website event");
      } catch (error) {
        console.log(error);
      }
    }

    onBeforeRouteLeave(() => {
      if (unsubscribeUser.value) {
        unsubscribeUser.value();
        // console.log("Unsubscribed User");
      }
      if (unsubscribeFollowItem.value) {
        unsubscribeFollowItem.value();
        // console.log("Unsubscribed Follow Item");
      }
      store.commit("users/clearState");
      store.commit("subscriptions/clearState");
    });

    return {
      q,
      currentUser,
      userData,
      website,
      feedItems,
      subscribe,
      toggleIsFollowing,
      sendEventClickWebsite,
      isPublic,
      followItem,
      isFollowing,
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

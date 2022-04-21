<template>
  <div v-if="userData">
    <q-card
      class="q-pa-md bg-white container items-start"
      flat
      bordered
      v-if="userData"
    >
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
        <q-item
          class="flex column items-center q-ml-auto"
          :to="{ name: 'ProfileFolder' }"
          clickable
          v-ripple
        >
          <q-btn
            size="30px"
            dense
            color="primary"
            flat
            class="q-pa-none"
            icon="fas fa-folder"
          />
          <p class="text-weight-bold q-ma-none text-no-wrap">Saved Posts</p>
        </q-item>
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
      <q-btn
        class="full-width q-mt-sm"
        color="primary"
        label="Edit profile"
        :to="{ name: 'ProfileEdit' }"
        no-caps
        outline
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
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import FeedList from "src/components/FeedList.vue";

export default {
  components: {
    FeedList,
  },
  setup() {
    const q = useQuasar();
    const store = useStore();
    const user = computed(() => store.getters["auth/getUser"]);
    const userData = computed(() => store.getters["profile/getUserData"]);
    const feedItems = computed(() => store.getters["profile/getActivityFeed"]);
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

    async function setActivityFeed(userId) {
      try {
        await store.dispatch("profile/setActivityFeed", userId);
      } catch (error) {
        console.log(error);
      }
    }

    onMounted(async () => {
      await setActivityFeed(user.value.uid);
    });

    onUnmounted(() => {
      store.commit("profile/clearStateFeed");
    });

    return {
      userData,
      feedItems,
      website,
      q,
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

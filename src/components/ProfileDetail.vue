<template>
  <div v-if="userData">
    <q-card
      class="q-pa-md bg-white container items-start"
      flat
      bordered
      v-if="userData"
    >
      <div class="flex items-center full-width">
        <q-avatar size="100px">
          <img :src="userData.photoURL" />
        </q-avatar>
        <q-item
          class="flex column items-center q-mx-auto"
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
          <p class="text-weight-bold q-ma-none">Saved Posts</p>
        </q-item>
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
      <q-btn
        class="full-width q-mt-md"
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
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { onBeforeRouteLeave } from "vue-router";
import FeedList from "src/components/FeedList.vue";

export default {
  components: {
    FeedList,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.getters["auth/getUser"]);
    const selectedUserId = computed(() => userData.value.id);
    const userData = computed(() => store.getters["profile/getUserData"]);
    const feedItems = computed(() => store.getters["profile/getActivityFeed"]);

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

    return {
      userData,
      feedItems,
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

<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
    :full-width="q.platform.is.mobile && !q.platform.is.ipad"
    transition-show="slide-up"
    transition-hide="slide-down"
    :position="
      q.platform.is.mobile && !q.platform.is.ipad ? 'bottom' : 'standard'
    "
  >
    <q-card
      class="bg-white"
      :style="
        q.platform.is.desktop || q.platform.is.ipad
          ? { width: '600px', maxWidth: '70vw' }
          : null
      "
    >
      <q-card-actions>
        <q-btn v-close-popup icon="fas fa-times" dense flat round />
      </q-card-actions>
      <q-card-section class="text-h6 text-center text-weight-regular">
        {{
          isFollowing
            ? `Successfully subscribed to ${user.name}`
            : "Never miss a post from this designer"
        }}
      </q-card-section>
      <q-card-actions class="q-mb-md flex column items-center justify-center">
        <q-btn
          v-if="!isFollowing"
          @click="hasFollowItem ? toggleSubscribed() : subscribe()"
          :disable="disableSubscribeButton"
          color="primary"
          style="padding: 8px 15px; min-width: 300px"
          :label="`Subscribe to ${user.name.split(' ')[0]}`"
          unelevated
          size="18px"
          no-caps
        />
        <q-btn
          v-close-popup
          color="primary"
          style="
            padding: 8px 15px;
            min-width: 300px;
            margin-top: 8px;
            margin-left: 0;
          "
          :label="isFollowing ? 'Ok, thanks' : 'Maybe Later'"
          :outline="isFollowing ? false : true"
          size="15px"
          no-caps
          unelevated
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useStore } from "vuex";
import { computed, ref, onMounted, onUnmounted } from "vue";
import amplitude from "amplitude-js";

export default {
  props: ["user", "isUsersPage"],
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
    const q = useQuasar();
    const store = useStore();
    const currentUser = computed(() => store.getters["auth/getUser"]);
    const followItem = computed(
      () => store.getters["subscriptions/getFollowItem"]
    );
    const disableSubscribeButton = ref(false);
    const hasFollowItem = computed(() => (followItem.value ? true : false));
    const unsubscribeFollowItem = computed(
      () => store.getters["subscriptions/getUnsubscribeFollowItem"]
    );
    const isFollowing = computed(() => {
      const followingList = store.getters["subscriptions/getFollowingList"];
      if (followingList && followingList.includes(props.user.id)) {
        return true;
      } else {
        return false;
      }
    });

    onMounted(() => {
      try {
        if (props.isUserPage) return;
        store.dispatch("subscriptions/setFollowItem", props.user.id);
      } catch (error) {
        console.log(error);
      }
    });

    async function subscribe() {
      try {
        // Send subscribe start event to Amplitude
        amplitude.getInstance().logEventWithTimestamp("subscribe start", {
          "member id": props.user.id,
          location: "save popup",
        });
        // Subscribe to user
        disableSubscribeButton.value = true;
        await store.dispatch("subscriptions/subscribe", { ...props.user });
        // Send notification to subscribed user
        if (!userData.value.admin) {
          await store.dispatch("notifications/createNotification", {
            type: "followerNew",
            userId: props.user.id,
            route: {
              name: "ProfileUser",
              params: { userId: currentUser.value.uid, source: "notification" },
            },
          });
        }
        // Send subscribe successful event to Amplitude
        amplitude.getInstance().logEventWithTimestamp("subscribe successful", {
          "member id": props.user.id,
          location: "save popup",
        });
        disableSubscribeButton.value = false;
        setTimeout(() => {
          onDialogOK();
        }, 1000);
      } catch (error) {
        disableSubscribeButton.value = false;
        console.log(error);
        // Send subscribe error event to Amplitude
        amplitude.getInstance().logEventWithTimestamp("subscribe error", {
          "member id": props.user.id,
          error,
        });
        // console.log("Successfully sent subscribe error");
      }
    }

    async function toggleSubscribed() {
      let toggleType = "";
      try {
        if (followItem.value.isFollowing) {
          amplitude.getInstance().logEventWithTimestamp("unsubscribe", {
            "member id": props.user.id,
            location: "pop up",
          });
          // console.log("Successfully sent to unsubscribe event");
          toggleType = "unsubscribe";
        } else {
          amplitude.getInstance().logEventWithTimestamp("resubscribe", {
            "member id": props.user.id,
            location: "pop up",
          });
          // console.log("Successfully sent to resubscribe event");
          toggleType = "resubscribe";
        }
        await store.dispatch("subscriptions/toggleSubscribed", {
          followItemId: followItem.value.id,
          isFollowing: followItem.value.isFollowing,
        });
        setTimeout(() => {
          onDialogOK();
        }, 2000);
      } catch (error) {
        console.log(error);
        amplitude
          .getInstance()
          .logEventWithTimestamp("toggle subscribe error", {
            "member id": props.user.id,
            error,
            type: toggleType,
          });
        // console.log("Successfully sent the toggle subscribe error event");
      }
    }

    onUnmounted(async () => {
      if (unsubscribeFollowItem.value && !props.isUsersPage) {
        unsubscribeFollowItem.value();
        store.commit("subscriptions/clearState");
      }
    });

    return {
      dialogRef,
      onDialogHide,
      q,
      subscribe,
      toggleSubscribed,
      hasFollowItem,
      isFollowing,
      disableSubscribeButton,
    };
  },
};
</script>

<style lang="sass" scoped>

.filler
  width: 24px
  height: 24px
</style>

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
          @click="hasFollowItem ? toggleIsFollowing() : subscribe()"
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
import { computed, onMounted, onUnmounted } from "vue";

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
    const followItem = computed(
      () => store.getters["subscriptions/getFollowItem"]
    );
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
        await store.dispatch("subscriptions/subscribe", { ...props.user });
        setTimeout(() => {
          onDialogOK();
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    }

    async function toggleIsFollowing() {
      try {
        await store.dispatch("subscriptions/toggleIsFollowing", {
          followItemId: followItem.value.id,
          isFollowing: followItem.value.isFollowing,
        });
        setTimeout(() => {
          onDialogOK();
        }, 2000);
      } catch (error) {
        console.log(error);
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
      toggleIsFollowing,
      hasFollowItem,
      isFollowing,
    };
  },
};
</script>

<style lang="sass" scoped>

.filler
  width: 24px
  height: 24px
</style>

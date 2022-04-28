<template>
  <q-dialog
    @hide="onDialogHide"
    persistent
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
      style="max-height: 100%"
      :style="
        q.platform.is.desktop || q.platform.is.ipad
          ? { width: '600px', maxWidth: '70vw' }
          : null
      "
    >
      <q-card-section
        v-if="organize"
        class="full-width"
        :class="q.platform.is.desktop || q.platform.is.ipad ? 'q-mx-auto' : ''"
        style="width: fit-content"
      >
        <div class="flex full-width justify-between items-center">
          <q-btn
            flat
            icon="fas fa-chevron-left"
            @click="openDialogFolderOrganize"
            v-close-popup
          />
          <div class="text-h6">Move to a Folder</div>
          <q-btn flat icon="fas fa-times" v-close-popup />
        </div>
      </q-card-section>

      <q-card-section
        v-else
        class="full-width"
        :class="q.platform.is.desktop || q.platform.is.ipad ? 'q-mx-auto' : ''"
        style="width: fit-content"
      >
        <div class="flex full-width justify-between items-center">
          <q-btn
            flat
            icon="fas fa-times"
            v-close-popup
            @click="clearStatePostData"
          />
          <div class="text-h6">Save to a Folder</div>
          <div style="width: 53px; height: 36px" />
        </div>
      </q-card-section>

      <q-separator />

      <q-list
        bordered
        separator
        class="full-width"
        style="max-height: 80vh; overflow: auto"
      >
        <q-item
          clickable
          v-ripple
          v-if="!organize"
          @click="savePost()"
          v-close-popup
        >
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-star" />
          </q-item-section>
          <q-item-section class="text-subtitle1"
            >Quick Save and Organize Later</q-item-section
          >
        </q-item>
        <q-separator v-if="!organize" />
        <q-item
          v-for="{ name, id } in folders"
          :key="id"
          clickable
          class="full-width"
          v-ripple
          @click="organize ? movePosts({ name, id }) : savePost({ name, id })"
          v-close-popup
        >
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-folder" />
          </q-item-section>
          <q-item-section>{{ name }}</q-item-section>
        </q-item>
        <q-separator />
        <q-item
          clickable
          v-ripple
          @click="openDialogFolderCreateAndEdit"
          v-close-popup
        >
          <q-item-section avatar>
            <q-icon color="primary" name="fas fa-plus" />
          </q-item-section>
          <q-item-section>Create Folder</q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import DialogFolderOrganize from "src/components/DialogFolderOrganize.vue";
import DialogFolderCreateAndEdit from "src/components/DialogFolderCreateAndEdit.vue";
import DialogPromptSubscribe from "src/components/DialogPromptSubscribe.vue";
import amplitude from "amplitude-js";

export default {
  props: ["postData", "organize"],
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const q = useQuasar();
    const store = useStore();
    const folders = computed(() => store.getters["folder/getFolders"]);
    const postData = computed(() => store.getters["folder/getPostData"]);
    const selectedPostsList = computed(
      () => store.getters["folder/getSelectedPostsList"]
    );
    const user = computed(() => store.getters["auth/getUser"]);
    const userData = computed(() => store.getters["profile/getUserData"]);
    const followingList = computed(
      () => store.getters["subscriptions/getFollowingList"]
    );
    const route = useRoute();

    async function setFolders() {
      try {
        await store.dispatch("folder/setFolders");
      } catch (error) {
        console.log(error);
      }
    }

    onMounted(async () => {
      if (props.postData) {
        store.commit("folder/setPostData", props.postData);
      }
      await setFolders();
    });

    function openDialogFolderOrganize() {
      q.dialog({
        component: DialogFolderOrganize,
      });
    }

    function openDialogFolderCreateAndEdit() {
      q.dialog({
        component: DialogFolderCreateAndEdit,
        componentProps: { postData: postData.value },
      });
    }

    async function savePost(folder) {
      let savedLocation = "Profile";
      if (folder) {
        savedLocation = folder.name;
      } else {
        var identify = new amplitude.Identify().add("num total quicksave", 1);
        amplitude.getInstance().identify(identify);
      }
      try {
        await store.dispatch("folder/savePost", {
          postData: postData.value,
          folder,
        });
        if (!userData.value.admin) {
          await store.dispatch("notifications/createNotification", {
            content: postData.value.title,
            type: "postSave",
            userId: postData.value.user.id,
            route: {
              name: "ProfileUser",
              params: { userId: user.value.uid },
            },
          });
        }
        if (
          followingList.value &&
          !followingList.value.includes(postData.value.user.id) &&
          user.value.uid !== postData.value.user.id
        ) {
          let isUsersPage = false;
          if (route.name === "FeedUser" || route.name === "ProfileUser") {
            isUsersPage = true;
          }
          q.dialog({
            component: DialogPromptSubscribe,
            componentProps: {
              user: postData.value.user,
              isUsersPage,
            },
          });
        } else {
          q.notify({
            message: `Saved to ${savedLocation}`,
          });
        }
        store.commit("folder/clearStatePostData");
      } catch (error) {
        console.log(error);
      }
    }

    async function movePosts(folder) {
      try {
        await store.dispatch("folder/movePosts", {
          selectedPostsList: selectedPostsList.value,
          folder,
        });
        q.notify({
          message: `Moved to ${folder.name}`,
        });
        store.commit("folder/clearState");
      } catch (error) {
        console.log(error);
      }
    }

    function clearStatePostData() {
      store.commit("folder/clearStatePostData");
    }

    return {
      dialogRef,
      onDialogHide,
      q,
      clearStatePostData,
      openDialogFolderOrganize,
      folders,
      openDialogFolderCreateAndEdit,
      savePost,
      movePosts,
    };
  },
};
</script>

<style lang="sass" scoped>
.button-width
  width: 100px

.filler
  width: 24px
  height: 24px

.is-selected
  border: 3px solid $accent
</style>

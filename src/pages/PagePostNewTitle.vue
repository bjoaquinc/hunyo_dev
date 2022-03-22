<template>
  <div>
    <div
      class="q-px-lg full-width flex column mobile-only"
      v-if="$q.platform.is.mobile"
    >
      <q-select
        v-model="topics"
        :rules="[
          (val) => val.length > 0 || 'At least one topic must be chosen.',
        ]"
        :options="options"
        multiple
        counter
        class="full-width"
        label="Topic(s) *"
        hint="You can pick more than one topic per post"
      />

      <q-input
        v-model="title"
        :rules="[(val) => !!val || 'Title is required']"
        class="q-mx-none q-mt-sm"
        hint="Briefly describe the main idea of your post"
        label="Title *"
        placeholder="An example title on details here..."
      />
      <div class="q-gutter-sm q-mt-lg text-grey-7">
        <q-checkbox
          v-model="withFeedback"
          class="q-ma-none"
          style="align-items: flex-start !important"
          label="Check if you want constructive feedback on your post. (All feedback must follow community guidelines. No trolling allowed.)"
        />
      </div>
      <div class="q-gutter-sm q-mt-lg text-grey-7">
        <q-checkbox
          v-model="isQuestion"
          class="q-ma-none"
          label="Check if you are asking a question."
        />
      </div>
      <DialogSaveDraft />
    </div>
    <q-card
      bordered
      class="my-card absolute-center desktop-only"
      style="max-width: 500px"
      v-else
    >
      <q-card-section class="flex q-pa-sm">
        <q-btn
          :to="
            previousRouteName
              ? { name: previousRouteName }
              : { name: 'PageHome' }
          "
          icon="fas fa-times"
          dense
          flat
          round
        />
        <q-toolbar-title class="text-center">Create Post</q-toolbar-title>
        <div class="filler" />
      </q-card-section>
      <q-card-section>
        <q-select
          v-model="topics"
          :rules="[
            (val) => val.length > 0 || 'At least one topic must be chosen.',
          ]"
          :options="options"
          multiple
          counter
          class="full-width"
          label="Topic(s) *"
          hint="You can pick more than one topic per post"
        />
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="title"
          :rules="[(val) => !!val || 'Title is required']"
          class="q-mx-none q-mt-sm"
          hint="Briefly describe the main idea of your post"
          label="Title *"
          placeholder="An example title on details here..."
        />
      </q-card-section>

      <q-card-section>
        <div class="q-mt-md text-grey-7">
          <q-checkbox
            v-model="withFeedback"
            class="q-ma-none"
            style="align-items: flex-start !important"
            label="Check if you want constructive feedback on your post. (All feedback must follow community guidelines. No trolling allowed.)"
          />
        </div>
        <div class="q-mt-md text-grey-7">
          <q-checkbox
            v-model="isQuestion"
            class="q-ma-none"
            label="Check if you are asking a question."
          />
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn
          :disable="title && topics.length > 0 ? false : true"
          :to="{ name: 'PagePostNewContent' }"
          label="Next"
          color="primary"
          unelevated
          class="full-width q-mt-sm"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import DialogSaveDraft from "src/components/DialogSaveDraft.vue";
import DialogCommunityGuidelines from "src/components/DialogCommunityGuidelines.vue";
import { auth } from "src/boot/firebase";

export default {
  components: {
    DialogSaveDraft,
  },
  data() {
    return {
      options: ["Details", "Materials", "Methods", "Design Approaches"],
    };
  },
  computed: {
    topicsList() {
      return this.$store.getters["newPost/getTopicsList"];
    },
    title: {
      get() {
        return this.$store.getters["newPost/getTitle"];
      },
      set(value) {
        this.$store.commit("newPost/updateTitle", value);
      },
    },
    withFeedback: {
      get() {
        return this.$store.getters["newPost/getWithFeedback"];
      },
      set(value) {
        this.$store.commit("newPost/updateWithFeedback", value);
      },
    },
    isQuestion: {
      get() {
        return this.$store.getters["newPost/getIsQuestion"];
      },
      set(value) {
        this.$store.commit("newPost/updateIsQuestion", value);
      },
    },
    topics: {
      get() {
        return this.$store.getters["newPost/getTopicsList"];
      },
      set(value) {
        this.$store.commit("newPost/updateTopics", value);
      },
    },
    previousRouteName() {
      return this.$store.getters["newPost/getPreviousRouteName"];
    },
    hasSignedGuidelines() {
      const userData = this.$store.getters["profile/getUserData"];
      if (userData) {
        return userData.hasSignedGuidelines;
      } else {
        return null;
      }
    },
  },
  methods: {
    confirmSaveDraft() {
      return new Promise((resolve) => {
        this.$q
          .dialog({
            component: DialogSaveDraft,
          })
          .onOk(() => {
            resolve("ok");
          })
          .onCancel(() => {
            resolve("not ok");
          });
      });
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch("profile/setUserData", auth.currentUser.uid);
    } catch (error) {
      console.log(error);
    }
    if (!this.hasSignedGuidelines) {
      this.$q.dialog({
        component: DialogCommunityGuidelines,
      });
    }
  },
  async beforeRouteLeave(to) {
    if (this.title && to.name !== "PagePostNewContent") {
      const result = await this.confirmSaveDraft();
      console.log(result);
      this.$store.commit("newPost/clearState");
    } else if (to.name !== "PagePostNewContent") {
      this.$store.commit("newPost/clearState");
    } else {
      return;
    }
  },
};
</script>

<style lang="sass" scoped>
.filler
  width: 24px
  height: 24px
</style>
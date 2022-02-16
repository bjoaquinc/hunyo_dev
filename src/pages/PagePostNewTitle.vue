<template>
  <div>
    <div class="q-px-lg full-width flex column mobile-only">
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
      return this.$store.getters["posts/getTopicsList"];
    },
    title: {
      get() {
        return this.$store.getters["posts/getTitle"];
      },
      set(value) {
        this.$store.commit("posts/updateTitle", value);
      },
    },
    withFeedback: {
      get() {
        return this.$store.getters["posts/getWithFeedback"];
      },
      set(value) {
        this.$store.commit("posts/updateWithFeedback", value);
      },
    },
    isQuestion: {
      get() {
        return this.$store.getters["posts/getIsQuestion"];
      },
      set(value) {
        this.$store.commit("posts/updateIsQuestion", value);
      },
    },
    topics: {
      get() {
        return this.$store.getters["posts/getTopicsList"];
      },
      set(value) {
        this.$store.commit("posts/updateTopics", value);
      },
    },
    previousRouteName() {
      return this.$store.getters["posts/getPreviousRouteName"];
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
            resolve("Saved!");
          })
          .onCancel(() => {
            resolve(":(");
          });
      });
    },
    setRouteName(previousRouteName) {
      this.$store.dispatch("posts/setPreviousRouteName", previousRouteName);
    },
  },
  async beforeRouteLeave(to) {
    if (to.name !== "PagePostNewContent" && this.title) {
      const result = await this.confirmSaveDraft();
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name !== "PagePostNewContent") {
      next((vm) => {
        vm.setRouteName(from.name);
      });
    } else {
      next();
    }
  },
};
</script>

<style lang="sass" scoped>
.filler
  width: 24px
  height: 24px
</style>

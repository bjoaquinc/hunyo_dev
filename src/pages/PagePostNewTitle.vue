<template>
  <div>
    <div
      class="q-px-lg full-width flex column lt-sm"
      v-if="$q.platform.is.mobile && !$q.platform.is.ipad"
    >
      <q-select
        @blur="sendSelectTopicsEvent"
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
        @blur="sendWriteTitleEvent"
        @focus="setTitle"
        :rules="[(val) => !!val || 'Title is required']"
        class="q-mx-none q-mt-sm"
        hint="Briefly describe the main idea of your post"
        label="Title *"
        placeholder="An example title on details here..."
      />
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
      class="my-card absolute-center gt-xs"
      style="max-width: 500px; min-width: 40vw"
      v-else
    >
      <q-card-section class="flex q-pa-sm">
        <q-btn
          :to="{ name: 'PageHome' }"
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
          @blur="sendSelectTopicsEvent"
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
          @blur="sendWriteTitleEvent"
          @focus="setTitle"
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
import amplitude from "amplitude-js";
import DialogSaveDraft from "src/components/DialogSaveDraft.vue";
import DialogCommunityGuidelines from "src/components/DialogCommunityGuidelines.vue";

export default {
  components: {
    DialogSaveDraft,
  },
  data() {
    return {
      options: ["Details", "Materials", "Methods", "Design Approaches"],
      currentTitle: "",
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
    isQuestion: {
      get() {
        return this.$store.getters["newPost/getIsQuestion"];
      },
      set(value) {
        try {
          this.$store.commit("newPost/updateIsQuestion", value);
          amplitude.getInstance().logEventWithTimestamp("create - question", {
            "create id": this.createId,
            "is question": value,
          });
        } catch (error) {
          console.log(error);
        }
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
    content() {
      return this.$store.getters["newPost/getContent"];
    },
    images() {
      return this.$store.getters["newPost/getUploadedImagesList"]
        ? this.$store.getters["newPost/getUploadedImagesList"].length
        : 0;
    },
    user() {
      const user = this.$store.getters["auth/getUser"];
      return user;
    },
    userData() {
      return this.$store.getters["profile/getUserData"];
    },
    createId() {
      return this.$store.getters["amplitude/getCreateId"];
    },
  },
  created() {
    let createId = this.$store.getters["amplitude/getCreateId"];
    if (!createId) {
      try {
        this.$store.commit("amplitude/setCreateId");
        const newCreateId = this.$store.getters["amplitude/getCreateId"];
        createId = newCreateId;
        amplitude.getInstance().logEventWithTimestamp("create - start", {
          "create id": createId,
        });
        this.$store.commit("amplitude/setFirstTimestamp");
        // console.log("Successfully sent create start event");
      } catch (error) {
        console.log(error);
      }
    }
    if (!this.userData.hasSignedGuidelines) {
      this.$q
        .dialog({
          component: DialogCommunityGuidelines,
        })
        .onOk(() => {
          try {
            this.$store.dispatch("profile/updateUserData", {
              hasSignedGuidelines: true,
            });
          } catch (error) {
            console.log(error);
          }
        });
    } else {
      // console.log("Has signed agreement");
      return;
    }
  },
  methods: {
    sendSelectTopicsEvent() {
      if (this.topics && this.topics.length > 0) {
        try {
          amplitude
            .getInstance()
            .logEventWithTimestamp("create - select topics", {
              type: this.topics,
              "create id": this.createId,
            });
        } catch (error) {
          console.log(error);
        }
      }
    },
    setTitle() {
      this.currentTitle = this.title;
    },
    sendWriteTitleEvent() {
      if (
        (!this.title && !this.currentTitle) ||
        this.currentTitle === this.title
      )
        return;
      try {
        amplitude.getInstance().logEventWithTimestamp("create - write title", {
          "create id": this.createId,
        });
        this.currentTitle = "";
      } catch (error) {
        console.log(error);
      }
    },
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
  async beforeRouteLeave(to) {
    try {
      const firstTimestamp = this.$store.getters["amplitude/getFirstTimestamp"];
      const lastTimestamp = Date.now();
      const duration = Math.round((lastTimestamp - firstTimestamp) / 1000);
      const createId = this.$store.getters["amplitude/getCreateId"];
      if (this.title && to.name !== "PagePostNewContent") {
        // const result = await this.confirmSaveDraft();
        // console.log(result);
        // Send create - delete event to Amplitude
        amplitude.getInstance().logEventWithTimestamp("create - delete", {
          "create id": createId,
          duration,
          "has topics": this.topics.length ? true : false,
          "has title": true,
          "has content": this.content ? true : false,
          "is question": this.isQuestion,
          "has images": this.images ? true : false,
        });
        // console.log("Successfully sent create delete event to Amplitude");
        this.$store.commit("newPost/clearState");
        this.$store.commit("amplitude/clearState");
      } else if (to.name !== "PagePostNewContent") {
        // Send create - delete event to Amplitude
        amplitude.getInstance().logEventWithTimestamp("create - delete", {
          "create id": createId,
          duration,
          "has topics": this.topics.length ? true : false,
          "has title": false,
          "has content": this.content ? true : false,
          "is question": this.isQuestion,
          "has images": this.images ? true : false,
        });
        // console.log("Successfully sent create delete event to Amplitude");
        this.$store.commit("newPost/clearState");
        this.$store.commit("amplitude/clearState");
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="sass" scoped>
.filler
  width: 24px
  height: 24px
</style>

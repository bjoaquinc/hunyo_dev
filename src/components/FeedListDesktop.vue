<template>
  <div>
    <q-tabs v-model="tab" inline-label class="text-secondary">
      <q-tab
        name="latest"
        label="Latest"
        no-caps
        @click="$router.push('/landing')"
      />
      <q-tab
        name="materials"
        label="Materials"
        no-caps
        @click="$router.push('/landing')"
      />
      <q-tab
        name="details"
        label="Details"
        no-caps
        @click="$router.push('/landing')"
      />
      <q-tab
        name="methods"
        label="Methods"
        no-caps
        @click="$router.push('/landing')"
      />
      <q-tab
        name="designapproaches"
        label="Design Approaches"
        no-caps
        @click="$router.push('/landing')"
      />
      <q-tab
        name="interiors"
        label="Interiors"
        no-caps
        @click="$router.push('/landing')"
      />
      <q-tab
        name="products"
        label="Products"
        no-caps
        @click="$router.push('/landing')"
      />
    </q-tabs>
    <q-list class="q-mt-sm q-gutter-lg row" v-if="feedItems">
      <div class="col-8">
        <post
          :feedItem="feedItems[0]"
          :feedLocation="feedLocation"
          type="main"
        />
      </div>
      <div class="col">
        <component
          :is="feedItems[1] ? 'post' : 'div'"
          :feedItem="feedItems[1]"
          :feedLocation="feedLocation"
        />
        <component
          :is="feedItems[2] ? 'post' : 'div'"
          class="q-mt-md"
          :feedItem="feedItems[2]"
          :feedLocation="feedLocation"
        />
      </div>
    </q-list>
    <div class="flex q-mt-md" v-if="feedItems && feedItems.length > 3">
      <post
        class="col q-pr-lg"
        :feedItem="feedItems[3]"
        :feedLocation="feedLocation"
      />
      <component
        :is="feedItems[4] ? 'post' : 'div'"
        class="col q-pr-lg"
        :feedItem="feedItems[4]"
        :feedLocation="feedLocation"
      />
      <component
        :is="feedItems[5] ? 'post' : 'div'"
        class="col"
        :feedItem="feedItems[5]"
        :feedLocation="feedLocation"
      />
    </div>
    <div class="flex q-mt-md" v-if="feedItems && feedItems.length > 6">
      <post
        class="col q-pr-lg"
        :feedItem="feedItems[6]"
        :feedLocation="feedLocation"
      />
      <component
        :is="feedItems[7] ? 'post' : 'div'"
        class="col q-pr-lg"
        :feedItem="feedItems[7]"
        :feedLocation="feedLocation"
      />
      <component
        :is="feedItems[8] ? 'post' : 'div'"
        class="col"
        :feedItem="feedItems[8]"
        :feedLocation="feedLocation"
      />
    </div>
    <div v-if="feedItems && feedItems.length" class="full-width">
      <q-btn
        outline
        unelevated
        color="primary"
        label="Sign in to view more posts >>"
        class="full-width q-mt-md q-mb-lg"
        size="lg"
        to="/landing/"
      />
    </div>
  </div>
</template>

<script>
import PostItem from "src/components/PostItemDesktop.vue";

export default {
  props: ["feedItems", "feedLocation"],
  components: {
    post: PostItem,
  },
  data() {
    return {
      tab: "latest",
    };
  },
  methods: {
    type(index) {
      return this.feedItems[index].type;
    },
    id(index) {
      return this.feedItems[index].id;
    },
  },
};
</script>

<style lang="sass" scoped>
.q-item
  flex-wrap: wrap
  display: inherit
  position: inherit
  padding: 0 0 0 0
</style>

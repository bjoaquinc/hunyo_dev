<template>
  <div>
    <div v-for="(item, index) in items" :key="index">
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
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import PostItemDesktop from "src/components/PostItemDesktop.vue";

export default {
  props: ["feedItems", "feedLocation"],
  components: {
    post: PostItemDesktop,
  },
  setup(props) {
    const store = useStore();
    const quasar = useQuasar();
    const items = ref([{}]);

    const type = (index) => props.feedItems[index].type;
    const id = (index) => props.feedItems[index].id;

    function onLoad(index, done) {
      console.log(index);
      setTimeout(() => {
        items.value.push({});
        done();
      }, 2000);
    }

    return {
      items,
      type,
      id,
      onLoad,
    };
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

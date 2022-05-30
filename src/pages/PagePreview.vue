<template>
  <div class="row">
    <div class="col-12 col-sm-7 q-mx-auto" v-if="postItem">
      <div class="flex items-center q-mb-md q-mt-lg gt-xs">
        <q-btn
          color="primary"
          icon="fas fa-arrow-left"
          label="Back to Edit"
          @click="$router.go(-1)"
          no-caps
          dense
          flat
        />

        <div class="text-h5 text-red q-mx-auto">Preview</div>

        <q-btn
          @click="publishPost"
          color="primary"
          label="Publish Post"
          no-caps
          unelevated
        />
      </div>
      <PreviewDetail
        :content="postItem.content"
        :title="postItem.title"
        :imagesList="postItem.imagesList"
        :postId="postItem.id"
        :user="postItem.user"
        :topics="postItem.topics"
      />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import PreviewDetail from "src/components/PreviewDetail.vue";

export default {
  components: { PreviewDetail },
  props: ["postId"],
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const q = useQuasar();
    const postItem = computed(() => store.getters["newPost/getPostItem"]);
    const unsubscribePostItem = computed(
      () => store.getters["newPost/getUnsubscribePostItem"]
    );

    console.log(router.options.history.state.back);

    onMounted(async () => {
      if (!postItem.value) {
        try {
          q.loading.show();
          await store.dispatch("newPost/setPostItem", props.postId);
          q.loading.hide();
        } catch (error) {
          console.log(error);
        }
      }
    });

    async function publishPost() {
      try {
        q.loading.show({
          message: "Uploading...",
        });
        await store.dispatch("newPost/publishPost");
        await store.dispatch("newPost/toggleHasDrafts");
        if (unsubscribePostItem.value) unsubscribePostItem.value();
        store.commit("newPost/clearState");
        store.commit("amplitude/clearState");
        router.push({ name: "PageHome" });
        q.loading.hide();
      } catch (error) {
        console.log(error);
      }
    }

    return {
      postItem,
      publishPost,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    margin-top: 21px
</style>

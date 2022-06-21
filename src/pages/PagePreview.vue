<template>
  <div
    v-if="postItem"
    class="q-mx-auto"
    :style="$q.platform.is.desktop ? { maxWidth: '80vw' } : null"
  >
    <div class="row">
      <div
        class="flex items-center q-mb-md q-mt-lg gt-xs"
        :class="
          $q.platform.is.ipad || !imagesList ? 'col-8 q-mx-auto' : 'full-width'
        "
      >
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
    </div>
    <div class="row q-col-gutter-md">
      <div class="col" v-if="imagesList && $q.platform.is.desktop">
        <BaseCarousel :imagesList="imagesList" />
      </div>
      <div
        class="col-12"
        :class="
          $q.platform.is.ipad || !imagesList ? 'col-sm-8 q-mx-auto' : 'col-sm-6'
        "
      >
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
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import PreviewDetail from "src/components/PreviewDetail.vue";
import BaseCarousel from "src/components/BaseCarousel.vue";

export default {
  components: { PreviewDetail, BaseCarousel },
  props: ["postId"],
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const q = useQuasar();
    const postItem = computed(() => store.getters["newPost/getPostItem"]);
    const unsubscribePostItem = computed(
      () => store.getters["newPost/getUnsubscribePostItem"]
    );
    const imagesList = computed(() => {
      if (
        postItem.value &&
        postItem.value.imagesList &&
        postItem.value.imagesList.length
      ) {
        return postItem.value.imagesList;
      } else {
        return null;
      }
    });

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
      imagesList,
      publishPost,
    };
  },
};
</script>

<style lang="sass" scoped>

.q-page
  @media (min-width: 690px)
    padding-top: 21px
</style>

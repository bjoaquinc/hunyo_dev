<template>
  <q-card q-mt-md flat bordered>
    <q-card-section class="q-pa-none">
      <q-card-section class="q-pb-none q-py-md">
        <div class="flex items-center no-wrap">
          <q-avatar class="q-mr-sm">
            <img :src="feedItem.user.photo" />
          </q-avatar>
          <div class="flex items-center">
            <q-btn
              flat
              padding="0"
              color="secondary"
              no-caps
              :to="{ name: userRoute, params: { userId: feedItem.user.id } }"
              >{{ feedItem.user.name }}</q-btn
            >
            <span class="q-mx-xs">recommended</span>
            <q-btn
              :to="{
                name: userRoute,
                params: { userId: feedItem.postData.user.id },
              }"
              class="q-mr-xs"
              flat
              padding="0"
              color="secondary"
              no-caps
              >{{ feedItem.postData.user.name }}'s</q-btn
            >
            post.
          </div>
        </div>
        <div class="q-mt-sm">
          {{ feedItem.caption }}
        </div>
      </q-card-section>
      <q-item
        v-if="!withoutPost"
        clickable
        v-ripple
        :to="{ name: postRoute, params: { postId: feedItem.postData.id } }"
      >
        <q-card
          class="flex items-center full-width q-ml-auto"
          style="min-height: 200px"
        >
          <q-card-section>
            <div class="text-subtitle1">{{ feedItem.postData.title }}</div>
          </q-card-section>
          <q-img :src="feedItem.postData.image" :ratio="1" />
          <q-item class="q-pt-none q-mt-sm">
            <q-item-section avatar>
              <q-avatar>
                <img :src="feedItem.postData.user.photo" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold" caption
                >{{ feedItem.postData.user.name }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { computed } from "vue";
import { useRoute } from "vue-router";
import DialogFlag from "src/components/DialogFlag.vue";

export default {
  props: ["feedItem", "withoutPost"],
  setup() {
    const q = useQuasar();
    const route = useRoute();
    const postRoute = computed(() =>
      route.meta.profile ? "ProfilePost" : "FeedPost"
    );
    const userRoute = computed(() =>
      route.meta.profile ? "ProfileUser" : "FeedUser"
    );

    function openDialogFlag() {
      q.dialog({
        component: DialogFlag,
      });
    }

    return {
      openDialogFlag,
      postRoute,
      userRoute,
    };
  },
};
</script>

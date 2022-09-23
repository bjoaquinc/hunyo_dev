<template>
  <div>
    <q-list class="q-mt-sm q-gutter-lg row">
      <div class="col-8">
        <q-item class="flex column no-padding" clickable>
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FeetIsGP8XSRAUI7ebZln%2Fc57ce1f7-6a35-4524-acc9-4e8b09f6972b?alt=media&token=d45ccbde-ef1f-4545-979d-3144f99aaca9"
          />
          <q-item-label class="text-overline text-grey-8 q-pt-sm"
            >HOMEQUARTERS LIGHTING</q-item-label
          >
          <q-item-label
            class="text-h6 text-weight-normal flex items-center"
            style="margin-top: 0 !important"
          >
            Sienna Flora Chandelier</q-item-label
          >
        </q-item>
      </div>
      <div class="col">
        <q-item class="flex column no-padding" clickable>
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FeetIsGP8XSRAUI7ebZln%2F9ae31338-5e51-45c0-b689-3ecac7cba6a8?alt=media&token=b3a6b2ee-e9d8-43e6-9fc6-5efe948f586c"
          />
          <q-item-label class="text-overline text-grey-8 q-pt-sm"
            >HOMEQUARTERS LIGHTING</q-item-label
          >
          <q-item-label
            class="text-h6 text-weight-normal flex items-center"
            style="margin-top: 0 !important"
          >
            Rigby Wall Sconce</q-item-label
          >
        </q-item>
        <q-item class="flex column no-padding q-mt-lg" clickable>
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FeetIsGP8XSRAUI7ebZln%2Fcf81d39d-05a0-47b4-83e4-f5f0222eaa3f?alt=media&token=a2284cef-9f29-4b28-9586-aadc7073008e"
          />
          <q-item-label class="text-overline text-grey-8 q-pt-sm"
            >HOMEQUARTERS LIGHTING</q-item-label
          >
          <q-item-label
            class="text-h6 text-weight-normal flex items-center"
            style="margin-top: 0 !important"
          >
            Cancun Drop Light</q-item-label
          >
        </q-item>
      </div>
    </q-list>
    <div class="flex q-my-md">
      <div class="col q-pr-lg">
        <q-item class="flex column no-padding" clickable>
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2F0d0102db-feb1-42ee-b52c-eac612841011?alt=media&token=308c4929-a00d-4e64-8293-b30506e9d6f2"
          />
          <q-item-label class="text-overline text-grey-8 q-pt-sm"
            >EUROBEL RUGS + CARPETS</q-item-label
          >
          <q-item-label
            class="text-h6 text-weight-normal flex items-center"
            style="margin-top: 0 !important"
          >
            Charlotte Collection</q-item-label
          >
        </q-item>
      </div>
      <div class="col q-pr-lg">
        <q-item class="flex column no-padding" clickable>
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2F8677c32b-a148-4d4b-928e-7a88025cdae5?alt=media&token=923c5f50-bc03-47f5-af0a-44a83fe31374"
          />
          <q-item-label class="text-overline text-grey-8 q-pt-sm"
            >EUROBEL RUGS + CARPETS</q-item-label
          >
          <q-item-label
            class="text-h6 text-weight-normal flex items-center"
            style="margin-top: 0 !important"
          >
            Arianna Collection</q-item-label
          >
        </q-item>
      </div>
      <div class="col">
        <q-item
          class="flex column no-padding"
          :to="'/products/vYnRD3rPTU1iX5Aikwve/'"
          clickable
        >
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2F64380e30-210c-49fe-907d-abfde8fd12c5?alt=media&token=5dadceb0-2905-4394-8cf3-3fdd59acafc2"
          />
          <q-item-label class="text-overline text-grey-8 q-pt-sm"
            >EUROBEL RUGS + CARPETS</q-item-label
          >
          <q-item-label
            class="text-h6 text-weight-normal flex items-center"
            style="margin-top: 0 !important"
          >
            Cyrus Collection</q-item-label
          >
        </q-item>
      </div>
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

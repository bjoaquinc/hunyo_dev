<template>
  <div>
    <q-tabs v-model="tab" inline-label class="text-secondary">
      <q-tab
        name="latest"
        label="All Products"
        no-caps
        @click="$router.push('/landing')"
      />
      <q-tab
        name="materials"
        label="Windows & Doors"
        no-caps
        @click="$router.push('/landing')"
      />
      <q-tab
        name="details"
        label="Roofing"
        no-caps
        @click="$router.push('/landing')"
      />
      <q-tab
        name="methods"
        label="Lighting"
        no-caps
        @click="$router.push('/landing')"
      />
      <q-tab
        name="designapproaches"
        label="Bathroom"
        no-caps
        @click="$router.push('/landing')"
      />
      <q-tab
        name="interiors"
        label="Rugs & Carpets"
        no-caps
        @click="$router.push('/landing')"
      />
    </q-tabs>
    <q-list class="q-mt-sm q-gutter-lg row">
      <div class="col-8">
        <q-item
          class="flex column no-padding"
          to="/products/E3Zwh5RPZEfc3ezQ886p"
          clickable
        >
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/product_images%2FvwVeVbzP2tuuIrnKMY2I%2FE3Zwh5RPZEfc3ezQ886p%2Faf805b76-6a8f-4e10-b16d-66bd535c87b4?alt=media&token=9bb4f327-de11-44a1-be94-9a3b1279ce3e"
          />
          <q-item-label class="text-overline text-grey-8 q-pt-sm"
            >CIOS DOORS AND WINDOWS</q-item-label
          >
          <q-item-label
            class="text-h6 text-weight-normal flex items-center"
            style="margin-top: 0 !important"
          >
            Breezeway Louvre Windows</q-item-label
          >
        </q-item>
      </div>
      <div class="col flex">
        <q-item class="flex column no-padding full-width" clickable>
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/product_images%2FOTgMYiNES1J4LEwcMvPK%2F4OSCZDbwjNtjVuPTnG4z%2F137c6c03-7e2e-4c55-b8c6-4417ab799e9e?alt=media&token=a63cd602-636d-4693-b702-18fc1779baf7"
          />
          <q-item-label class="text-overline text-grey-8 q-pt-sm"
            >KAWARA ROOFING</q-item-label
          >
          <q-item-label
            class="text-h6 text-weight-normal flex items-center"
            style="margin-top: 0 !important"
          >
            Asphalt Shingles</q-item-label
          >
        </q-item>
        <q-item class="flex column no-padding full-width q-mt-auto" clickable>
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
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/product_images%2FoSOiAQ0BTfz96LjIkFEO%2FePclO53LjnuAbKsiUlJo%2F8b5f18cb-35cf-49c6-b4a0-1ad1443866c5?alt=media&token=739f17ec-bd34-4cd5-a570-5f70a2c85dc8"
          />
          <q-item-label class="text-overline text-grey-8 q-pt-sm"
            >HOMEQUARTERS LIGHTING</q-item-label
          >
          <q-item-label
            class="text-h6 text-weight-normal flex items-center"
            style="margin-top: 0 !important"
          >
            Kiote Floor Lamps</q-item-label
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
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/product_images%2FOTgMYiNES1J4LEwcMvPK%2FC5v9QZQvwim1bbRRUw5R%2F26d00a79-c2b3-4372-9ec3-bdad16f5112a?alt=media&token=1c4a5d36-38c2-420e-a00a-97aad8dac828"
          />
          <q-item-label class="text-overline text-grey-8 q-pt-sm"
            >KAWARA ROOFING</q-item-label
          >
          <q-item-label
            class="text-h6 text-weight-normal flex items-center"
            style="margin-top: 0 !important"
          >
            Japanese Clay Roof Tiles</q-item-label
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

<template>
  <div>
    <q-list class="q-mt-sm q-gutter-lg row">
      <div class="col-8">
        <product class="col" :feedItem="feedItems[0]" />
      </div>
      <div class="col flex">
        <product
          v-if="feedItems[1]"
          class="flex column no-padding full-width"
          :feedItem="feedItems[1]"
        />
        <product
          v-if="feedItems[2]"
          class="flex column no-padding full-width q-mt-auto"
          :feedItem="feedItems[2]"
        />
      </div>
      <div
        class="flex q-mt-md col-12 q-pr-lg"
        v-if="feedItems && feedItems.length > 3"
      >
        <div class="col q-pr-lg">
          <product :feedItem="feedItems[3]" />
        </div>
        <div class="col q-pr-lg">
          <component
            :is="feedItems[4] ? 'product' : 'div'"
            :feedItem="feedItems[4]"
          />
        </div>
        <div class="col">
          <component
            :is="feedItems[5] ? 'product' : 'div'"
            :feedItem="feedItems[5]"
          />
        </div>
      </div>
      <div
        class="flex q-mt-md col-12 q-pr-lg"
        v-if="feedItems && feedItems.length > 6"
      >
        <div class="col q-pr-lg">
          <product :feedItem="feedItems[6]" />
        </div>
        <div class="col q-pr-lg">
          <component
            :is="feedItems[7] ? 'product' : 'div'"
            :feedItem="feedItems[7]"
          />
        </div>
        <div class="col">
          <component
            :is="feedItems[8] ? 'product' : 'div'"
            :feedItem="feedItems[8]"
          />
        </div>
      </div>
    </q-list>
  </div>
</template>

<script>
import ProductFeedItem from "src/components/ProductFeedItem.vue";

export default {
  props: ["feedItems"],
  components: {
    product: ProductFeedItem,
  },
  setup() {
    // const feedItems = [
    //   {
    //     supplier: {
    //       name: "Cios",
    //       productGroup: "Doors & Windows",
    //     },
    //     name: "Breezeway Louvre Windows",
    //     photo:
    //       "http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/product_images%2FvwVeVbzP2tuuIrnKMY2I%2FE3Zwh5RPZEfc3ezQ886p%2Faf805b76-6a8f-4e10-b16d-66bd535c87b4?alt=media&token=9bb4f327-de11-44a1-be94-9a3b1279ce3e",
    //   },
    //   {
    //     supplier: {
    //       name: "Cios",
    //       productGroup: "Doors & Windows",
    //     },
    //     name: "Breezeway Louvre Windows",
    //     photo:
    //       "http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/product_images%2FvwVeVbzP2tuuIrnKMY2I%2FE3Zwh5RPZEfc3ezQ886p%2Faf805b76-6a8f-4e10-b16d-66bd535c87b4?alt=media&token=9bb4f327-de11-44a1-be94-9a3b1279ce3e",
    //   },
    //   {
    //     supplier: {
    //       name: "Cios",
    //       productGroup: "Doors & Windows",
    //     },
    //     name: "Breezeway Louvre Windows",
    //     photo:
    //       "http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/product_images%2FvwVeVbzP2tuuIrnKMY2I%2FE3Zwh5RPZEfc3ezQ886p%2Faf805b76-6a8f-4e10-b16d-66bd535c87b4?alt=media&token=9bb4f327-de11-44a1-be94-9a3b1279ce3e",
    //   },
    //   {
    //     supplier: {
    //       name: "Cios",
    //       productGroup: "Doors & Windows",
    //     },
    //     name: "Breezeway Louvre Windows",
    //     photo:
    //       "http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/product_images%2FvwVeVbzP2tuuIrnKMY2I%2FE3Zwh5RPZEfc3ezQ886p%2Faf805b76-6a8f-4e10-b16d-66bd535c87b4?alt=media&token=9bb4f327-de11-44a1-be94-9a3b1279ce3e",
    //   },
    //   {
    //     supplier: {
    //       name: "Cios",
    //       productGroup: "Doors & Windows",
    //     },
    //     name: "Breezeway Louvre Windows",
    //     photo:
    //       "http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/product_images%2FvwVeVbzP2tuuIrnKMY2I%2FE3Zwh5RPZEfc3ezQ886p%2Faf805b76-6a8f-4e10-b16d-66bd535c87b4?alt=media&token=9bb4f327-de11-44a1-be94-9a3b1279ce3e",
    //   },
    //   {
    //     supplier: {
    //       name: "Cios",
    //       productGroup: "Doors & Windows",
    //     },
    //     name: "Breezeway Louvre Windows",
    //     photo:
    //       "http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/product_images%2FvwVeVbzP2tuuIrnKMY2I%2FE3Zwh5RPZEfc3ezQ886p%2Faf805b76-6a8f-4e10-b16d-66bd535c87b4?alt=media&token=9bb4f327-de11-44a1-be94-9a3b1279ce3e",
    //   },
    //   {
    //     supplier: {
    //       name: "Cios",
    //       productGroup: "Doors & Windows",
    //     },
    //     name: "Breezeway Louvre Windows",
    //     photo:
    //       "http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/product_images%2FvwVeVbzP2tuuIrnKMY2I%2FE3Zwh5RPZEfc3ezQ886p%2Faf805b76-6a8f-4e10-b16d-66bd535c87b4?alt=media&token=9bb4f327-de11-44a1-be94-9a3b1279ce3e",
    //   },
    //   {
    //     supplier: {
    //       name: "Cios",
    //       productGroup: "Doors & Windows",
    //     },
    //     name: "Breezeway Louvre Windows",
    //     photo:
    //       "http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/product_images%2FvwVeVbzP2tuuIrnKMY2I%2FE3Zwh5RPZEfc3ezQ886p%2Faf805b76-6a8f-4e10-b16d-66bd535c87b4?alt=media&token=9bb4f327-de11-44a1-be94-9a3b1279ce3e",
    //   },
    //   {
    //     supplier: {
    //       name: "Cios",
    //       productGroup: "Doors & Windows",
    //     },
    //     name: "Breezeway Louvre Windows",
    //     photo:
    //       "http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/product_images%2FvwVeVbzP2tuuIrnKMY2I%2FE3Zwh5RPZEfc3ezQ886p%2Faf805b76-6a8f-4e10-b16d-66bd535c87b4?alt=media&token=9bb4f327-de11-44a1-be94-9a3b1279ce3e",
    //   },
    // ];
    return {};
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

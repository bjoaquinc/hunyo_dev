<template>
  <div>
    <q-list class="full-width row q-pr-md">
      <div
        v-for="(feedItem, index) in feedItems"
        class="col-6 q-pl-md q-mt-md"
        :key="index"
      >
        <product :feedItem="feedItem" />
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

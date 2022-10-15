<template>
  <q-item
    class="flex column no-padding"
    :to="{ name: 'ProductDetail', params: { productId: feedItem.productId } }"
    clickable
  >
    <q-img
      ratio="1"
      style="border: 1px solid rgba(0, 0, 0, 0.12)"
      :src="feedItem.photo"
    />
    <q-item-label
      :lines="$q.platform.is.desktop ? 1 : 2"
      class="text-overline text-grey-8 q-pt-sm text-uppercase"
      >{{ feedItem.supplier.name }}</q-item-label
    >
    <q-item-label
      :lines="$q.platform.is.desktop ? 1 : 2"
      class="text-h6 text-weight-normal flex items-center"
      style="margin-top: 0 !important"
    >
      {{ feedItem.name }}</q-item-label
    >
  </q-item>
</template>

<script>
export default {
  name: "ProductFeedItem",
  props: ["feedItem"],
  setup() {
    return {};
  },
};
</script>

<style lang="sass" scoped>
.q-card__actions
  .q-btn
    width: 50%


.q-card__section
  padding: 8px 16px

.q-item__section
  padding-right: 0 !important
</style>

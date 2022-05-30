<template>
  <q-item
    class="full-width border-bottom"
    clickable
    v-ripple
    :to="{ name: 'PagePostNewTitle', params: { postId } }"
  >
    <q-item-section top thumbnail>
      <img
        v-if="image"
        style="width: 80px; height: 80px"
        class="q-ml-md"
        :src="image"
      />
    </q-item-section>
    <q-item-section class="q-mx-sm">
      <q-item-label class="text-subtitle1">{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { computed } from "vue";
export default {
  props: ["postId", "title", "imagesList"],
  setup(props) {
    const image = computed(() => {
      if (props.imagesList && props.imagesList.length > 0) {
        return props.imagesList[0];
      } else {
        return null;
      }
    });

    return {
      image,
    };
  },
};
</script>

<style lang="sass" scoped>
.border-bottom
  border-bottom: 1px solid rgba(0, 0, 0, 0.12)
img
  border: 1px solid rgba(0, 0, 0, 0.12)
</style>

<template>
  <q-item clickable v-ripple :to="route">
    <q-card
      class="flex items-center full-width q-ml-auto"
      style="min-height: 260px"
    >
      <q-card-section>
        <div class="text-subtitle1">{{ title }}</div>
      </q-card-section>
      <q-img :src="image" :ratio="1" v-if="image" />
      <q-item class="q-pt-none q-mt-sm q-mx-md" v-if="user">
        <q-item-section avatar>
          <q-avatar>
            <img :src="user.photo" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-bold" caption
            >{{ user.name }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </q-item>
</template>

<script>
export default {
  name: "PostItem",
  props: ["postData", "id", "route"],
  data() {
    return {
      image: "",
      title: "",
      user: null,
      postId: "",
    };
  },
  methods: {
    openPostActionsDialog() {
      this.$q.dialog({
        component: DialogPostActions,
      });
    },
  },
  mounted() {
    const { image, title, user, id } = this.postData;
    this.title = title;
    this.user = user;
    this.postId = id;
    if (image) {
      this.image = image;
    }
  },
};
</script>

<style lang="sass" scoped>
.q-item
  padding: 0
</style>

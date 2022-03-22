<template>
  <q-card class="full-width" flat>
    <q-item clickable :to="{ name: userRoute, params: { userId: user.id } }">
      <q-item-section avatar>
        <q-avatar size="30px">
          <img :src="user.photo" />
        </q-avatar>
      </q-item-section>

      <q-space />

      <q-item-section>
        <q-item-label lines="1" class="comment-user"
          >{{ user.name }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-card-section>
      {{ reply }}
    </q-card-section>
    <q-card-actions>
      <!-- <q-btn
        flat
        size="sm"
        dense
        color="primary"
        icon="far fa-smile"
        label="Helpful"
      /> -->
      <q-btn
        @click="openDialogFlag"
        flat
        size="sm"
        dense
        color="primary"
        icon="fas fa-flag"
        label="Flag"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { computed } from "vue";
import { useRoute } from "vue-router";
import DialogFlag from "src/components/DialogFlag.vue";

export default {
  props: ["reply", "id", "user"],
  setup() {
    const q = useQuasar();
    const route = useRoute();
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
      userRoute,
    };
  },
};
</script>

<style lang="sass" scoped>
.q-item__section
  padding-right: 0
  min-width: 37px
.comment-user
  font-size: 13px
  font-weight: bold

.q-card__section
  padding: 0 16px
</style>
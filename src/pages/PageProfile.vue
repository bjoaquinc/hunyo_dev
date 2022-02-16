<template>
  <q-page class="constrain">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-7 q-ml-sm-sm">
        <ProfileDetail />
        <q-tabs
          v-model="tab"
          dense
          align="justify"
          class="bg-white text-primary full-width sticky"
          :breakpoint="0"
        >
          <q-tab name="PostsList" label="Activity" />
          <q-tab class="mobile-only" name="FoldersList" label="Folder" />
        </q-tabs>
        <component :is="tab" class="full-width" />
      </div>
      <div class="col desktop-only">
        <q-card class="fixed bg-grey-1" style="width: 364px" flat>
          <div class="flex justify-between items-center q-mb-sm">
            <div class="text-h6">Folder</div>
            <q-btn
              icon="fas fa-folder-plus"
              label="Create Folder"
              flat
              color="primary"
            />
          </div>
          <FoldersList />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import ProfileDetail from "src/components/ProfileDetail.vue";
import PostsList from "src/components/PostsList.vue";
import FoldersList from "src/components/FoldersList.vue";

export default {
  name: "PageProfile",
  data() {
    return {
      tab: "PostsList",
    };
  },
  watch: {
    tab(newValue) {
      console.log(newValue);
    },
  },
  components: {
    ProfileDetail,
    PostsList,
    FoldersList,
  },
};
</script>

<style lang="sass" scoped>
.sticky
  position: --webkit-sticky
  position: sticky
  top: 50px
  z-index: 1000

.q-page
  @media (min-width: 690px)
    margin-top: 21px
</style>

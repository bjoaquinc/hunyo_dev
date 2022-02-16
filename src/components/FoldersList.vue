<template>
  <q-list bordered padding class="rounded-borders q-pb-none bg-white">
    <div class="flex justify-between items-center mobile-only">
      <q-btn
        icon="fas fa-folder-plus"
        label="Create Folder"
        flat
        color="primary"
      />
    </div>
    <FolderItem />
    <q-separator />
    <FolderItem />
    <q-separator />
    <FolderItem />
  </q-list>
</template>

<script>
import FolderItem from "src/components/FolderItem.vue";

export default {
  components: { FolderItem },
};
</script>

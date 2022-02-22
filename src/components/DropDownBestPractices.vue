<template>
  <q-list bordered class="rounded-borders text-grey-7" v-if="!isQuestion">
    <q-expansion-item
      class="bg-grey-3"
      expand-separator
      default-opened
      label="Writing tips"
    >
      <div class="bg-white full-width text-subtitle2 q-pa-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
        tempore inventore dolorem sapiente, illum in iure ad ea nobis laborum
        vero sunt ut voluptate ipsam ipsa, unde, quam nulla blanditiis!
      </div>
      <q-expansion-item expand-separator label="More tips" class="bg-white">
        <q-expansion-item
          v-for="(
            { topic, isMinimized, practicesList }, index
          ) in chosenBestPracticesList"
          :key="index"
          class="bg-white"
          expand-separator
          :label="topic"
        >
          <q-card>
            <q-card-section class="bg-white q-pt-xs">
              <ul>
                <li
                  v-for="(practice, index) in practicesList"
                  :key="index"
                  v-show="isMinimized ? index <= 2 : index + 1"
                  class="text-caption"
                >
                  {{ practice }}
                </li>
              </ul>
              <q-btn
                flat
                size="md"
                color="primary"
                label="See more..."
                no-caps
                v-if="isMinimized"
                @click="toggleIsMinimized(index)"
              />
              <q-btn
                flat
                size="md"
                color="primary"
                label="See less"
                no-caps
                v-else
                @click="toggleIsMinimized(index)"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-expansion-item>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const chosenBestPracticesList = computed(
      () => store.getters["newPost/getChosenBestPracticesList"]
    );
    const isQuestion = computed(() => store.getters["newPost/getIsQuestion"]);

    function toggleIsMinimized(index) {
      store.dispatch("newPost/toggleIsMinimized", index);
    }

    return {
      chosenBestPracticesList,
      isQuestion,
      toggleIsMinimized,
    };
  },
};
</script>

<style lang="sass" scoped>
ul
  padding-left: 10px
  margin-top: 0
  margin-bottom: 0
</style>

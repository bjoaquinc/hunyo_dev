<template>
  <component
    v-if="product"
    :is="
      $q.platform.is.desktop && product.imagesList && product.imagesList.length
        ? 'q-responsive'
        : 'div'
    "
    ratio="1"
  >
    <q-card class="my-card overflow-auto" bordered flat>
      <q-item>
        <q-item-label class="text-h4 q-pt-sm gt-lg">{{
          product.name
        }}</q-item-label>
        <q-item-label class="text-h4 q-pt-sm gt-xs lt-xl">{{
          product.name
        }}</q-item-label>
        <q-item-label class="text-subtitle1 q-pt-md lt-sm">{{
          product.name
        }}</q-item-label>
      </q-item>

      <div class="flex items-center q-mx-sm gt-xs">
        <q-btn
          color="primary"
          class="q-ml-xs"
          icon="fas fa-ellipsis-h"
          flat
          dense
        />
      </div>

      <BaseCarousel
        class="q-pt-md"
        :imagesList="product.imagesList"
        v-if="
          $q.platform.is.mobile &&
          product.imagesList &&
          product.imagesList.length
        "
      />

      <q-card-actions class="q-ml-sm" v-if="hasFiles">
        <q-item
          clickable
          class="full-width"
          v-for="({ name, size, type }, index) in product.uploadedFiles"
          :key="index"
        >
          <q-item-section avatar>
            <q-icon color="negative" name="fas fa-file-pdf" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ name }}</q-item-label>
            <q-item-label caption>{{ `${type} | ${size}` }}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>Download</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-actions>

      <q-card-section>
        <div class="text-h5 q-mb-md q-mt-sm">Overview:</div>
        <div class="row" v-for="(value, key) in product.overview" :key="key">
          <div class="col-3 text-subtitle1">{{ key }}</div>
          <div class="col text-subtitle1">:</div>
          <div class="col-8 text-subtitle1">{{ value }}</div>
        </div>
      </q-card-section>

      <q-card-actions class="q-mx-sm row">
        <q-btn-dropdown
          outline
          icon="fas fa-phone"
          class="col-6"
          color="primary"
          label="Contact"
        >
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Luzon</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Visayas</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Mindanao</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          class="col"
          color="primary"
          icon="fas fa-folder"
          label="Save"
          size="md"
          unelevated
        />
      </q-card-actions>

      <q-card-section class="q-pt-md lt-xl">
        <q-expansion-item
          label="More Information:"
          class="text-h5 text-secondary q-my-sm"
          header-class="q-px-none"
        >
          <div
            class="text-subtitle1 q-mb-sm"
            style="white-space: pre-wrap"
            v-html="sanitizeDisplayText(product.moreInformation)"
          />
          <q-btn
            label="See Product in Website"
            color="primary"
            no-caps
            outline
          />
        </q-expansion-item>
      </q-card-section>

      <q-separator />

      <q-card-actions align="between">
        <q-item
          class="q-py-sm q-px-sm full-width"
          :style="
            $route.name === 'LandingPost'
              ? { borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }
              : null
          "
          clickable
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src="product.supplier.logo" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold" caption>{{
              product.supplier.name
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-actions>
    </q-card>
  </component>
</template>

<script>
import BaseCarousel from "src/components/BaseCarousel.vue";
import { sanitizeDisplayText } from "src/logic/Sanitize.js";
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "PostItem",
  components: {
    BaseCarousel,
  },
  props: ["product"],
  setup(props) {
    const store = useStore();
    const currentUser = computed(() => store.getters["auth/getUser"]);
    const currentUserData = computed(
      () => store.getters["profile/getUserData"]
    );
    const hasFiles = computed(() => {
      if (
        props.product &&
        props.product.uploadedFiles &&
        props.product.uploadedFiles.length
      ) {
        return true;
      } else {
        return false;
      }
    });

    return {
      currentUser,
      currentUserData,
      hasFiles,
      sanitizeDisplayText,
    };
  },
};
</script>

<style lang="sass" scoped>

.my-card
  max-width: 100vw

.q-card__section
  padding: 8px 16px

.q-item
  min-height: 4px

.q-item__label
  margin-top: 0

.q-item__section
  padding-right: 0 !important

.q-expansion-item__container
  color: $primary

.caption
  margin: 0
</style>

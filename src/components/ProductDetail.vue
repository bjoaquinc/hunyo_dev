<template>
  <component
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
        <q-item-label class="text-h5 q-pt-md lt-sm">{{
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
        <!-- <q-btn
          v-if="!isPublic"
          size="sm"
          @click="openDialogFoldersList"
          color="primary"
          icon="fas fa-folder"
          label="Save"
          unelevated
        /> -->
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

      <q-card-actions
        :class="$q.platform.is.desktop ? '' : 'q-mt-md'"
        v-if="hasFiles"
      >
        <q-item
          :href="file"
          target="_blank"
          clickable
          class="full-width"
          v-for="({ name, size, type, file }, index) in product.uploadedFiles"
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
          @click="openDialogFoldersList"
          class="col"
          color="primary"
          icon="fas fa-folder"
          label="Save"
          size="md"
          unelevated
        />
      </q-card-actions>

      <q-card-section class="q-pt-md gt-lg">
        <div
          class="text-body1"
          style="white-space: pre-wrap"
          v-html="sanitizeDisplayText(product.moreInformation)"
        />
      </q-card-section>

      <q-card-section class="q-pt-md lt-xl">
        <div class="text-h5 q-my-sm">More Information:</div>
        <div
          class="text-subtitle1 q-mb-sm"
          style="white-space: pre-wrap"
          v-html="sanitizeDisplayText(product.moreInformation)"
        />
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
            <q-item-label class="text-weight-bold text-subtitle1 text-grey-6">{{
              product.supplier.name
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-actions>
      <q-separator />
    </q-card>
  </component>
</template>

<script>
import BaseCarousel from "src/components/BaseCarousel.vue";
import DialogFoldersList from "src/components/dialogs/DialogFoldersList.vue";
import { sanitizeDisplayText } from "src/logic/Sanitize.js";

export default {
  name: "PostItem",
  components: {
    BaseCarousel,
  },
  props: ["product"],
  data() {
    return {
      visibleStartTimestamp: "",
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters["auth/getUser"];
    },
    currentUserData() {
      return this.$store.getters["profile/getUserData"];
    },
    hasFiles() {
      if (
        this.product &&
        this.product.uploadedFiles &&
        this.product.uploadedFiles.length
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    sanitizeDisplayText(text) {
      const sanitizedText = sanitizeDisplayText(text);
      return sanitizedText;
    },
    openDialogFoldersList() {
      const postData = {
        title: this.title,
        id: this.postId,
        user: this.user,
        image: "",
        topics: this.topics,
      };
      if (this.imagesList && this.imagesList.length > 0) {
        postData.image = this.imagesList[0];
      }
      this.$q.dialog({
        component: DialogFoldersList,
        componentProps: {
          postData,
          source: "post bottom",
        },
      });
    },
  },
  mounted() {
    console.log("In detail: ", this.product);
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

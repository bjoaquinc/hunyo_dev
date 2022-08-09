<template>
  <div v-if="userData">
    <q-card
      class="q-py-xs container items-start row"
      flat
      bordered
      v-if="userData"
    >
      <q-item class="col q-ml-xs q-mr-xs no-padding" clickable>
        <q-img
          src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2F0d0102db-feb1-42ee-b52c-eac612841011?alt=media&token=308c4929-a00d-4e64-8293-b30506e9d6f2"
          :ratio="1"
        />
      </q-item>
      <q-item class="col q-mr-xs no-padding" clickable>
        <q-img
          src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2F8677c32b-a148-4d4b-928e-7a88025cdae5?alt=media&token=923c5f50-bc03-47f5-af0a-44a83fe31374"
          :ratio="1"
        />
      </q-item>
      <q-item class="col q-mr-xs no-padding" clickable>
        <q-img
          src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2Fc3bb5406-924c-4065-847c-56366305cb11?alt=media&token=b047858e-152e-4356-a732-33e785a176a1"
          :ratio="1"
        />
      </q-item>
    </q-card>
    <q-card
      class="q-pa-md q-mt-md bg-white container items-start row"
      flat
      bordered
      v-if="userData"
    >
      <div class="col-3 q-mr-md">
        <q-img ratio="1" :src="userData.photoURL" />
      </div>
      <div class="col-8">
        <div class="text-h6">
          Eurobel Rugs + Carpets Product Catalogue
          <span
            ><q-btn class="text-h6" no-caps flat color="primary" dense
              >(2 Reviews)</q-btn
            ></span
          >
        </div>
        <div class="text-subtitle1 q-mt-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
          tempore inventore dolorem sapiente, illum in iure ad ea nobis laborum
          vero sunt ut voluptate ipsam ipsa, unde, quam nulla blanditiis. Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Delectus tempore
          inventore dolorem sapiente, illum in iure ad ea nobis laborum vero
          sunt ut voluptate ipsam ipsa, unde, quam nulla blanditiis.
        </div>
        <div class="row q-mt-sm">
          <q-btn
            class="col"
            color="primary"
            icon="fas fa-phone"
            label="Contact Us"
            outline
          />
          <q-btn
            class="col"
            color="primary"
            flat
            icon="fas fa-globe"
            label="Website"
          />
          <q-btn
            class="col"
            color="primary"
            flat
            icon="fab fa-facebook"
            label="Facebook"
          />
        </div>
      </div>
    </q-card>
    <q-card class="q-mt-md" bordered flat>
      <div class="flex justify-between items-center">
        <q-btn-dropdown
          class="text-h5"
          no-caps
          flat
          color="secondary"
          label="All Products (34)"
        >
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>All Products (34)</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Interior Wall (17)</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Exterior Wall (10)</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Roofing (7)</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          flat
          label="See more >>"
          class="text-weight-bolder"
          color="primary"
          no-caps
        />
      </div>
      <q-card-section class="flex justify-between">
        <q-item
          class="flex column no-padding"
          style="min-width: 24%"
          to="/products/vYnRD3rPTU1iX5Aikwve/"
          clickable
        >
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2F64380e30-210c-49fe-907d-abfde8fd12c5?alt=media&token=5dadceb0-2905-4394-8cf3-3fdd59acafc2"
          />
          <q-item-label
            style="padding: 8px 0 !important"
            class="text-subtitle1 flex items-center"
            >Cyrus Collection</q-item-label
          >
        </q-item>
        <q-item class="flex column no-padding" style="min-width: 24%" clickable>
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2F0d0102db-feb1-42ee-b52c-eac612841011?alt=media&token=308c4929-a00d-4e64-8293-b30506e9d6f2"
          />
          <q-item-label
            style="padding: 8px 0 !important"
            class="text-subtitle1 flex items-center"
            >Charlotte Collection</q-item-label
          >
        </q-item>
        <q-item class="flex column no-padding" style="min-width: 24%" clickable>
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2Fc3bb5406-924c-4065-847c-56366305cb11?alt=media&token=b047858e-152e-4356-a732-33e785a176a1"
          />
          <q-item-label
            style="padding: 8px 0 !important"
            class="text-subtitle1 flex items-center"
            >Nature Collection</q-item-label
          >
        </q-item>
        <q-item class="flex column no-padding" style="min-width: 24%" clickable>
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2F8677c32b-a148-4d4b-928e-7a88025cdae5?alt=media&token=923c5f50-bc03-47f5-af0a-44a83fe31374"
          />
          <q-item-label
            style="padding: 8px 0 !important"
            class="text-subtitle1 flex items-center"
            >Arianna Collection</q-item-label
          >
        </q-item>
        <q-item
          class="flex column no-padding"
          style="min-width: 24%"
          to="/products/vYnRD3rPTU1iX5Aikwve/"
          clickable
        >
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2F64380e30-210c-49fe-907d-abfde8fd12c5?alt=media&token=5dadceb0-2905-4394-8cf3-3fdd59acafc2"
          />
          <q-item-label
            style="padding: 8px 0 !important"
            class="text-subtitle1 flex items-center"
            >Cyrus Collection</q-item-label
          >
        </q-item>
        <q-item class="flex column no-padding" style="min-width: 24%" clickable>
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2F0d0102db-feb1-42ee-b52c-eac612841011?alt=media&token=308c4929-a00d-4e64-8293-b30506e9d6f2"
          />
          <q-item-label
            style="padding: 8px 0 !important"
            class="text-subtitle1 flex items-center"
            >Charlotte Collection</q-item-label
          >
        </q-item>
        <q-item class="flex column no-padding" style="min-width: 24%" clickable>
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2Fc3bb5406-924c-4065-847c-56366305cb11?alt=media&token=b047858e-152e-4356-a732-33e785a176a1"
          />
          <q-item-label
            style="padding: 8px 0 !important"
            class="text-subtitle1 flex items-center"
            >Nature Collection</q-item-label
          >
        </q-item>
        <q-item class="flex column no-padding" style="min-width: 24%" clickable>
          <q-img
            ratio="1"
            style="border: 1px solid rgba(0, 0, 0, 0.12)"
            src="http://localhost:9199/v0/b/hunyo-109e6.appspot.com/o/images%2FkqAPTLrLFr3MqkBVWCt6%2F8677c32b-a148-4d4b-928e-7a88025cdae5?alt=media&token=923c5f50-bc03-47f5-af0a-44a83fe31374"
          />
          <q-item-label
            style="padding: 8px 0 !important"
            class="text-subtitle1 flex items-center"
            >Arianna Collection</q-item-label
          >
        </q-item>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default {
  setup() {
    const q = useQuasar();
    const store = useStore();
    const user = computed(() => store.getters["auth/getUser"]);
    const userData = computed(() => store.getters["profile/getUserData"]);
    const feedItems = computed(() => store.getters["profile/getActivityFeed"]);
    const website = computed(() => {
      if (!userData.value.website) return null;
      const websiteSplit = userData.value.website.split(":");
      if (websiteSplit[0] === "http" || websiteSplit[0] === "https") {
        return userData.value.website;
      } else {
        const webURL = "https://" + userData.value.website;
        return webURL;
      }
    });

    async function setActivityFeed(userId) {
      try {
        await store.dispatch("profile/setActivityFeed", userId);
      } catch (error) {
        console.log(error);
      }
    }

    onMounted(async () => {
      await setActivityFeed(user.value.uid);
    });

    onUnmounted(() => {
      store.commit("profile/clearStateFeed");
    });

    return {
      userData,
      feedItems,
      website,
      q,
    };
  },
};
</script>

<style lang="sass" scoped>
.container
  width: 100%
  height: auto

.bio
  line-height: normal

.no-padding
  padding: 0 !important
</style>

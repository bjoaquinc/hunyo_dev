<template>
  <q-dialog @hide="onDialogHide" ref="dialogRef">
    <q-card style="min-width: 50%">
      <q-card-section class="row items-center">
        <div class="text-h6">Add Highlighted Products</div>
      </q-card-section>
      <q-card-section class="row items-center justify-between">
        <div class="row col-12">
          <q-input
            v-model="productOne"
            class="col-10"
            outlined
            :rules="[(val) => val.length === 20 || 'Invalide post id']"
            label="Product 1 id"
          />
          <q-input
            v-model="productOneIndex"
            class="col-2"
            style="padding-bottom: 20px"
            outlined
            label="index"
          />
        </div>
        <div class="row col-12">
          <q-input
            v-model="productTwo"
            class="col-10"
            outlined
            :rules="[(val) => val.length === 20 || 'Invalide post id']"
            label="Product 2 id"
          />
          <q-input
            v-model="productTwoIndex"
            class="col-2"
            style="padding-bottom: 20px"
            outlined
            label="index"
          />
        </div>
        <div class="row col-12">
          <q-input
            v-model="productThree"
            class="col-10"
            outlined
            :rules="[(val) => val.length === 20 || 'Invalide post id']"
            label="Product 3 id"
          />
          <q-input
            v-model="productThreeIndex"
            class="col-2"
            style="padding-bottom: 20px"
            outlined
            label="index"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat v-close-popup label="Cancel" color="primary" />
        <q-btn
          :disable="!hasProducts"
          label="Add Products"
          color="primary"
          @click="updateHighlightedProducts"
          unelevated
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  props: {
    supplierId: String,
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const store = useStore();
    const q = useQuasar();
    const supplier = computed(() => store.getters["suppliers/getSupplier"]);
    const productOne = ref("");
    const productOneIndex = ref(0);
    const productTwo = ref("");
    const productTwoIndex = ref(0);
    const productThree = ref("");
    const productThreeIndex = ref(0);
    const hasProducts = computed(() => {
      return productOne.value &&
        productOne.value.length === 20 &&
        productTwo.value &&
        productTwo.value.length === 20 &&
        productThree.value &&
        productThree.value.length === 20
        ? true
        : false;
    });

    onMounted(() => {
      if (supplier.value && supplier.value.highlightedProducts) {
        const highlightedProducts = supplier.value.highlightedProducts;
        console.log(highlightedProducts);
        productOne.value = highlightedProducts[0].id;
        productOneIndex.value = highlightedProducts[0].index;
        productTwo.value = highlightedProducts[1].id;
        productTwoIndex.value = highlightedProducts[1].index;
        productThree.value = highlightedProducts[2].id;
        productThreeIndex.value = highlightedProducts[2].index;
      } else {
        return;
      }
    });

    async function updateHighlightedProducts() {
      q.loading.show();
      try {
        const products = [
          { productId: productOne.value, index: productOneIndex.value },
          { productId: productTwo.value, index: productTwoIndex.value },
          { productId: productThree.value, index: productThreeIndex.value },
        ];
        await store.dispatch("products/updateHighlightedProducts", {
          products,
          supplierId: props.supplierId,
        });
        q.loading.hide();
        onDialogHide();
      } catch (error) {
        console.log(error);
        q.loading.hide();
      }
    }

    return {
      dialogRef,
      onDialogHide,
      productOne,
      productOneIndex,
      productTwo,
      productTwoIndex,
      productThree,
      productThreeIndex,
      hasProducts,
      updateHighlightedProducts,
    };
  },
};
</script>

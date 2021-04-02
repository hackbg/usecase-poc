<template>
  <body>
    <div class="container">
      <h2>Retailer</h2>

      <div class="row">
        <label>Address: </label>
        <p>{{ retailerAddress }}</p>
      </div>
      <div class="row">
        <div class="collection with-header">
          <p class="collection-header">Products</p>
          <p v-if="productsLoading">Loading...</p>
          <p v-else-if="!productsLoading && products.length === 0">
            No products in stock
          </p>
          <generic-item-hash
            v-else
            v-for="product in products"
            :key="product"
            :hash="product"
            @toggle="toggleProduct(product)"
            :class="{ active: product === this.selectedProduct.id }"
          ></generic-item-hash>
        </div>
        <div v-if="selectedProduct.id !== ''">
          <label>Product owners history: </label>
          <p v-if="selectedProductLoading">Loading...</p>
          <p
            v-else
            v-for="productOwner in selectedProduct.ownersHistory"
            :key="productOwner"
          >
            {{ productOwner }}
          </p>
        </div>
        <div class="collection with-header">
          <p class="collection-header">Product's sacks</p>
          <p v-if="selectedProductLoading">Loading...</p>
          <generic-item-hash
            v-else
            v-for="sack in selectedProduct.sacks"
            :key="sack"
            :hash="sack"
            @toggle="toggleSack(sack)"
            :class="{ active: sack === this.selectedSack.id }"
          ></generic-item-hash>
        </div>
        <div v-if="selectedSack.id !== ''">
          <label>Sack owners history: </label>
          <p v-if="selectedSackLoading">Loading...</p>
          <p
            v-else
            v-for="sackOwner in selectedSack.ownersHistory"
            :key="sackOwner"
          >
            {{ sackOwner }}
          </p>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import GenericItemHash from "./GenericItemHash.vue";

export default {
  components: {
    GenericItemHash,
  },
  props: ["productContract", "ownershipContract", "retailerAddress"],
  data() {
    return {
      productsLoading: false,
      selectedProductLoading: false,
      selectedSackLoading: false,
      products: [],
      selectedProduct: {
        id: "",
        ownersHistory: [],
        sacks: [],
      },
      selectedSack: {
        id: "",
        ownersHistory: [],
      },
    };
  },
  methods: {
    async loadRetailerProducts() {
      this.productsLoading = true;
      var products = await this.getItemsFromEvent(
        this.retailerAddress,
        "ProductOwnerChange",
        this.ownershipContract
      );
      for (const prod of products) {
        this.products.unshift(prod);
      }
      this.productsLoading = false;
    },
    async toggleProduct(prod) {
      if (this.selectedProduct.id === prod) {
        this.selectedProduct.id = "";
        this.selectedProduct.ownersHistory = [];
        this.selectedProduct.sacks = [];
        this.selectedSack.id = "";
        this.selectedSack.ownersHistory = [];
      } else {
        this.selectedProductLoading = true;
        this.selectedProduct.id = prod;
        this.selectedSack.id = "";
        this.selectedSack.ownersHistory = [];
        this.selectedProduct.ownersHistory = await this.getOwnersFromEvents(
          prod,
          "ProductOwnerChange",
          this.ownershipContract
        );
        this.selectedProduct.sacks = await this.productContract.methods
          .getSacks(prod)
          .call({ from: this.retailerAddress });
        this.selectedProductLoading = false;
      }
    },
    async toggleSack(sack) {
      if (this.selectedSack.id === sack) {
        this.selectedSack.id = "";
        this.selectedSack.ownersHistory = [];
      } else {
        this.selectedSackLoading = true;
        this.selectedSack.id = sack;
        this.selectedSack.ownersHistory = await this.getOwnersFromEvents(
          sack,
          "SackOwnerChange",
          this.ownershipContract
        );
        this.selectedSackLoading = false;
      }
    },
  },
  created() {
    this.loadRetailerProducts();
  },
};
</script>

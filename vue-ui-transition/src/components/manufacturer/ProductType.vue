<template>
  <div class="row">
    <label>Product type: </label>
    <select class="browser-default" v-model="productType">
      <option>Can-Ground</option>
      <option>Bag-Ground</option>
      <option>Bag-Beans</option>
      <option>Special-Edition-Beans</option>
    </select>
    <button
      class="waves-effect waves-light btn brown darken-4"
      @click="emitManufactureProduct"
    >
      Manufacture product
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productType: "",
    };
  },
  emits: ["manufactureProduct"],
  methods: {
    emitManufactureProduct() {
      if (this.productType === "") {
        alert("Please select a product type first!");
        return;
      }
      this.$emit("manufactureProduct", this.productType);
    },
  },
};
</script>

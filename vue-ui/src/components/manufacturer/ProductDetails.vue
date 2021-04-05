<template>
  <label>Manufacturer address:</label>
  <p id="product-details-address">{{ manufacturer }}</p>
  <label>Product type:</label>
  <p id="product-details-bean-type">{{ productType }}</p>
  <label>Sacks:</label>
  <p v-if="productSacks.length === 0"></p>
  <p v-else v-for="sack in productSacks" :key="sack">
    {{ sack }}
  </p>
  <label>Manufacture date:</label>
  <p>{{ manufactureDate }}</p>
</template>

<script>
export default {
  props: {
    manufacturer: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    manufactureDate: {
      type: String,
      required: true,
    },
    productSacks: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped></style>

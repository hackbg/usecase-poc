<template>
  <label>Harvester address:</label>
  <p>{{ address }}</p>
  <label>Bean type:</label>
  <p>{{ beanType }}</p>
  <label>Creation date:</label>
  <p>{{ productionDate }}</p>
</template>

<script>
export default {
  props: {
    address: {
      type: String,
      required: true,
    },
    beanType: {
      type: String,
      required: true,
    },
    productionDate: {
      type: String,
      required: true,
    },
  },
};
</script>

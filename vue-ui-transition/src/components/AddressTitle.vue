<template>
  <h2>{{ title }}</h2>
  <div class="row">
    <label>Address</label>
    <p>{{ address }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
};
</script>

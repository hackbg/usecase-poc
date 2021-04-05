<template>
  <div class="row">
    <label>Bean type: </label>
    <select id="harvest-bean-type" class="browser-default" v-model="beanType">
      <option>Arabica</option>
      <option>Robusta</option>
      <option>Liberica</option>
      <option>Excelsa</option>
    </select>
    <button
      id="harvest-sack"
      class="waves-effect waves-light btn brown darken-4"
      @click="emitHarvestSack"
    >
      Harvest sack
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      beanType: "",
    };
  },
  emits: ["harvestSack"],
  methods: {
    emitHarvestSack() {
      if (this.beanType === "") {
        alert("Please select a bean type first!");
        return;
      }
      this.$emit("harvestSack", this.beanType);
    },
  },
};
</script>

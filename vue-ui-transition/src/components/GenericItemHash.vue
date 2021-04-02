<template>
  <p class="collection-item" @click="toggleSelection">
    <a>{{ hash }}</a>
  </p>
</template>

<script>
export default {
  data() {
    return {
      isSelected: false,
    };
  },
  props: {
    hash: {
      type: String,
      required: true,
    },
  },
  emits: ["toggle"],
  methods: {
    toggleSelection() {
      this.$emit("toggle");
    },
  },
};
</script>

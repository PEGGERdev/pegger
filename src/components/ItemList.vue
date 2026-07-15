<script setup>
import ItemCard from './ItemCard.vue'

defineProps({
  items: {
    type: Array,
    required: true
  },
  variant: {
    type: String,
    default: 'default'
  }
})

defineEmits(['item-click'])
</script>

<template>
  <div class="item-list">
    <ItemCard
      v-for="(item, index) in items"
      :key="index"
      :item="item"
      :variant="variant"
    />
  </div>
</template>

<style scoped>
.item-list {
  display: grid;
  gap: 0.75rem;
}
</style>
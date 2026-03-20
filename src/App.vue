<script setup>
import { ref } from 'vue'
import StarMap from './components/StarMap.vue'
import StarField from './components/StarField.vue'

const activePanel = ref(null)

function handleStarClick(starId) {
  activePanel.value = starId
}

function closePanel() {
  activePanel.value = null
}
</script>

<template>
  <div class="app-shell">
    <div class="orb orb--one" />
    <div class="orb orb--two" />
    <div class="orb orb--three" />

    <StarField />

    <main class="star-map-container">
      <StarMap @star-click="handleStarClick" />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  overflow: hidden;
}

.star-map-container {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useMouse } from '@vueuse/core'
import { starMapData } from '@/data/starMapData'
import Star from './Star.vue'
import CenterPresence from './CenterPresence.vue'
import ConstellationLines from './ConstellationLines.vue'

const emit = defineEmits(['star-click'])

const containerRef = ref(null)
const { x: mouseX, y: mouseY } = useMouse()

const centerPosition = ref({ x: 0, y: 0 })

const allStars = computed(() => {
  return [...starMapData.brightStars, ...starMapData.dimStars]
})

const starPositions = computed(() => {
  const positions = {}
  allStars.value.forEach(star => {
    const key = `${star.id}-x`
    const yKey = `${star.id}-y`
    if (containerRef.value) {
      positions[star.id] = {
        x: centerPosition.value.x + (star.position.x / 100) * 300,
        y: centerPosition.value.y + (star.position.y / 100) * 250
      }
    }
  })
  return positions
})

const hoveredStarId = ref(null)

function handleStarHover(starId) {
  hoveredStarId.value = starId
}

function handleStarClick(starId) {
  const star = allStars.value.find(s => s.id === starId)
  if (star && star.panel) {
    emit('star-click', star.panel)
  }
}

function updateCenterPosition() {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    centerPosition.value = {
      x: rect.width / 2,
      y: rect.height / 2
    }
  }
}

onMounted(() => {
  updateCenterPosition()
  window.addEventListener('resize', updateCenterPosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCenterPosition)
})
</script>

<template>
  <div ref="containerRef" class="star-map">
    <ConstellationLines
      :connections="starMapData.connections"
      :positions="starPositions"
      :center="centerPosition"
      :hovered-star="hoveredStarId"
    />

    <CenterPresence
      :center="starMapData.center"
      :position="centerPosition"
    />

    <Star
      v-for="star in starMapData.brightStars"
      :key="star.id"
      :star="star"
      :center="centerPosition"
      :mouse-x="mouseX"
      :mouse-y="mouseY"
      @hover="handleStarHover"
      @click="handleStarClick"
    />

    <Star
      v-for="star in starMapData.dimStars"
      :key="star.id"
      :star="star"
      :center="centerPosition"
      :mouse-x="mouseX"
      :mouse-y="mouseY"
      @hover="handleStarHover"
      @click="handleStarClick"
    />
  </div>
</template>

<style scoped>
.star-map {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

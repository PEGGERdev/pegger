<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)

const STAR_COUNT = 100
let animationId = null
let handleResize = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const stars = []

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    if (reducedMotion && stars.length > 0) {
      animate()
    }
  }

  resize()
  handleResize = resize
  window.addEventListener('resize', handleResize)

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.1,
      driftY: (Math.random() - 0.5) * 0.1,
      baseX: 0,
      baseY: 0
    })
    stars[stars.length - 1].baseX = stars[stars.length - 1].x
    stars[stars.length - 1].baseY = stars[stars.length - 1].y
  }

  let time = 0

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    time += 16

    stars.forEach(star => {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7
      const opacity = star.opacity * twinkle

      if (!reducedMotion) {
        star.x += star.driftX
        star.y += star.driftY
      }

      if (star.x < 0) star.x = canvas.width
      if (star.x > canvas.width) star.x = 0
      if (star.y < 0) star.y = canvas.height
      if (star.y > canvas.height) star.y = 0

      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.fill()
    })

    if (!reducedMotion) {
      animationId = requestAnimationFrame(animate)
    }
  }

  animate()
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  if (handleResize) {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<template>
  <canvas ref="canvasRef" class="star-field" />
</template>

<style scoped>
.star-field {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>

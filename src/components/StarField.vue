<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
const STAR_COUNT = 110

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
  }

  resize()
  window.addEventListener('resize', resize)

  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x:             Math.random() * canvas.width,
    y:             Math.random() * canvas.height,
    size:          Math.random() * 1.6 + 0.4,
    baseOpacity:   Math.random() * 0.36 + 0.14,
    twinkleSpeed:  Math.random() * 0.018 + 0.004,
    twinkleOffset: Math.random() * Math.PI * 2,
    driftX:        (Math.random() - 0.5) * 0.08,
    driftY:        (Math.random() - 0.5) * 0.08,
  }))

  let animId
  let time = 0

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    time += 16

    for (const s of stars) {
      const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.28 + 0.72
      const opacity = s.baseOpacity * twinkle
      s.x += s.driftX
      s.y += s.driftY
      if (s.x < 0)              s.x = canvas.width
      if (s.x > canvas.width)   s.x = 0
      if (s.y < 0)              s.y = canvas.height
      if (s.y > canvas.height)  s.y = 0
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${opacity})`
      ctx.fill()
    }

    animId = requestAnimationFrame(animate)
  }

  animate()

  onUnmounted(() => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <canvas ref="canvasRef" class="star-field" aria-hidden="true" />
</template>

<style scoped>
.star-field {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>

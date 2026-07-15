<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)

const SEED = 1731
const FIELD_STARS = 500
const NEBULA_CLOUDS = 6
const SPIRAL_ARMS = 3
const ARM_TIGHTNESS = 3.2

let animationId = null
let handleResize = null

function createRng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const stellarTemperatures = [
  { r: 155, g: 176, b: 255, label: 'hot' },
  { r: 200, g: 220, b: 255, label: 'warm' },
  { r: 255, g: 235, b: 200, label: 'cool' },
  { r: 255, g: 200, b: 150, label: 'cool' },
]

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const rng = createRng(SEED)
  const centerX = window.innerWidth * 0.55
  const centerY = window.innerHeight * 0.48
  const galaxyRadius = Math.min(window.innerWidth, window.innerHeight) * 0.5

  let stars = []
  let nebulae = []

  function generateGalaxy(cx, cy, radius) {
    nebulaColors.forEach((color, i) => {
      const angle = (i / NEBULA_CLOUDS) * Math.PI * 2 + rng() * 0.6
      const dist = radius * (0.2 + rng() * 0.5)
      nebulae.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        radius: radius * (0.15 + rng() * 0.25),
        r: color.r,
        g: color.g,
        b: color.b,
        opacity: 0.03 + rng() * 0.04,
      })
    })

    for (let i = 0; i < FIELD_STARS; i++) {
      const armIndex = Math.floor(rng() * SPIRAL_ARMS)
      const armAngle = (armIndex / SPIRAL_ARMS) * Math.PI * 2
      const radiusFraction = Math.pow(rng(), 0.6)
      const scatter = (1 - radiusFraction * 0.6) * 0.25 + 0.05
      const angleOffset = (rng() - 0.5) * scatter * Math.PI * 2
      const angle = armAngle + radiusFraction * ARM_TIGHTNESS + angleOffset
      const dist = radius * radiusFraction * (0.85 + rng() * 0.15)

      const x = cx + Math.cos(angle) * dist
      const y = cy + Math.sin(angle) * dist
      const coreDist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / radius
      const size = (0.4 + rng() * 0.8) * (1.4 - coreDist * 0.6)
      const temp = stellarTemperatures[Math.floor(rng() * stellarTemperatures.length)]
      const twinkleSpeed = 0.005 + rng() * 0.015
      const twinkleOffset = rng() * Math.PI * 2

      stars.push({ x, y, size, r: temp.r, g: temp.g, b: temp.b, twinkleSpeed, twinkleOffset })
    }

    for (let i = 0; i < 60; i++) {
      const angle = rng() * Math.PI * 2
      const dist = galaxyRadius * Math.pow(rng(), 0.3) * 0.15
      const x = cx + Math.cos(angle) * dist
      const y = cy + Math.sin(angle) * dist
      const size = 0.3 + rng() * 0.5
      const temp = stellarTemperatures[Math.floor(rng() * 3)]
      stars.push({
        x, y, size,
        r: Math.min(255, temp.r + 40),
        g: Math.min(255, temp.g + 30),
        b: 255,
        twinkleSpeed: 0.008 + rng() * 0.012,
        twinkleOffset: rng() * Math.PI * 2,
      })
    }
  }

  const nebulaColors = [
    { r: 80, g: 40, b: 120 },
    { r: 40, g: 60, b: 140 },
    { r: 120, g: 50, b: 80 },
    { r: 60, g: 30, b: 100 },
    { r: 30, g: 50, b: 130 },
    { r: 100, g: 40, b: 100 },
    { r: 50, g: 80, b: 120 },
    { r: 90, g: 35, b: 110 },
  ]

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const cx = window.innerWidth * 0.55
    const cy = window.innerHeight * 0.48
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.5
    stars = []
    nebulae = []
    generateGalaxy(cx, cy, radius)
    if (reducedMotion) {
      drawFrame(0)
    }
  }

  resize()
  handleResize = resize
  window.addEventListener('resize', handleResize)

  let time = 0

  function drawFrame(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    time += 16

    nebulae.forEach(n => {
      const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius)
      gradient.addColorStop(0, `rgba(${n.r}, ${n.g}, ${n.b}, ${n.opacity * 1.5})`)
      gradient.addColorStop(0.4, `rgba(${n.r}, ${n.g}, ${n.b}, ${n.opacity})`)
      gradient.addColorStop(1, `rgba(${n.r}, ${n.g}, ${n.b}, 0)`)
      ctx.fillStyle = gradient
      ctx.fillRect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2)
    })

    const timeInSec = now ? now / 1000 : time / 1000

    stars.forEach(star => {
      const twinkle = reducedMotion ? 1 : Math.sin(timeInSec * star.twinkleSpeed * 10 + star.twinkleOffset) * 0.25 + 0.75
      const alpha = Math.max(0.15, twinkle * 0.7)

      ctx.beginPath()
      ctx.arc(star.x, star.y, Math.max(0.3, star.size * (0.8 + twinkle * 0.2)), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${alpha})`
      ctx.fill()

      if (star.size > 0.7) {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 1.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${alpha * 0.08})`
        ctx.fill()
      }
    })

    if (!reducedMotion) {
      animationId = requestAnimationFrame(drawFrame)
    }
  }

  drawFrame(0)
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

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)

const SEED = 1731
const FIELD_STARS = 1000
const NEBULA_CLOUDS = 10
const SPIRAL_ARMS = 3
const ARM_TIGHTNESS = 3.6

let animationId = null
let handleResize = null

function createRng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function gaussianRng(rng) {
  const u1 = rng()
  const u2 = rng()
  return Math.sqrt(-2 * Math.log(u1 + 0.0001)) * Math.cos(2 * Math.PI * u2)
}

const stellarClasses = [
  { r: 170, g: 190, b: 255, label: 'O', weight: 0.03 },
  { r: 200, g: 215, b: 255, label: 'B', weight: 0.08 },
  { r: 225, g: 235, b: 255, label: 'A', weight: 0.12 },
  { r: 245, g: 245, b: 255, label: 'F', weight: 0.15 },
  { r: 255, g: 245, b: 230, label: 'G', weight: 0.20 },
  { r: 255, g: 225, b: 190, label: 'K', weight: 0.22 },
  { r: 255, g: 190, b: 140, label: 'M', weight: 0.15 },
  { r: 210, g: 140, b: 255, label: 'rare-hg', weight: 0.03 },
  { r: 255, g: 140, b: 180, label: 'rare-sg', weight: 0.02 },
]

function pickStellarClass(rng) {
  const roll = rng()
  let cumulative = 0
  for (const cls of stellarClasses) {
    cumulative += cls.weight
    if (roll < cumulative) return cls
  }
  return stellarClasses[stellarClasses.length - 1]
}

function dustAttenuation(angle, armCount) {
  const armWidth = (Math.PI * 2) / armCount
  const distToArm = Math.abs(((angle % armWidth) + armWidth) % armWidth - armWidth / 2)
  const normalized = distToArm / (armWidth / 2)
  const dust = Math.pow(normalized, 1.6) * 0.55
  return Math.min(dust, 0.5)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const rng = createRng(SEED)

  let stars = []
  let nebulae = []
  let coreGlow = null
  let dustMap = []

  function generateGalaxy(cx, cy, radius) {
    nebulae = []
    dustMap = []

    for (let i = 0; i < NEBULA_CLOUDS; i++) {
      const angle = (i / NEBULA_CLOUDS) * Math.PI * 2 + rng() * 0.5
      const dist = radius * (0.15 + rng() * 0.55)
      const r = 30 + rng() * 80 | 0
      const g = 20 + rng() * 60 | 0
      const b = 60 + rng() * 100 | 0
      const layerCount = 2 + Math.floor(rng() * 3)
      const layers = []

      for (let j = 0; j < layerCount; j++) {
        const spread = 0.12 + rng() * 0.3
        layers.push({
          ox: (rng() - 0.5) * spread * radius * 0.3,
          oy: (rng() - 0.5) * spread * radius * 0.3,
          r: radius * (0.08 + rng() * 0.22 + j * 0.04),
          opacity: 0.025 + rng() * 0.04 + j * 0.01,
        })
      }

      nebulae.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        r, g, b,
        layers,
      })
    }

    for (let i = 0; i < FIELD_STARS; i++) {
      const isBulge = i < FIELD_STARS * 0.15
      let x, y, coreDist

      if (isBulge) {
        const bulgeRadius = radius * 0.12
        const gx = gaussianRng(rng)
        const gy = gaussianRng(rng)
        x = cx + gx * bulgeRadius * 0.3
        y = cy + gy * bulgeRadius * 0.3
        coreDist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / radius
      } else {
        const armIndex = Math.floor(rng() * SPIRAL_ARMS)
        const armAngle = (armIndex / SPIRAL_ARMS) * Math.PI * 2
        const radiusFraction = Math.pow(rng(), 0.55)
        const scatter = (1 - radiusFraction * 0.5) * 0.18 + 0.04
        const angleOffset = (rng() - 0.5) * scatter * Math.PI * 2
        const angle = armAngle + radiusFraction * ARM_TIGHTNESS + angleOffset
        const dist = radius * radiusFraction * (0.88 + rng() * 0.12)
        x = cx + Math.cos(angle) * dist
        y = cy + Math.sin(angle) * dist
        coreDist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / radius
      }

      const cls = pickStellarClass(rng)
      const sizeVariation = 0.4 + rng() * 0.9
      const coreFactor = Math.max(0.3, 1.4 - coreDist * 0.7)
      const size = sizeVariation * coreFactor * 0.6

      const rVariation = (rng() - 0.5) * 20
      const gVariation = (rng() - 0.5) * 20
      const bVariation = (rng() - 0.5) * 20

      const starAngle = Math.atan2(y - cy, x - cx)
      const dust = isBulge ? 0 : dustAttenuation(starAngle, SPIRAL_ARMS)
      const opacity = Math.max(0.2, 1 - dust * 1.8)

      stars.push({
        x, y, size,
        r: Math.max(0, Math.min(255, cls.r + rVariation)) | 0,
        g: Math.max(0, Math.min(255, cls.g + gVariation)) | 0,
        b: Math.max(0, Math.min(255, cls.b + bVariation)) | 0,
        twinkleSpeed: 0.004 + rng() * 0.018,
        twinkleOffset: rng() * Math.PI * 2,
        opacity,
        isBulge,
        coreDist,
      })
    }

    stars.sort((a, b) => a.size - b.size)

    coreGlow = {
      x: cx,
      y: cy,
      radius: radius * 0.18,
      r: 255, g: 230, b: 200,
      opacity: 1,
    }
  }

  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w
    canvas.height = h
    const cx = w * 0.55
    const cy = h * 0.48
    const radius = Math.min(w, h) * 0.5
    stars = []
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

    ctx.fillStyle = 'rgba(3, 6, 14, 1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    nebulae.forEach(n => {
      n.layers.forEach(layer => {
        const gradient = ctx.createRadialGradient(
          n.x + layer.ox, n.y + layer.oy, 0,
          n.x + layer.ox, n.y + layer.oy, layer.r,
        )
        gradient.addColorStop(0, `rgba(${n.r}, ${n.g}, ${n.b}, ${layer.opacity * 1.4})`)
        gradient.addColorStop(0.3, `rgba(${n.r}, ${n.g}, ${n.b}, ${layer.opacity})`)
        gradient.addColorStop(0.7, `rgba(${n.r + 20}, ${n.g + 15}, ${n.b + 30}, ${layer.opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(${n.r}, ${n.g}, ${n.b}, 0)`)
        ctx.fillStyle = gradient
        ctx.fillRect(n.x + layer.ox - layer.r, n.y + layer.oy - layer.r, layer.r * 2, layer.r * 2)
      })
    })

    if (coreGlow) {
      const cg = coreGlow
      const coreGrad = ctx.createRadialGradient(cg.x, cg.y, 0, cg.x, cg.y, cg.radius)
      coreGrad.addColorStop(0, 'rgba(255, 240, 220, 0.25)')
      coreGrad.addColorStop(0.2, 'rgba(255, 220, 180, 0.15)')
      coreGrad.addColorStop(0.5, 'rgba(200, 180, 220, 0.06)')
      coreGrad.addColorStop(1, 'rgba(150, 140, 200, 0)')
      ctx.fillStyle = coreGrad
      ctx.fillRect(cg.x - cg.radius, cg.y - cg.radius, cg.radius * 2, cg.radius * 2)

      const brightGrad = ctx.createRadialGradient(cg.x, cg.y, 0, cg.x, cg.y, cg.radius * 0.3)
      brightGrad.addColorStop(0, 'rgba(255, 245, 230, 0.4)')
      brightGrad.addColorStop(0.5, 'rgba(255, 220, 190, 0.1)')
      brightGrad.addColorStop(1, 'rgba(255, 200, 180, 0)')
      ctx.fillStyle = brightGrad
      ctx.fillRect(cg.x - cg.radius * 0.3, cg.y - cg.radius * 0.3, cg.radius * 0.6, cg.radius * 0.6)
    }

    const timeInSec = now ? now / 1000 : time / 1000

    stars.forEach(star => {
      const twinkle = reducedMotion ? 1 : Math.sin(timeInSec * star.twinkleSpeed * 10 + star.twinkleOffset) * 0.2 + 0.8
      const alpha = Math.max(0.08, star.opacity * twinkle * 0.85)
      const drawSize = Math.max(0.2, star.size * (0.85 + twinkle * 0.15))

      ctx.beginPath()
      ctx.arc(star.x, star.y, drawSize, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${alpha})`
      ctx.fill()

      if (star.size > 0.5) {
        ctx.beginPath()
        ctx.arc(star.x, star.y, drawSize * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${alpha * 0.06})`
        ctx.fill()
      }

      if (star.size > 0.8) {
        ctx.beginPath()
        ctx.arc(star.x, star.y, drawSize * 5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${alpha * 0.015})`
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

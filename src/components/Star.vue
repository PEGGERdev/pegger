<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import theme from '@/config/theme'

const props = defineProps({
  star: {
    type: Object,
    required: true
  },
  position: {
    type: Object,
    required: true
  },
  mouseX: {
    type: Number,
    default: 0
  },
  mouseY: {
    type: Number,
    default: 0
  },
  selected: {
    type: Boolean,
    default: false
  },
  connected: {
    type: Boolean,
    default: false
  },
  muted: {
    type: Boolean,
    default: false
  },
  detailLevel: {
    type: String,
    default: 'overview'
  }
})

const emit = defineEmits(['hover', 'click', 'position-change'])

const starRef = ref(null)
const offset = ref({ x: 0, y: 0 })
const isHovered = ref(false)
const driftSeed = [...props.star.id].reduce((total, character) => total + character.charCodeAt(0), 0)
const driftDuration = `${(props.star.type === 'bright' ? 3.6 : 4.4) + (driftSeed % 7) * 0.18}s`
const driftDelay = `${(driftSeed % 5) * 0.22}s`

const MAGNETIC_RANGE = theme.animations.magneticRange * 1.15
const ATTRACTION_STRENGTH = theme.animations.magneticStrength * 0.95

const position = computed(() => {
  return {
    x: props.position.x + offset.value.x,
    y: props.position.y + offset.value.y
  }
})

function emitPosition() {
  emit('position-change', {
    id: props.star.id,
    position: position.value
  })
}

watch(
  () => [props.position.x, props.position.y],
  emitPosition,
  { flush: 'post' },
)

const size = computed(() => {
  if (props.selected) {
    return props.star.type === 'bright' ? theme.starSizes.bright + 14 : theme.starSizes.dim + 12
  }

  if (props.connected) {
    return props.star.type === 'bright' ? theme.starSizes.bright + 4 : theme.starSizes.dim + 6
  }

  if (props.star.type === 'bright') {
    return props.star.size || theme.starSizes.bright
  }
  return theme.starSizes.dim
})

const style = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  transform: `translate(-50%, -50%)`,
  '--drift-duration': driftDuration,
  '--drift-delay': driftDelay,
  '--star-opacity': props.muted ? 0.24 : 1,
}))

const coreClass = computed(() => {
  return `star__core star__core--${props.star.type}`
})

const brightness = computed(() => {
  if (isHovered.value) return 1
  if (props.selected) return 1
  if (props.connected) return props.star.type === 'bright' ? 0.95 : 0.72
  if (props.star.type === 'bright') return 0.8
  return 0.3
})

const showLabel = computed(() => {
  return props.detailLevel !== 'overview' || isHovered.value || props.selected || props.connected
})

const showMeta = computed(() => {
  return props.selected || (props.connected && isHovered.value)
})

const detailText = computed(() => {
  if (props.star.data?.description) {
    return props.star.data.description
  }

  return props.star.category || ''
})

const ariaLabel = computed(() => {
  const parts = [props.star.label]

  if (props.star.category) {
    parts.push(props.star.category)
  }

  if (detailText.value) {
    parts.push(detailText.value)
  }

  return parts.join('. ')
})

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

let animationFrame = null
let reducedMotion = false

function updateAttraction() {
  if (!starRef.value) {
    animationFrame = requestAnimationFrame(updateAttraction)
    return
  }

  const rect = starRef.value.getBoundingClientRect()
  const starX = rect.left + rect.width / 2
  const starY = rect.top + rect.height / 2

  const deltaX = props.mouseX - starX
  const deltaY = props.mouseY - starY
  const distance = calculateDistance(props.mouseX, props.mouseY, starX, starY)

  if (distance < MAGNETIC_RANGE) {
    const normalizedDistance = 1 - (distance / MAGNETIC_RANGE)
    const followFactor = Math.min(0.6, normalizedDistance * (0.55 + ATTRACTION_STRENGTH * 3.2))
    const easedFactor = followFactor ** 1.85
    offset.value = {
      x: deltaX * easedFactor,
      y: deltaY * easedFactor
    }
  } else {
    offset.value = {
      x: offset.value.x * 0.88,
      y: offset.value.y * 0.88
    }
  }

  emitPosition()

  animationFrame = requestAnimationFrame(updateAttraction)
}

function handleMouseEnter() {
  isHovered.value = true
  emit('hover', props.star.id)
}

function handleMouseLeave() {
  isHovered.value = false
  emit('hover', null)
}

function handleClick() {
  emit('click', props.star.id)
}

onMounted(() => {
  emitPosition()
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!reducedMotion) {
    animationFrame = requestAnimationFrame(updateAttraction)
  }
})

onUnmounted(() => {
  emit('position-change', {
    id: props.star.id,
    position: props.position
  })
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <button
    ref="starRef"
    type="button"
    :style="style"
    :aria-label="ariaLabel"
    class="star"
    :class="[
      `star--${star.type}`,
      {
        'star--hovered': isHovered,
        'star--selected': selected,
        'star--connected': connected,
        'star--muted': muted,
      }
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focus="handleMouseEnter"
    @blur="handleMouseLeave"
    @click="handleClick"
  >
    <div
      class="star__core-wrapper"
      :class="coreClass"
      :style="{
        width: `${size}px`,
        height: `${size}px`,
        opacity: brightness
      }"
    >
      <i v-if="star.icon" :class="['star__icon', star.icon]" />
      <span v-if="star.badge || star.data?.badge" class="star__badge">{{ star.badge || star.data?.badge }}</span>
      <span v-if="star.category && showMeta" class="star__kicker">{{ star.category }}</span>
    </div>
    <div v-if="showLabel" class="star__label" :class="{ 'star__label--selected': selected }">
      <span class="star__label-title">{{ star.label }}</span>
      <span v-if="showMeta && detailText" class="star__label-meta">{{ detailText }}</span>
    </div>
  </button>
</template>

<style scoped>
.star {
  position: absolute;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  transition: opacity 200ms ease, left 420ms cubic-bezier(0.22, 1, 0.36, 1), top 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms ease;
  will-change: transform;
  animation: starDrift var(--drift-duration, 4s) ease-in-out infinite;
  animation-delay: var(--drift-delay, 0s);
  z-index: 4;
  opacity: var(--star-opacity, 1);
}

.star::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(73, 197, 182, 0.36), rgba(90, 167, 255, 0.12) 46%, transparent 72%);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.4);
}

.star--selected::before {
  animation: starExpansion 700ms ease-out both;
}

@keyframes starExpansion {
  0% {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(0.4);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(3.2);
  }
}

.star:focus-visible {
  outline: none;
}

.star--bright {
  z-index: 6;
}

@keyframes starDrift {
  0%, 100% {
    filter: brightness(1);
  }
  25% {
    filter: brightness(1.05);
  }
  50% {
    filter: brightness(0.95);
  }
  75% {
    filter: brightness(1.02);
  }
}

.star__core-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: transform 200ms ease, box-shadow 300ms ease, filter 300ms ease;
}

.star--selected .star__core-wrapper {
  box-shadow: 0 0 30px rgba(95, 208, 191, 0.45), 0 0 80px rgba(47, 110, 168, 0.24);
}

.star--connected .star__core-wrapper {
  box-shadow: 0 0 24px rgba(95, 208, 191, 0.24), 0 0 48px rgba(95, 208, 191, 0.12);
}

.star__core--bright {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.98) 0%, rgba(95, 208, 191, 0.92) 22%, rgba(31, 124, 114, 0.86) 58%, transparent 78%);
  box-shadow: 0 0 20px rgba(31, 124, 114, 0.5), 0 0 46px rgba(31, 124, 114, 0.28), 0 0 80px rgba(47, 110, 168, 0.12);
}

.star__core--dim {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(138, 176, 221, 0.22) 40%, transparent 74%);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.18), 0 0 28px rgba(98, 142, 190, 0.08);
}

.star:hover .star__core-wrapper {
  transform: scale(1.15);
  filter: saturate(1.15);
}

.star:focus-visible .star__core-wrapper {
  transform: scale(1.12);
  box-shadow: 0 0 0 3px rgba(90, 167, 255, 0.42), 0 0 30px rgba(90, 167, 255, 0.2);
}

.star:hover .star__core--bright {
  box-shadow: 0 0 30px rgba(31, 124, 114, 0.7), 0 0 60px rgba(31, 124, 114, 0.5);
}

.star:hover .star__core--dim {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
}

.star__icon {
  font-size: 1rem;
  color: #fff;
}

.star__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  padding: 2px 6px;
  font-size: 0.6rem;
  font-weight: 700;
  background: var(--pegger-orange, #ea580c);
  color: #fff;
  border-radius: 4px;
}

.star__kicker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% - 2rem));
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  background: rgba(7, 12, 22, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.74);
}

.star__label {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: max-content;
  max-width: 16rem;
  padding: 0.35rem 0.55rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  display: grid;
  gap: 0.15rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.84);
  background: rgba(7, 12, 22, 0.68);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.22);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  opacity: 1;
  transition: opacity 200ms ease, transform 200ms ease, background 200ms ease;
}

.star__label--selected {
  padding: 0.55rem 0.8rem;
  border-radius: 1rem;
  background: rgba(7, 12, 22, 0.82);
}

.star__label-title {
  display: block;
}

.star__label-meta {
  display: block;
  max-width: 14rem;
  font-size: 0.68rem;
  font-weight: 500;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.62);
  white-space: normal;
}

.star:hover .star__label,
.star--hovered .star__label {
  transform: translateX(-50%) translateY(0);
}

.star--dim .star__label {
  font-size: 0.6rem;
}
</style>

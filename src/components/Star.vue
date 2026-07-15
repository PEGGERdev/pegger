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
  },
  tone: {
    type: String,
    default: 'mint'
  }
})

const emit = defineEmits(['hover', 'click', 'position-change'])

const starRef = ref(null)
const offset = ref({ x: 0, y: 0 })
const isHovered = ref(false)
const driftSeed = [...props.star.id].reduce((total, character) => total + character.charCodeAt(0), 0)
const driftDuration = `${(props.star.type === 'bright' ? 6.4 : 7.8) + (driftSeed % 7) * 0.24}s`
const rayDuration = `${(props.star.type === 'bright' ? 10.8 : 12.4) + (driftSeed % 5) * 0.42}s`
const driftDelay = `-${(driftSeed % 6) * 0.38}s`
const rayRotation = `${(driftSeed % 72) - 36}deg`

const MAGNETIC_RANGE = theme.animations.magneticRange * 1.15
const ATTRACTION_STRENGTH = theme.animations.magneticStrength * 0.95

const position = computed(() => {
  return {
    x: props.position.x + offset.value.x,
    y: props.position.y + offset.value.y
  }
})

const toneToken = computed(() => {
  return theme.clusterTones?.[props.tone] || theme.clusterTones?.mint || {
    color: theme.colors.primary,
    rgb: theme.colors.primaryRgb,
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

const hitSize = computed(() => Math.max(44, size.value + (props.star.type === 'bright' ? 8 : 14)))

const style = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  width: `${hitSize.value}px`,
  height: `${hitSize.value}px`,
  transform: `translate(-50%, -50%)`,
  '--drift-duration': driftDuration,
  '--ray-duration': rayDuration,
  '--drift-delay': driftDelay,
  '--ray-rotation': rayRotation,
  '--star-size': `${size.value}px`,
  '--star-color': toneToken.value.color,
  '--star-rgb': toneToken.value.rgb,
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
let velocity = { x: 0, y: 0 }

function clamp(value, limit) {
  return Math.max(-limit, Math.min(limit, value))
}

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
  let targetX = 0
  let targetY = 0

  if (distance < MAGNETIC_RANGE) {
    const normalizedDistance = 1 - (distance / MAGNETIC_RANGE)
    const followFactor = normalizedDistance ** 1.8 * (0.16 + ATTRACTION_STRENGTH * 1.5)
    const maxOffset = props.star.type === 'bright' ? 32 : 22
    targetX = clamp(deltaX * followFactor, maxOffset)
    targetY = clamp(deltaY * followFactor, maxOffset)
  }

  const stiffness = distance < MAGNETIC_RANGE ? 0.16 : 0.1
  const damping = 0.72
  velocity.x = (velocity.x + (targetX - offset.value.x) * stiffness) * damping
  velocity.y = (velocity.y + (targetY - offset.value.y) * stiffness) * damping

  const nextOffset = {
    x: offset.value.x + velocity.x,
    y: offset.value.y + velocity.y,
  }

  if (Math.abs(nextOffset.x) < 0.01 && Math.abs(velocity.x) < 0.01) {
    nextOffset.x = 0
    velocity.x = 0
  }

  if (Math.abs(nextOffset.y) < 0.01 && Math.abs(velocity.y) < 0.01) {
    nextOffset.y = 0
    velocity.y = 0
  }

  if (nextOffset.x !== offset.value.x || nextOffset.y !== offset.value.y) {
    offset.value = nextOffset
    emitPosition()
  }

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
    :aria-pressed="selected"
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
    <span
      class="star__core-wrapper"
      :class="coreClass"
      :style="{ opacity: brightness }"
      aria-hidden="true"
    >
      <span class="star__corona" />
      <span class="star__rays">
        <span class="star__ray star__ray--horizontal" />
        <span class="star__ray star__ray--vertical" />
        <span class="star__ray star__ray--diagonal-a" />
        <span class="star__ray star__ray--diagonal-b" />
      </span>
      <span class="star__orbit" />
      <span class="star__body">
        <span class="star__facet" />
        <i v-if="star.icon" :class="['star__icon', star.icon]" />
      </span>
      <span v-if="star.badge || star.data?.badge" class="star__badge">{{ star.badge || star.data?.badge }}</span>
      <span v-if="star.category && showMeta" class="star__kicker">{{ star.category }}</span>
    </span>
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
  transition:
    opacity 240ms ease,
    left 520ms cubic-bezier(0.22, 1, 0.36, 1),
    top 520ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 240ms ease;
  will-change: transform;
  z-index: 4;
  opacity: var(--star-opacity, 1);
}

.star::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(var(--star-size) * 1.2);
  height: calc(var(--star-size) * 1.2);
  border-radius: 50%;
  border: 1px solid rgba(var(--star-rgb), 0.5);
  box-shadow: 0 0 28px rgba(var(--star-rgb), 0.25);
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

.star__core-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--star-size);
  height: var(--star-size);
  transform: translate(-50%, -50%);
  transition: transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 260ms ease, filter 260ms ease;
}

.star__corona,
.star__rays,
.star__orbit,
.star__body,
.star__facet {
  position: absolute;
  pointer-events: none;
}

.star__corona {
  inset: -44%;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.24), rgba(var(--star-rgb), 0.2) 24%, rgba(var(--star-rgb), 0.07) 48%, transparent 72%);
  filter: blur(5px);
  animation: stellarCorona var(--drift-duration, 7s) ease-in-out infinite;
  animation-delay: var(--drift-delay, 0s);
}

.star__rays {
  inset: -46%;
  transform: rotate(var(--ray-rotation));
  animation: stellarRays var(--ray-duration, 11s) ease-in-out infinite;
  animation-delay: var(--drift-delay, 0s);
}

.star__ray {
  position: absolute;
  top: 50%;
  left: 50%;
  background: linear-gradient(90deg, transparent, rgba(var(--star-rgb), 0.28), rgba(255, 255, 255, 0.86), rgba(var(--star-rgb), 0.28), transparent);
  transform-origin: center;
}

.star__ray--horizontal,
.star__ray--vertical {
  width: 100%;
  height: 1px;
  transform: translate(-50%, -50%);
}

.star__ray--vertical {
  transform: translate(-50%, -50%) rotate(90deg);
}

.star__ray--diagonal-a,
.star__ray--diagonal-b {
  width: 68%;
  height: 1px;
  opacity: 0.55;
  transform: translate(-50%, -50%) rotate(45deg);
}

.star__ray--diagonal-b {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.star__orbit {
  inset: -18%;
  border: 1px solid rgba(var(--star-rgb), 0.54);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.72) rotate(-18deg);
  transition: opacity 220ms ease, transform 320ms ease;
}

.star__orbit::before,
.star__orbit::after {
  content: '';
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 8px rgba(var(--star-rgb), 0.9);
}

.star__orbit::before {
  top: 12%;
  right: 12%;
}

.star__orbit::after {
  bottom: 12%;
  left: 12%;
}

.star__body {
  inset: 7%;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: polygon(50% 0%, 58% 35%, 82% 18%, 65% 42%, 100% 50%, 65% 58%, 82% 82%, 58% 65%, 50% 100%, 42% 65%, 18% 82%, 35% 58%, 0% 50%, 35% 42%, 18% 18%, 42% 35%);
  background:
    radial-gradient(circle at 43% 38%, #fff 0 12%, rgba(255, 255, 255, 0.96) 18%, rgba(var(--star-rgb), 0.96) 48%, rgba(var(--star-rgb), 0.3) 76%, transparent 78%);
  filter:
    drop-shadow(0 0 5px rgba(255, 255, 255, 0.72))
    drop-shadow(0 0 13px rgba(var(--star-rgb), 0.82))
    drop-shadow(0 0 28px rgba(var(--star-rgb), 0.42));
  animation: stellarCore var(--drift-duration, 7s) ease-in-out infinite;
  animation-delay: var(--drift-delay, 0s);
}

.star__facet {
  inset: 22%;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  border: 1px solid rgba(255, 255, 255, 0.48);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.58), transparent 48%, rgba(5, 13, 23, 0.3));
  mix-blend-mode: screen;
}

.star__core--dim .star__body {
  inset: 13%;
  filter:
    drop-shadow(0 0 4px rgba(255, 255, 255, 0.58))
    drop-shadow(0 0 10px rgba(var(--star-rgb), 0.52));
}

.star__core--dim .star__rays {
  inset: -24%;
  opacity: 0.52;
}

.star__core--dim .star__corona {
  inset: -26%;
  opacity: 0.58;
}

.star--selected .star__core-wrapper,
.star:hover .star__core-wrapper {
  transform: translate(-50%, -50%) scale(1.14);
  filter: saturate(1.18);
}

.star--connected .star__orbit,
.star--selected .star__orbit,
.star:hover .star__orbit,
.star:focus-visible .star__orbit {
  opacity: 0.7;
  transform: scale(1) rotate(12deg);
}

.star--selected .star__orbit,
.star:focus-visible .star__orbit {
  border-width: 2px;
  opacity: 1;
  box-shadow: 0 0 20px rgba(var(--star-rgb), 0.24);
}

.star:focus-visible .star__core-wrapper {
  transform: translate(-50%, -50%) scale(1.12);
}

.star__icon {
  position: relative;
  z-index: 2;
  font-size: clamp(0.65rem, calc(var(--star-size) * 0.31), 1rem);
  color: rgba(4, 15, 24, 0.84);
  filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.24));
}

.star__core--dim .star__icon {
  font-size: clamp(0.48rem, calc(var(--star-size) * 0.3), 0.72rem);
  color: rgba(4, 15, 24, 0.78);
}

.star__badge {
  position: absolute;
  z-index: 4;
  top: -7px;
  right: -10px;
  padding: 3px 6px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px 8px 3px 3px;
  background: rgba(8, 14, 24, 0.92);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.38);
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgb(var(--star-rgb));
}

.star__kicker {
  position: absolute;
  z-index: 5;
  top: -1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.18rem 0.4rem;
  border: 1px solid rgba(var(--star-rgb), 0.26);
  border-radius: 2px 7px 2px 2px;
  background: rgba(5, 10, 18, 0.88);
  font-size: 0.54rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(230, 243, 255, 0.72);
}

.star__label {
  position: absolute;
  z-index: 7;
  top: calc(50% + (var(--star-size) / 2) + 0.65rem);
  left: 50%;
  transform: translateX(-50%);
  min-width: max-content;
  max-width: 16rem;
  padding: 0.36rem 0.58rem 0.38rem 0.65rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 2px solid rgba(var(--star-rgb), 0.72);
  border-radius: 3px 11px 3px 3px;
  display: grid;
  gap: 0.15rem;
  font-size: 0.68rem;
  font-weight: 600;
  color: rgba(242, 248, 255, 0.9);
  background: linear-gradient(110deg, rgba(5, 10, 18, 0.92), rgba(10, 18, 30, 0.7));
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.3);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  opacity: 1;
  transition: opacity 200ms ease, transform 200ms ease, background 200ms ease;
}

.star__label--selected {
  padding: 0.58rem 0.78rem;
  background: linear-gradient(110deg, rgba(5, 10, 18, 0.96), rgba(var(--star-rgb), 0.12));
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
  font-size: 0.58rem;
}

@keyframes stellarCorona {
  0%, 100% {
    opacity: 0.62;
    transform: scale(0.92);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.06);
  }
}

@keyframes stellarRays {
  0%, 100% {
    opacity: 0.62;
    transform: rotate(var(--ray-rotation)) scale(0.94);
  }
  50% {
    opacity: 0.94;
    transform: rotate(calc(var(--ray-rotation) + 4deg)) scale(1.08);
  }
}

@keyframes stellarCore {
  0%, 100% {
    transform: scale(0.96);
    filter:
      drop-shadow(0 0 5px rgba(255, 255, 255, 0.68))
      drop-shadow(0 0 13px rgba(var(--star-rgb), 0.78))
      drop-shadow(0 0 28px rgba(var(--star-rgb), 0.38));
  }
  50% {
    transform: scale(1.04);
    filter:
      drop-shadow(0 0 7px rgba(255, 255, 255, 0.82))
      drop-shadow(0 0 17px rgba(var(--star-rgb), 0.92))
      drop-shadow(0 0 34px rgba(var(--star-rgb), 0.5));
  }
}
</style>

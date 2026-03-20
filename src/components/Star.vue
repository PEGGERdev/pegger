<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import theme from '@/config/theme'

const props = defineProps({
  star: {
    type: Object,
    required: true
  },
  center: {
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
  }
})

const emit = defineEmits(['hover', 'click'])

const starRef = ref(null)
const offset = ref({ x: 0, y: 0 })
const isHovered = ref(false)

const MAGNETIC_RANGE = theme.animations.magneticRange
const ATTRACTION_STRENGTH = theme.animations.magneticStrength

const position = computed(() => {
  const baseX = props.center.x + (props.star.position.x / 100) * 300
  const baseY = props.center.y + (props.star.position.y / 100) * 250
  return {
    x: baseX + offset.value.x,
    y: baseY + offset.value.y
  }
})

const size = computed(() => {
  if (props.star.type === 'bright') {
    return props.star.size || theme.starSizes.bright
  }
  return theme.starSizes.dim
})

const style = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  transform: `translate(-50%, -50%)`,
  '--drift-duration': `${3.5 + Math.random() * 2}s`,
  '--drift-delay': `${Math.random() * 2}s`
}))

const coreClass = computed(() => {
  return `star__core star__core--${props.star.type}`
})

const brightness = computed(() => {
  if (isHovered.value) return 1
  if (props.star.type === 'bright') return 0.8
  return 0.3
})

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

let animationFrame = null

function updateAttraction() {
  if (!starRef.value) {
    animationFrame = requestAnimationFrame(updateAttraction)
    return
  }

  const rect = starRef.value.getBoundingClientRect()
  const starX = rect.left + rect.width / 2
  const starY = rect.top + rect.height / 2

  const distance = calculateDistance(props.mouseX, props.mouseY, starX, starY)

  if (distance < MAGNETIC_RANGE && distance > 1) {
    const normalizedDistance = 1 - (distance / MAGNETIC_RANGE)
    const pullStrength = normalizedDistance * ATTRACTION_STRENGTH * 25

    const angle = Math.atan2(props.mouseY - starY, props.mouseX - starX)
    offset.value = {
      x: Math.cos(angle) * pullStrength,
      y: Math.sin(angle) * pullStrength
    }
  } else {
    offset.value = {
      x: offset.value.x * 0.9,
      y: offset.value.y * 0.9
    }
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
  animationFrame = requestAnimationFrame(updateAttraction)
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <div
    ref="starRef"
    :style="style"
    class="star"
    :class="[`star--${star.type}`, { 'star--hovered': isHovered }]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
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
      <span v-if="star.badge" class="star__badge">{{ star.badge }}</span>
    </div>
    <span class="star__label">{{ star.label }}</span>
  </div>
</template>

<style scoped>
.star {
  position: absolute;
  cursor: pointer;
  transition: opacity 200ms ease;
  will-change: transform;
  animation: starDrift var(--drift-duration, 4s) ease-in-out infinite;
  animation-delay: var(--drift-delay, 0s);
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
  transition: transform 200ms ease, box-shadow 300ms ease;
}

.star__core--bright {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, var(--peggar-primary, #1f7c72) 50%, transparent 70%);
  box-shadow: 0 0 20px rgba(31, 124, 114, 0.5), 0 0 40px rgba(31, 124, 114, 0.3);
}

.star__core--dim {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.star:hover .star__core-wrapper {
  transform: scale(1.15);
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
  background: var(--peggar-orange, #ea580c);
  color: #fff;
  border-radius: 4px;
}

.star__label {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  opacity: 0;
  transition: opacity 200ms ease;
}

.star:hover .star__label,
.star--hovered .star__label {
  opacity: 1;
}

.star--dim .star__label {
  font-size: 0.6rem;
}
</style>

<script setup>
import { computed, ref } from 'vue'

defineOptions({ name: 'StarRating' })

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  maxStars: {
    type: Number,
    default: 5,
    validator: value => Number.isInteger(value) && value > 0,
  },
  step: {
    type: Number,
    default: 0.5,
    validator: value => value > 0 && value <= 1,
  },
  size: {
    type: [Number, String],
    default: 30,
  },
  label: {
    type: String,
    default: 'Rating',
  },
  color: {
    type: String,
    default: '#f6b73c',
  },
  emptyColor: {
    type: String,
    default: '#334155',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const rootRef = ref(null)
const hoverRating = ref(null)

const safeMax = computed(() => Math.max(1, Math.floor(props.maxStars)))
const safeStep = computed(() => Math.min(1, Math.max(0.01, props.step)))
const stars = computed(() => Array.from({ length: safeMax.value }, (_, index) => index))
const normalizedValue = computed(() => clamp(Number.isFinite(props.modelValue) ? props.modelValue : 0))
const displayRating = computed(() => hoverRating.value ?? normalizedValue.value)
const isInteractive = computed(() => !props.disabled && !props.readonly)
const sizeToken = computed(() => typeof props.size === 'number' ? `${props.size}px` : props.size)
const valueText = computed(() => `${formatRating(normalizedValue.value)} out of ${safeMax.value} stars`)
const rootStyle = computed(() => ({
  '--star-rating-size': sizeToken.value,
  '--star-rating-color': props.color,
  '--star-rating-empty': props.emptyColor,
}))

function clamp(value) {
  return Math.min(safeMax.value, Math.max(0, value))
}

function decimalPlaces(value) {
  const text = String(value)
  if (text.includes('e-')) return Number(text.split('e-')[1])
  return text.includes('.') ? text.split('.')[1].length : 0
}

function roundForStep(value) {
  return Number(value.toFixed(Math.max(2, decimalPlaces(safeStep.value))))
}

function formatRating(value) {
  return Number.isInteger(value) ? String(value) : String(roundForStep(value))
}

function fillPercentage(index) {
  return Math.min(100, Math.max(0, (displayRating.value - index) * 100))
}

function ratingFromPointer(event, index) {
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  const rawRating = index + ratio
  const steppedRating = Math.ceil((rawRating - Number.EPSILON) / safeStep.value) * safeStep.value
  return clamp(roundForStep(Math.max(index + safeStep.value, steppedRating)))
}

function preview(event, index) {
  if (!isInteractive.value) return
  hoverRating.value = ratingFromPointer(event, index)
}

function clearPreview() {
  hoverRating.value = null
}

function select(event, index) {
  if (!isInteractive.value) return
  rootRef.value?.focus()
  commit(ratingFromPointer(event, index))
}

function commit(value) {
  if (!isInteractive.value) return
  const nextValue = clamp(roundForStep(value))
  hoverRating.value = null
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

function handleKeydown(event) {
  if (!isInteractive.value) return

  const commands = {
    ArrowRight: normalizedValue.value + safeStep.value,
    ArrowUp: normalizedValue.value + safeStep.value,
    ArrowLeft: normalizedValue.value - safeStep.value,
    ArrowDown: normalizedValue.value - safeStep.value,
    Home: 0,
    End: safeMax.value,
  }

  if (!(event.key in commands)) return
  event.preventDefault()
  commit(commands[event.key])
}
</script>

<template>
  <div
    ref="rootRef"
    class="star-rating"
    :class="{
      'star-rating--interactive': isInteractive,
      'star-rating--disabled': disabled,
      'star-rating--readonly': readonly,
    }"
    :style="rootStyle"
    role="slider"
    aria-orientation="horizontal"
    :aria-label="label"
    aria-valuemin="0"
    :aria-valuemax="safeMax"
    :aria-valuenow="normalizedValue"
    :aria-valuetext="valueText"
    :aria-disabled="disabled"
    :aria-readonly="readonly"
    :tabindex="disabled ? -1 : 0"
    @pointerleave="clearPreview"
    @keydown="handleKeydown"
  >
    <span
      v-for="index in stars"
      :key="index"
      class="star-rating__star"
      :class="{ 'star-rating__star--active': fillPercentage(index) > 0 }"
      :data-star="index + 1"
      aria-hidden="true"
      @pointermove="preview($event, index)"
      @click="select($event, index)"
    >
      <span class="star-rating__visual">
        <svg class="star-rating__empty" viewBox="0 0 24 24" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span class="star-rating__fill" :style="{ width: `${fillPercentage(index)}%` }">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </span>
      </span>
    </span>
  </div>
</template>

<style scoped>
.star-rating {
  --star-rating-size: 30px;
  --star-rating-color: #f6b73c;
  --star-rating-empty: #334155;

  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  width: fit-content;
  padding: 0.2rem;
  border-radius: 0.65rem;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.star-rating--interactive {
  cursor: pointer;
}

.star-rating:focus-visible {
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.82), 0 0 18px rgba(96, 165, 250, 0.2);
}

.star-rating__star,
.star-rating__visual,
.star-rating__empty,
.star-rating__fill,
.star-rating__fill svg {
  display: block;
}

.star-rating__star {
  position: relative;
  flex: 0 0 auto;
  width: var(--star-rating-size);
  height: var(--star-rating-size);
}

.star-rating__visual {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 180ms ease, filter 180ms ease;
}

.star-rating__empty,
.star-rating__fill {
  position: absolute;
  inset: 0;
}

.star-rating svg {
  width: var(--star-rating-size);
  height: var(--star-rating-size);
  overflow: visible;
}

.star-rating polygon {
  stroke-linejoin: round;
  stroke-width: 0.7;
}

.star-rating__empty {
  color: var(--star-rating-empty);
  fill: currentColor;
  stroke: color-mix(in srgb, currentColor 75%, white);
  opacity: 0.72;
}

.star-rating__fill {
  right: auto;
  overflow: hidden;
  color: var(--star-rating-color);
  transition: width 160ms ease;
}

.star-rating__fill svg {
  max-width: none;
  fill: currentColor;
  stroke: color-mix(in srgb, currentColor 75%, white);
  filter: drop-shadow(0 0 3px color-mix(in srgb, currentColor 55%, transparent));
}

.star-rating__star--active .star-rating__visual {
  filter: drop-shadow(0 0 7px color-mix(in srgb, var(--star-rating-color) 32%, transparent));
}

.star-rating--interactive .star-rating__star:hover .star-rating__visual {
  transform: translateY(-1px) scale(1.12);
}

.star-rating--disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.star-rating--readonly {
  cursor: default;
}

@media (prefers-reduced-motion: reduce) {
  .star-rating__visual,
  .star-rating__fill {
    transition: none;
  }

  .star-rating--interactive .star-rating__star:hover .star-rating__visual {
    transform: none;
  }
}
</style>

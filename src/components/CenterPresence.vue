<script setup>
import { computed } from 'vue'

const props = defineProps({
  center: {
    type: Object,
    required: true
  },
  position: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  },
  mapFocused: {
    type: Boolean,
    default: false
  },
  detailLevel: {
    type: String,
    default: 'overview'
  }
})

const emit = defineEmits(['click'])

const style = computed(() => ({
  left: `${props.position.x}px`,
  top: `${props.position.y}px`
}))

const initials = computed(() => props.center.label
  .split(/\s+/)
  .map(part => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase())

const ariaLabel = computed(() => [
  props.center.label,
  props.center.category,
  props.center.data?.description,
].filter(Boolean).join('. '))
</script>

<template>
  <div
    class="center-presence"
    :class="{
      'center-presence--selected': selected,
      'center-presence--map-focused': mapFocused,
    }"
    :style="style"
  >
    <button
      class="center-presence__nucleus"
      type="button"
      :aria-label="ariaLabel"
      :aria-pressed="selected"
      @click="emit('click', center.id)"
    >
      <span class="center-presence__halo" aria-hidden="true" />
      <span class="center-presence__accretion" aria-hidden="true">
        <span class="center-presence__accretion-ring center-presence__accretion-ring--inner" />
        <span class="center-presence__accretion-ring center-presence__accretion-ring--mid" />
        <span class="center-presence__accretion-ring center-presence__accretion-ring--outer" />
      </span>
      <span class="center-presence__core" aria-hidden="true">
        <span class="center-presence__core-glow" />
        <span class="center-presence__core-body">
          <span class="center-presence__monogram">{{ initials }}</span>
        </span>
      </span>
    </button>

    <div class="center-presence__info">
      <div class="center-presence__info-header">
        <p class="center-presence__eyebrow">System origin</p>
        <span class="center-presence__index">00</span>
      </div>
      <h2 class="center-presence__name">{{ center.label }}</h2>
      <p class="center-presence__subtitle">{{ center.subtitle }}</p>
      <div class="center-presence__meta">
        <span>{{ center.category }}</span>
        <span>{{ center.location }}</span>
      </div>
      <p v-if="detailLevel !== 'overview' && center.data?.description" class="center-presence__detail">
        {{ center.data.description }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.center-presence {
  position: absolute;
  transform: translate(-50%, -3.75rem);
  width: 17rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  pointer-events: none;
}

.center-presence__nucleus {
  position: relative;
  width: 7.5rem;
  height: 7.5rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  pointer-events: auto;
}

.center-presence__nucleus:focus-visible {
  outline: none;
}

.center-presence__halo,
.center-presence__accretion,
.center-presence__core,
.center-presence__core-glow,
.center-presence__core-body,
.center-presence__accretion-ring {
  position: absolute;
  pointer-events: none;
}

.center-presence__halo {
  inset: -40%;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.18), rgba(101, 227, 209, 0.15) 18%, rgba(90, 167, 255, 0.08) 40%, transparent 68%);
  filter: blur(10px);
  animation: nucleusHalo 6s ease-in-out infinite;
}

.center-presence__accretion {
  inset: -10%;
}

.center-presence__accretion-ring {
  top: 50%;
  left: 50%;
  border: 1px solid;
  border-radius: 50%;
  opacity: 0.4;
}

.center-presence__accretion-ring::after {
  content: '';
  position: absolute;
  top: 10%;
  right: 16%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 8px rgba(101, 227, 209, 0.9);
}

.center-presence__accretion-ring--inner {
  width: 6.5rem;
  height: 4.2rem;
  border-color: rgba(101, 227, 209, 0.35);
  transform: translate(-50%, -50%) rotate(25deg);
  animation: accretionSpin 10s linear infinite;
}

.center-presence__accretion-ring--mid {
  width: 8rem;
  height: 6rem;
  border-color: rgba(90, 167, 255, 0.2);
  border-style: dashed;
  transform: translate(-50%, -50%) rotate(-20deg);
  animation: accretionSpin 14s linear infinite reverse;
}

.center-presence__accretion-ring--outer {
  width: 9.5rem;
  height: 9.5rem;
  border-color: rgba(101, 227, 209, 0.1);
  transform: translate(-50%, -50%);
}

.center-presence__core {
  inset: 18%;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background:
    radial-gradient(circle at 40% 36%, #fff 0%, #c8fff6 12%, #65e3d1 34%, rgba(90, 167, 255, 0.5) 60%, transparent 64%);
  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.8),
    0 0 28px rgba(101, 227, 209, 0.65),
    0 0 50px rgba(90, 167, 255, 0.3);
  transition: transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 300ms ease;
  animation: nucleusPulse 5.8s ease-in-out infinite;
}

.center-presence__core-glow {
  inset: 8%;
  border-radius: 50%;
  background: radial-gradient(circle at 45% 40%, rgba(255, 255, 255, 0.3), transparent 60%);
  mix-blend-mode: screen;
}

.center-presence__core-body {
  inset: 28%;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(5, 16, 25, 0.95), rgba(13, 38, 52, 0.85));
  box-shadow: inset 0 0 16px rgba(101, 227, 209, 0.15);
}

.center-presence__monogram {
  font-family: var(--pegger-font-display);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(239, 255, 252, 0.94);
}

.center-presence__nucleus:hover .center-presence__core,
.center-presence__nucleus:focus-visible .center-presence__core,
.center-presence--selected .center-presence__core {
  transform: scale(1.08);
  box-shadow:
    0 0 12px rgba(255, 255, 255, 0.9),
    0 0 34px rgba(101, 227, 209, 0.85),
    0 0 60px rgba(90, 167, 255, 0.42);
}

.center-presence__nucleus:focus-visible .center-presence__accretion-ring--outer,
.center-presence--selected .center-presence__accretion-ring--outer {
  border-width: 2px;
  border-color: rgba(112, 184, 255, 0.55);
  opacity: 0.7;
}

.center-presence__info {
  position: relative;
  width: 100%;
  margin-top: 0.7rem;
  padding: 0.85rem 1rem 0.9rem;
  border: 1px solid rgba(166, 205, 255, 0.15);
  border-left-color: rgba(101, 227, 209, 0.5);
  border-radius: 4px 18px 4px 4px;
  background:
    linear-gradient(115deg, rgba(5, 11, 20, 0.94), rgba(8, 18, 30, 0.82)),
    radial-gradient(circle at top right, rgba(90, 167, 255, 0.16), transparent 40%);
  backdrop-filter: blur(16px);
  text-align: left;
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 600ms ease-out;
}

.center-presence__info::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 1rem;
  width: 3.4rem;
  height: 1px;
  background: linear-gradient(90deg, #65e3d1, transparent);
  box-shadow: 0 0 12px rgba(101, 227, 209, 0.6);
}

.center-presence--selected .center-presence__info {
  border-color: rgba(101, 227, 209, 0.28);
  border-left-color: rgba(101, 227, 209, 0.82);
}

.center-presence--map-focused .center-presence__info {
  width: 15.5rem;
  transform: translateX(-5rem);
}

.center-presence__info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.center-presence__eyebrow {
  margin: 0;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(192, 218, 239, 0.58);
}

.center-presence__index {
  font-family: var(--pegger-font-display);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  color: rgba(101, 227, 209, 0.72);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.center-presence__name {
  font-family: 'Space Grotesk', sans-serif;
  margin: 0.4rem 0 0;
  font-size: 1.08rem;
  font-weight: 600;
  color: rgba(248, 252, 255, 0.98);
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.center-presence__subtitle {
  margin: 0.2rem 0 0;
  font-size: 0.74rem;
  color: rgba(222, 237, 251, 0.68);
}

.center-presence__meta {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 0.65rem;
  padding-top: 0.58rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.center-presence__meta span {
  position: relative;
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(192, 218, 239, 0.52);
}

.center-presence__meta span + span {
  padding-left: 0.7rem;
}

.center-presence__meta span + span::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #65e3d1;
  box-shadow: 0 0 6px rgba(101, 227, 209, 0.8);
  transform: translateY(-50%);
}

.center-presence__detail {
  margin: 0.55rem 0 0;
  max-width: 17rem;
  font-size: 0.7rem;
  line-height: 1.45;
  color: rgba(220, 235, 249, 0.58);
}

@keyframes nucleusHalo {
  0%, 100% {
    opacity: 0.6;
    transform: scale(0.96);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.06);
  }
}

@keyframes nucleusPulse {
  0%, 100% {
    box-shadow:
      0 0 10px rgba(255, 255, 255, 0.75),
      0 0 28px rgba(101, 227, 209, 0.6),
      0 0 50px rgba(90, 167, 255, 0.28);
  }
  50% {
    box-shadow:
      0 0 12px rgba(255, 255, 255, 0.88),
      0 0 34px rgba(101, 227, 209, 0.78),
      0 0 60px rgba(90, 167, 255, 0.4);
  }
}

@keyframes accretionSpin {
  from { transform: translate(-50%, -50%) rotate(25deg); }
  to { transform: translate(-50%, -50%) rotate(385deg); }
}

@media (min-width: 901px) and (max-height: 820px) {
  .center-presence:not(.center-presence--map-focused) .center-presence__info {
    width: 15.5rem;
    transform: translateX(-8rem);
  }
}
</style>

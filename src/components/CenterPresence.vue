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
      class="center-presence__beacon"
      type="button"
      :aria-label="ariaLabel"
      :aria-pressed="selected"
      @click="emit('click', center.id)"
    >
      <span class="center-presence__aura" aria-hidden="true" />
      <span class="center-presence__rays" aria-hidden="true">
        <span class="center-presence__ray center-presence__ray--horizontal" />
        <span class="center-presence__ray center-presence__ray--vertical" />
        <span class="center-presence__ray center-presence__ray--diagonal-a" />
        <span class="center-presence__ray center-presence__ray--diagonal-b" />
      </span>
      <span class="center-presence__orbits" aria-hidden="true">
        <span class="center-presence__orbit center-presence__orbit--1" />
        <span class="center-presence__orbit center-presence__orbit--2" />
        <span class="center-presence__orbit center-presence__orbit--3" />
      </span>
      <span class="center-presence__aperture" aria-hidden="true">
        <span class="center-presence__lens">
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

.center-presence__beacon {
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

.center-presence__beacon:focus-visible {
  outline: none;
}

.center-presence__aura,
.center-presence__rays,
.center-presence__orbits,
.center-presence__aperture,
.center-presence__lens,
.center-presence__orbit {
  position: absolute;
  pointer-events: none;
}

.center-presence__aura {
  inset: -34%;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.24), rgba(101, 227, 209, 0.22) 20%, rgba(90, 167, 255, 0.1) 46%, transparent 70%);
  filter: blur(7px);
  animation: beaconAura 5.8s ease-in-out infinite;
}

.center-presence__rays {
  inset: -28%;
  animation: beaconRays 13s ease-in-out infinite;
}

.center-presence__ray {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  background: linear-gradient(90deg, transparent, rgba(101, 227, 209, 0.34), rgba(255, 255, 255, 0.92), rgba(90, 167, 255, 0.34), transparent);
}

.center-presence__ray--horizontal,
.center-presence__ray--vertical {
  width: 100%;
  height: 1px;
  transform: translate(-50%, -50%);
}

.center-presence__ray--vertical {
  transform: translate(-50%, -50%) rotate(90deg);
}

.center-presence__ray--diagonal-a,
.center-presence__ray--diagonal-b {
  width: 64%;
  height: 1px;
  opacity: 0.54;
  transform: translate(-50%, -50%) rotate(45deg);
}

.center-presence__ray--diagonal-b {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.center-presence__orbits {
  inset: -14%;
}

.center-presence__orbit {
  top: 50%;
  left: 50%;
  border: 1px solid rgba(122, 214, 229, 0.3);
  border-radius: 50%;
}

.center-presence__orbit::after {
  content: '';
  position: absolute;
  top: 12%;
  right: 14%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 10px rgba(101, 227, 209, 0.9);
}

.center-presence__orbit--1 {
  width: 8.2rem;
  height: 5.2rem;
  transform: translate(-50%, -50%) rotate(22deg);
  animation: orbitOne 11s linear infinite;
}

.center-presence__orbit--2 {
  width: 6rem;
  height: 8.5rem;
  border-style: dashed;
  border-color: rgba(90, 167, 255, 0.22);
  transform: translate(-50%, -50%) rotate(-28deg);
  animation: orbitTwo 15s linear infinite reverse;
}

.center-presence__orbit--3 {
  width: 9.5rem;
  height: 9.5rem;
  border-color: rgba(101, 227, 209, 0.12);
  transform: translate(-50%, -50%);
}

.center-presence__aperture {
  inset: 20%;
  display: grid;
  place-items: center;
  clip-path: polygon(50% 0%, 61% 34%, 85% 15%, 66% 39%, 100% 50%, 66% 61%, 85% 85%, 61% 66%, 50% 100%, 39% 66%, 15% 85%, 34% 61%, 0% 50%, 34% 39%, 15% 15%, 39% 34%);
  background: radial-gradient(circle, #fff 0 8%, #c8fff6 17%, #65e3d1 40%, rgba(90, 167, 255, 0.55) 66%, transparent 68%);
  filter:
    drop-shadow(0 0 7px rgba(255, 255, 255, 0.84))
    drop-shadow(0 0 22px rgba(101, 227, 209, 0.7))
    drop-shadow(0 0 44px rgba(90, 167, 255, 0.35));
  transition: transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 300ms ease;
  animation: beaconCore 5.8s ease-in-out infinite;
}

.center-presence__lens {
  inset: 29%;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.68);
  background: linear-gradient(145deg, rgba(5, 16, 25, 0.96), rgba(13, 38, 52, 0.88));
  transform: rotate(45deg);
  box-shadow: inset 0 0 18px rgba(101, 227, 209, 0.18);
}

.center-presence__monogram {
  font-family: var(--pegger-font-display);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(239, 255, 252, 0.94);
  transform: rotate(-45deg);
}

.center-presence__beacon:hover .center-presence__aperture,
.center-presence__beacon:focus-visible .center-presence__aperture,
.center-presence--selected .center-presence__aperture {
  transform: scale(1.1) rotate(2deg);
  filter:
    drop-shadow(0 0 9px rgba(255, 255, 255, 0.94))
    drop-shadow(0 0 30px rgba(101, 227, 209, 0.9))
    drop-shadow(0 0 56px rgba(90, 167, 255, 0.48));
}

.center-presence__beacon:focus-visible .center-presence__orbit--3,
.center-presence--selected .center-presence__orbit--3 {
  border-width: 2px;
  border-color: rgba(112, 184, 255, 0.72);
  box-shadow: 0 0 26px rgba(90, 167, 255, 0.24);
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

@keyframes beaconAura {
  0%, 100% {
    opacity: 0.68;
    transform: scale(0.94);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@keyframes beaconRays {
  0%, 100% {
    opacity: 0.64;
    transform: rotate(-3deg) scale(0.94);
  }
  50% {
    opacity: 0.96;
    transform: rotate(3deg) scale(1.06);
  }
}

@keyframes beaconCore {
  0%, 100% {
    filter:
      drop-shadow(0 0 7px rgba(255, 255, 255, 0.8))
      drop-shadow(0 0 22px rgba(101, 227, 209, 0.68))
      drop-shadow(0 0 44px rgba(90, 167, 255, 0.32));
  }
  50% {
    filter:
      drop-shadow(0 0 9px rgba(255, 255, 255, 0.92))
      drop-shadow(0 0 28px rgba(101, 227, 209, 0.82))
      drop-shadow(0 0 54px rgba(90, 167, 255, 0.44));
  }
}

@keyframes orbitOne {
  from { transform: translate(-50%, -50%) rotate(22deg); }
  to { transform: translate(-50%, -50%) rotate(382deg); }
}

@keyframes orbitTwo {
  from { transform: translate(-50%, -50%) rotate(-28deg); }
  to { transform: translate(-50%, -50%) rotate(332deg); }
}

@media (min-width: 901px) and (max-height: 820px) {
  .center-presence:not(.center-presence--map-focused) .center-presence__info {
    width: 15.5rem;
    transform: translateX(-8rem);
  }
}
</style>

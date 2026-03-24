<script setup>
import { computed } from 'vue'

const props = defineProps({
  center:   { type: Object,  required: true },
  position: { type: Object,  required: true },
  isDimmed: { type: Boolean, default: false },
})

const style = computed(() => ({
  left: `${props.position.x}px`,
  top:  `${props.position.y}px`,
}))
</script>

<template>
  <div
    class="center-presence"
    :class="{ 'center-presence--dimmed': isDimmed }"
    :style="style"
    role="img"
    :aria-label="`${center.label} — ${center.subtitle}`"
  >
    <div class="center-presence__core">
      <div class="center-presence__inner" />
    </div>

    <div class="center-presence__rings" aria-hidden="true">
      <div class="center-presence__ring center-presence__ring--1" />
      <div class="center-presence__ring center-presence__ring--2" />
    </div>

    <div class="center-presence__info">
      <h1 class="center-presence__name">{{ center.label }}</h1>
      <p class="center-presence__subtitle">{{ center.subtitle }}</p>
    </div>
  </div>
</template>

<style scoped>
.center-presence {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  pointer-events: none;
  transition: opacity 350ms ease, filter 350ms ease;
}

.center-presence--dimmed {
  opacity: 0.18;
  filter: blur(2px);
}

/* ── Core ── */
.center-presence__core {
  position: relative;
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-presence__inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 36% 32%,
    #fff 0%,
    rgba(31,124,114, 0.88) 40%,
    transparent 70%
  );
  animation: centerPulse 3.2s ease-in-out infinite;
}

/* ── Rings ── */
.center-presence__rings {
  position: absolute;
  inset: -24px;
  pointer-events: none;
}

.center-presence__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(31,124,114, 0.28);
  animation: ringExpand 4.4s ease-out infinite;
}

.center-presence__ring--2 {
  animation-delay: 2.2s;
}

/* ── Info ── */
.center-presence__info {
  margin-top: 20px;
  text-align: center;
  animation: fadeInUp 700ms ease-out both;
}

.center-presence__name {
  font-family: var(--pegger-font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.015em;
  text-shadow: 0 2px 20px rgba(0,0,0, 0.65);
  margin: 0;
}

.center-presence__subtitle {
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba(255,255,255, 0.6);
  margin: 5px 0 0;
  letter-spacing: 0.01em;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

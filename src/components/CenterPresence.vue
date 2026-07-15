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
</script>

<template>
  <button class="center-presence" :class="{ 'center-presence--selected': selected }" :style="style" type="button" @click="emit('click', center.id)">
    <div class="center-presence__core">
      <div class="center-presence__inner" />
    </div>
    <div class="center-presence__rings">
      <div class="center-presence__ring center-presence__ring--1" />
      <div class="center-presence__ring center-presence__ring--2" />
    </div>
    <div class="center-presence__info">
      <p class="center-presence__eyebrow">Core profile</p>
      <h2 class="center-presence__name">{{ center.label }}</h2>
      <p class="center-presence__subtitle">{{ center.subtitle }}</p>
      <p v-if="detailLevel !== 'overview' && center.data?.description" class="center-presence__detail">
        {{ center.data.description }}
      </p>
    </div>
  </button>
</template>

<style scoped>
.center-presence {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
}

.center-presence--selected .center-presence__inner {
  box-shadow:
    0 0 36px rgba(255, 255, 255, 0.72),
    0 0 74px rgba(31, 124, 114, 0.5),
    0 0 128px rgba(31, 124, 114, 0.32);
}

.center-presence__core {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-presence__inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0%, rgba(31, 124, 114, 0.8) 40%, transparent 70%);
  box-shadow: 
    0 0 30px rgba(255, 255, 255, 0.6),
    0 0 60px rgba(31, 124, 114, 0.4),
    0 0 100px rgba(31, 124, 114, 0.2);
  animation: centerPulse 3s ease-in-out infinite;
}

@keyframes centerPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 
      0 0 30px rgba(255, 255, 255, 0.6),
      0 0 60px rgba(31, 124, 114, 0.4),
      0 0 100px rgba(31, 124, 114, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 
      0 0 40px rgba(255, 255, 255, 0.8),
      0 0 80px rgba(31, 124, 114, 0.5),
      0 0 120px rgba(31, 124, 114, 0.3);
  }
}

.center-presence__rings {
  position: absolute;
  inset: -20px;
  pointer-events: none;
}

.center-presence__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(31, 124, 114, 0.3);
  animation: ringExpand 4s ease-out infinite;
}

.center-presence__ring--1 {
  animation-delay: 0s;
}

.center-presence__ring--2 {
  animation-delay: 2s;
}

@keyframes ringExpand {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.center-presence__info {
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(7, 12, 22, 0.8), rgba(7, 12, 22, 0.46));
  backdrop-filter: blur(16px);
  text-align: center;
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.24);
  animation: fadeInUp 600ms ease-out;
}

.center-presence__eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.52);
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
  font-size: 1.15rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.center-presence__subtitle {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 4px 0 0 0;
}

.center-presence__detail {
  margin: 0.5rem 0 0;
  max-width: 17rem;
  font-size: 0.76rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.58);
}
</style>

<script setup>
import { ref } from 'vue'
import StarMap from './components/StarMap.vue'
import StarField from './components/StarField.vue'

const focusedStarId = ref(null)

const insightPills = [
  'Product-minded frontend',
  'Backend systems',
  'Swiss-based',
]

function handleFocusChange(starId) {
  focusedStarId.value = starId
}
</script>

<template>
  <div
    class="app-shell"
    :class="{
      'app-shell--focused': focusedStarId,
    }"
  >
    <div class="orb orb--one" />
    <div class="orb orb--two" />
    <div class="orb orb--three" />

    <StarField />

    <section class="hero-panel" aria-label="Introduction" data-aos="fade-down">
      <p class="hero-panel__eyebrow">Pegger.dev</p>
      <h1 class="hero-panel__title">Precision-crafted digital products with a constellation interface.</h1>
      <p class="hero-panel__body">
        Patrik Egger builds polished product interfaces, practical backend systems, and developer tools that feel clear from the first interaction.
      </p>

      <div class="hero-panel__meta">
        <span v-for="pill in insightPills" :key="pill">{{ pill }}</span>
      </div>
    </section>

    <main class="star-map-container">
      <StarMap @focus-change="handleFocusChange" />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  overflow: hidden;
}

.hero-panel {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 20;
  width: min(34rem, calc(100vw - 3rem));
  padding: 1.4rem;
  border: 1px solid rgba(166, 205, 255, 0.12);
  border-radius: 4px 28px 4px 4px;
  background:
    linear-gradient(180deg, rgba(7, 16, 28, 0.9), rgba(7, 16, 28, 0.58)),
    radial-gradient(circle at top left, rgba(73, 197, 182, 0.14), transparent 38%);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
  transition: opacity 220ms ease, transform 220ms ease;
}

.hero-panel::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 1.4rem;
  width: 5rem;
  height: 1px;
  background: linear-gradient(90deg, var(--pegger-primary), transparent);
  box-shadow: 0 0 14px rgba(var(--pegger-primary-rgb), 0.55);
}

.hero-panel__eyebrow {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(212, 230, 255, 0.64);
}

.hero-panel__title {
  margin-top: 0.85rem;
  font-size: clamp(2rem, 4vw, 3.35rem);
  line-height: 1.02;
  max-width: 12ch;
  color: #f6fbff;
}

.hero-panel__body {
  margin: 1rem 0 0;
  max-width: 34rem;
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(223, 235, 251, 0.76);
}

.hero-panel__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.2rem;
}

.hero-panel__meta span {
  padding: 0.45rem 0.75rem;
  border-radius: 3px 10px 3px 3px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(232, 242, 255, 0.8);
  font-size: 0.78rem;
}

.star-map-container {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 900px) {
  .app-shell {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .hero-panel {
    position: relative;
    top: auto;
    left: auto;
    width: auto;
    margin: 0.75rem;
    padding: 1.1rem;
    border-radius: 4px 20px 4px 4px;
  }

  .star-map-container {
    height: auto;
    min-height: 0;
    padding: 0 0.75rem 0.75rem;
    display: block;
  }

  .hero-panel__eyebrow {
    font-size: 0.68rem;
  }

  .hero-panel__title {
    max-width: none;
    font-size: clamp(1.8rem, 8vw, 2.3rem);
    line-height: 1.08;
  }

  .hero-panel__body {
    font-size: 0.92rem;
    line-height: 1.5;
  }

  .hero-panel__meta {
    display: none;
  }
}

@media (min-width: 901px) {
  .hero-panel {
    width: min(31rem, calc(100vw - 3rem));
  }

  .hero-panel__title {
    font-size: clamp(2rem, 3.4vw, 3rem);
    max-width: 13ch;
  }

  .app-shell--focused .hero-panel {
    opacity: 0;
    pointer-events: none;
    transform: translateX(-1rem);
  }
}
</style>

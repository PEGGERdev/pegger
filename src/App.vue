<script setup>
import { computed, ref, shallowRef } from 'vue'
import StarMap from './components/StarMap.vue'
import StarField from './components/StarField.vue'
import StarPanel from './components/StarPanel.vue'

const activePanel = ref(null)
const focusedStarId = ref(null)
const panelTrigger = shallowRef(null)

const heroActions = [
  {
    label: 'View Projects',
    panelId: 'apps',
    variant: 'primary',
    icon: 'bi-arrow-up-right',
  },
  {
    label: 'Contact',
    panelId: 'contact',
    variant: 'secondary',
    icon: 'bi-envelope',
  },
]

const insightPills = [
  'Product-minded frontend',
  'Backend systems',
  'Swiss-based',
]

const isPanelOpen = computed(() => Boolean(activePanel.value))

function rememberPanelTrigger() {
  panelTrigger.value = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null
}

function handleStarClick(panelId) {
  rememberPanelTrigger()
  activePanel.value = panelId
}

function openPanel(panelId) {
  rememberPanelTrigger()
  activePanel.value = panelId
}

function closePanel() {
  activePanel.value = null
}

function handleFocusChange(starId) {
  focusedStarId.value = starId
}
</script>

<template>
  <div
    class="app-shell"
    :class="{
      'app-shell--panel-open': isPanelOpen,
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

      <div class="hero-panel__actions">
        <button
          v-for="action in heroActions"
          :key="action.panelId"
          class="hero-panel__action"
          :class="`hero-panel__action--${action.variant}`"
          type="button"
          @click="openPanel(action.panelId)"
        >
          <span>{{ action.label }}</span>
          <i :class="['bi', action.icon]" />
        </button>
      </div>

      <div class="hero-panel__meta">
        <span v-for="pill in insightPills" :key="pill">{{ pill }}</span>
      </div>
    </section>

    <main class="star-map-container">
      <StarMap @star-click="handleStarClick" @focus-change="handleFocusChange" />
    </main>

    <StarPanel
      v-if="activePanel"
      :panel-id="activePanel"
      :return-focus="panelTrigger"
      @close="closePanel"
    />
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
  border-radius: 1.5rem;
  background:
    linear-gradient(180deg, rgba(7, 16, 28, 0.9), rgba(7, 16, 28, 0.58)),
    radial-gradient(circle at top left, rgba(73, 197, 182, 0.14), transparent 38%);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
  transition: opacity 220ms ease, transform 220ms ease;
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

.hero-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.4rem;
}

.hero-panel__action {
  min-height: 3rem;
  padding: 0.85rem 1rem;
  border-radius: 999px;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  font: inherit;
  font-weight: 600;
  color: #f7fbff;
  cursor: pointer;
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
}

.hero-panel__action:hover,
.hero-panel__action:focus-visible {
  transform: translateY(-1px);
}

.hero-panel__action--primary {
  background: linear-gradient(135deg, rgba(73, 197, 182, 0.9), rgba(90, 167, 255, 0.86));
  box-shadow: 0 16px 36px rgba(73, 197, 182, 0.22);
}

.hero-panel__action--secondary {
  border-color: rgba(166, 205, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
}

.hero-panel__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.2rem;
}

.hero-panel__meta span {
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
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
    border-radius: 1.25rem;
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

  .hero-panel__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem;
    margin-top: 1.1rem;
  }

  .hero-panel__action {
    justify-content: center;
  }

  .hero-panel__meta {
    display: none;
  }

  .app-shell--panel-open .hero-panel {
    opacity: 0;
    pointer-events: none;
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

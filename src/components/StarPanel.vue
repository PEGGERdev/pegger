<script setup>
import { computed } from 'vue'
import { panelData } from '@/data/starMapData'
import AppsPanel from './panels/AppsPanel.vue'
import ContactPanel from './panels/ContactPanel.vue'
import SocialsPanel from './panels/SocialsPanel.vue'
import PrivatePanel from './panels/PrivatePanel.vue'

const props = defineProps({
  panelId: {
    type:     String,
    required: true,
  },
})

const emit = defineEmits(['close'])

const panelContent = computed(() => panelData[props.panelId] ?? null)

const PanelComponent = computed(() => {
  switch (props.panelId) {
    case 'apps':    return AppsPanel
    case 'contact': return ContactPanel
    case 'socials': return SocialsPanel
    case 'private': return PrivatePanel
    default:        return null
  }
})

function handleBackdropClick() {
  emit('close')
}

function handleKeydown(e) {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="backdrop">
      <div
        class="star-panel__backdrop"
        aria-hidden="true"
        @click="handleBackdropClick"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="panel">
      <div
        v-if="panelContent"
        class="star-panel"
        role="dialog"
        aria-modal="true"
        :aria-label="panelContent.title"
        @keydown="handleKeydown"
      >
        <div class="star-panel__content">
          <!-- Header -->
          <header class="star-panel__header">
            <div class="star-panel__header-icon" aria-hidden="true">
              <i :class="panelContent.icon ?? 'bi-star'" />
            </div>
            <h2 class="star-panel__title">{{ panelContent.title }}</h2>
            <button
              class="star-panel__close"
              aria-label="Close panel"
              @click="emit('close')"
            >
              <i class="bi bi-x-lg" aria-hidden="true" />
            </button>
          </header>

          <!-- Dynamic panel content -->
          <component
            :is="PanelComponent"
            v-if="PanelComponent"
            :data="panelContent"
          />

          <!-- Optional note -->
          <p v-if="panelContent.note" class="star-panel__note">
            <i class="bi bi-clock" aria-hidden="true" />
            {{ panelContent.note }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop */
.star-panel__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 18, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 99;
  cursor: pointer;
}

/* Panel */
.star-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(600px, calc(100vw - 2rem));
  max-height: calc(100dvh - 4rem);
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 100;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

.star-panel::-webkit-scrollbar       { width: 4px; }
.star-panel::-webkit-scrollbar-track { background: transparent; }
.star-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.star-panel__content {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 1.6rem;
  padding: 2rem;
}

/* Header */
.star-panel__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.star-panel__header-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.8rem;
  background: linear-gradient(
    135deg,
    rgba(var(--pegger-primary-rgb), 0.28),
    rgba(var(--pegger-accent-rgb), 0.18)
  );
  font-size: 1.05rem;
  color: var(--pegger-primary);
}

.star-panel__title {
  font-family: var(--pegger-font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
  flex: 1;
  margin: 0;
}

.star-panel__close {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.68);
  cursor: pointer;
  transition:
    background 150ms ease,
    color      150ms ease,
    border-color 150ms ease;
}

.star-panel__close:hover {
  background:    rgba(255, 255, 255, 0.14);
  color:         #fff;
  border-color:  rgba(255, 255, 255, 0.22);
}

.star-panel__close:focus-visible {
  outline: 2px solid var(--pegger-primary);
  outline-offset: 2px;
}

/* Note */
.star-panel__note {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.55);
  font-style: italic;
}

.star-panel__note i {
  font-style: normal;
  opacity: 0.7;
}

/* ── Transitions ── */
.panel-enter-active {
  animation: panelRise 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.panel-leave-active {
  animation: panelFall 280ms ease-in;
}
.backdrop-enter-active {
  animation: fadeIn 200ms ease;
}
.backdrop-leave-active {
  animation: fadeOut 200ms ease;
}

@keyframes panelRise {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.86) translateY(28px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) translateY(0);
  }
}

@keyframes panelFall {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9) translateY(18px);
  }
}

@keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

/* Mobile */
@media (max-width: 640px) {
  .star-panel {
    width: calc(100vw - 1rem);
    max-height: calc(100dvh - 2rem);
    top: 50%;
  }

  .star-panel__content {
    padding: 1.5rem;
    border-radius: 1.2rem;
  }
}
</style>

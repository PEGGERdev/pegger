<script setup>
import { computed } from 'vue'
import { panelData } from '@/data/starMapData'
import AppsPanel from './panels/AppsPanel.vue'
import ContactPanel from './panels/ContactPanel.vue'
import SocialsPanel from './panels/SocialsPanel.vue'
import PrivatePanel from './panels/PrivatePanel.vue'

const props = defineProps({
  panelId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const panelContent = computed(() => panelData[props.panelId])

const PanelComponent = computed(() => {
  switch (props.panelId) {
    case 'apps': return AppsPanel
    case 'contact': return ContactPanel
    case 'socials': return SocialsPanel
    case 'private': return PrivatePanel
    default: return null
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div class="star-panel__backdrop" @click="emit('close')" />
    </Transition>
    
    <Transition name="panel">
      <div v-if="panelContent" class="star-panel">
        <div class="star-panel__content">
          <header class="star-panel__header">
            <h2 class="star-panel__title">{{ panelContent.title }}</h2>
            <button class="star-panel__close" @click="emit('close')" aria-label="Close">
              <i class="bi bi-x-lg" />
            </button>
          </header>

          <component 
            :is="PanelComponent" 
            v-if="PanelComponent" 
            :data="panelContent" 
          />
          
          <p v-if="panelContent.note" class="star-panel__note">
            {{ panelContent.note }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.star-panel__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 18, 0.7);
  backdrop-filter: blur(8px);
  z-index: 99;
}

.star-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(600px, calc(100vw - 2rem));
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  z-index: 100;
}

.star-panel__content {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1.2rem;
  padding: 2rem;
}

.star-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.star-panel__title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.star-panel__close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #fff;
  cursor: pointer;
  transition: background 150ms ease;
}

.star-panel__close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.star-panel__note {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

/* Transitions */
.panel-enter-active {
  animation: panelRise 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.panel-leave-active {
  animation: panelFall 300ms ease-in;
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
    transform: translate(-50%, -50%) scale(0.85) translateY(30px);
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
    transform: translate(-50%, -50%) scale(0.9) translateY(20px);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>

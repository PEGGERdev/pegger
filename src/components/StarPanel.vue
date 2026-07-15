<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePeggerRuntime } from '@/composables/usePeggerRuntime.js'
import ItemList from './ItemList.vue'

const props = defineProps({
  panelId: {
    type: String,
    required: true
  },
  returnFocus: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])
const { getPanelView } = usePeggerRuntime()
const panelRef = ref(null)
const visible = ref(true)

const panelContent = computed(() => getPanelView(props.panelId))
const panelVariant = computed(() => panelContent.value?.variant || panelContent.value?.type || 'default')

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

let appShell = null
let previousActiveElement = null
let previousAriaHidden = null
let previousBodyOverflow = ''
let previousHtmlOverflow = ''
let previousInert = false

function requestClose() {
  visible.value = false
}

function finishClose() {
  emit('close')
}

function focusPanel() {
  nextTick(() => panelRef.value?.focus())
}

function restoreFocus() {
  const fallback = [
    '.star-map__panel-action',
    '.star-map__mobile-node--selected',
    '.hero-panel__action',
  ].map(selector => document.querySelector(selector)).find(Boolean)
  const target = previousActiveElement?.isConnected ? previousActiveElement : fallback
  target?.focus()
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    requestClose()
    return
  }

  if (event.key !== 'Tab' || !panelRef.value) {
    return
  }

  const focusableElements = [...panelRef.value.querySelectorAll(focusableSelector)]

  if (focusableElements.length === 0) {
    event.preventDefault()
    panelRef.value.focus()
    return
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && (document.activeElement === firstElement || document.activeElement === panelRef.value)) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

onMounted(() => {
  previousActiveElement = props.returnFocus || document.activeElement
  previousBodyOverflow = document.body.style.overflow
  previousHtmlOverflow = document.documentElement.style.overflow
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  appShell = document.querySelector('.app-shell')
  if (appShell) {
    previousInert = appShell.inert
    previousAriaHidden = appShell.getAttribute('aria-hidden')
    appShell.inert = true
    appShell.setAttribute('aria-hidden', 'true')
  }

  document.addEventListener('keydown', handleKeydown)
  focusPanel()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = previousBodyOverflow
  document.documentElement.style.overflow = previousHtmlOverflow

  if (appShell) {
    appShell.inert = previousInert
    if (previousAriaHidden === null) {
      appShell.removeAttribute('aria-hidden')
    } else {
      appShell.setAttribute('aria-hidden', previousAriaHidden)
    }
  }

  restoreFocus()
})

watch(panelContent, value => {
  if (value) {
    focusPanel()
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop" appear>
      <div v-if="visible" class="star-panel__backdrop" @click="requestClose" />
    </Transition>

    <Transition name="panel" appear @after-leave="finishClose">
      <aside
        v-if="visible && panelContent"
        ref="panelRef"
        class="star-panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`star-panel-title-${panelId}`"
        tabindex="-1"
      >
        <div class="star-panel__content">
          <header class="star-panel__header">
            <div class="star-panel__headline">
              <p class="star-panel__eyebrow">Selected cluster</p>
              <h2 :id="`star-panel-title-${panelId}`" class="star-panel__title">{{ panelContent.title }}</h2>
            </div>
            <button class="star-panel__close" type="button" @click="requestClose" aria-label="Close details panel">
              <i class="bi bi-x-lg" />
            </button>
          </header>

          <p v-if="panelContent.description" class="star-panel__description">
            {{ panelContent.description }}
          </p>

          <ItemList
            v-if="panelContent.items"
            :items="panelContent.items"
            :variant="panelVariant"
          />

          <p v-if="panelContent.note" class="star-panel__note">
            {{ panelContent.note }}
          </p>

          <div v-if="panelContent.description && panelVariant === 'private'" class="star-panel__warning">
            <i class="bi bi-shield-lock" />
            <span>Access restricted. Authentication required.</span>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.star-panel__backdrop {
  position: fixed;
  inset: 0;
  background: linear-gradient(90deg, rgba(4, 8, 16, 0.18), rgba(4, 8, 16, 0.72));
  backdrop-filter: blur(10px);
  z-index: 99;
}

.star-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: min(32rem, 100vw);
  height: 100vh;
  height: 100dvh;
  z-index: 100;
  outline: none;
}

.star-panel__content {
  height: 100%;
  overflow-y: auto;
  background:
    linear-gradient(180deg, rgba(8, 16, 28, 0.96), rgba(8, 16, 28, 0.9)),
    radial-gradient(circle at top left, rgba(73, 197, 182, 0.12), transparent 32%);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  box-shadow: -24px 0 80px rgba(0, 0, 0, 0.34);
}

.star-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.star-panel__headline {
  display: grid;
  gap: 0.35rem;
}

.star-panel__eyebrow {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(212, 230, 255, 0.56);
}

.star-panel__title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.7rem;
  font-weight: 600;
  color: #f7fbff;
  margin: 0;
}

.star-panel__description {
  margin: 0 0 1rem;
  font-size: 0.95rem;
  line-height: 1.65;
  color: rgba(223, 235, 251, 0.72);
}

.star-panel__close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  transition: transform 150ms ease, background 150ms ease, border-color 150ms ease;
}

.star-panel__close:hover,
.star-panel__close:focus-visible {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}

.star-panel__note {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.62);
  font-style: italic;
}

.star-panel__warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  background: rgba(234, 88, 12, 0.1);
  border: 1px solid rgba(234, 88, 12, 0.2);
  border-radius: 0.6rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.star-panel__warning i {
  color: var(--pegger-orange, #ea580c);
}

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
    transform: translateX(42px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes panelFall {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(28px);
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

@media (max-width: 900px) {
  .star-panel {
    top: auto;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: auto;
    max-height: min(78vh, 42rem);
  }

  .star-panel__content {
    max-height: inherit;
    padding: 1.15rem 1rem 1.5rem;
    border-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-top-left-radius: 1.4rem;
    border-top-right-radius: 1.4rem;
    box-shadow: 0 -24px 80px rgba(0, 0, 0, 0.34);
  }

  @keyframes panelRise {
    from {
      opacity: 0;
      transform: translateY(42px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes panelFall {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(28px);
    }
  }
}
</style>

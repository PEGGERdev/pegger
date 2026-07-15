<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useMouse } from '@vueuse/core'
import { usePeggerRuntime } from '@/composables/usePeggerRuntime.js'
import Star from './Star.vue'
import CenterPresence from './CenterPresence.vue'
import ConstellationLines from './ConstellationLines.vue'

const emit = defineEmits(['star-click', 'focus-change'])

const containerRef = ref(null)
const { x: mouseX, y: mouseY } = useMouse()
const { getPanelView, starMapView } = usePeggerRuntime()

const viewport = ref({ x: 0, y: 0, scale: 1 })
const containerSize = ref({ width: 0, height: 0 })
const liveStarPositions = ref({})
const hoveredStarId = ref(null)
const selectedStarId = ref(null)
const isDragging = ref(false)
const dragDistance = ref(0)
const suppressClick = ref(false)
const guideDismissed = ref(false)

const MIN_SCALE = 0.72
const MAX_SCALE = 2.2
const ZOOM_STEP = 0.14
const FOCUS_SCALE = 1.5
const FEATURED_STAR_IDS = ['portfolio', 'spotonsight', 'contact']

let activePointerId = null
let dragStart = { x: 0, y: 0, viewportX: 0, viewportY: 0 }

const allStars = computed(() => starMapView.value.allStars)
const mobileStars = computed(() => allStars.value.filter(star => star.type === 'bright'))
const isMobile = computed(() => (containerSize.value.width || window.innerWidth) < 900)

const starLookup = computed(() => {
  const entries = [...allStars.value, starMapView.value.center].map(star => [star.id, star])
  return Object.fromEntries(entries)
})

const selectedStar = computed(() => selectedStarId.value ? starLookup.value[selectedStarId.value] : null)
const featuredStars = computed(() => FEATURED_STAR_IDS
  .map(id => starLookup.value[id])
  .filter(Boolean))

const selectedPanel = computed(() => {
  if (!selectedStar.value?.panel) {
    return null
  }

  return getPanelView(selectedStar.value.panel)
})

const focusFacts = computed(() => selectedStar.value?.data?.facts || [])

const focusAction = computed(() => {
  if (!selectedStar.value) {
    return null
  }

  if (selectedStar.value.panel) {
    return {
      kind: 'panel',
      label: 'Open detailed panel',
      icon: 'bi-arrow-up-right',
    }
  }

  if (selectedStar.value.data?.url) {
    return {
      kind: 'link',
      label: 'Open related link',
      icon: 'bi-box-arrow-up-right',
      href: selectedStar.value.data.url,
    }
  }

  if (selectedStar.value.data?.email) {
    return {
      kind: 'mail',
      label: 'Send an email',
      icon: 'bi-envelope-arrow-up',
      href: `mailto:${selectedStar.value.data.email}`,
    }
  }

  return null
})

const connectedNodeIds = computed(() => {
  if (!selectedStarId.value) {
    return []
  }

  return starMapView.value.connections.reduce((ids, connection) => {
    if (connection.from === selectedStarId.value) {
      ids.push(connection.to)
    } else if (connection.to === selectedStarId.value) {
      ids.push(connection.from)
    }

    return ids
  }, [])
})

const connectedNodes = computed(() => connectedNodeIds.value
  .map(id => starLookup.value[id])
  .filter(Boolean))

const otherNodes = computed(() => allStars.value.filter(star => {
  if (!selectedStarId.value) {
    return true
  }

  return star.id !== selectedStarId.value && !connectedNodeIds.value.includes(star.id)
}))

const detailLevel = computed(() => {
  if (selectedStar.value || viewport.value.scale >= 1.5) {
    return 'close'
  }

  if (viewport.value.scale >= 1.12) {
    return 'mid'
  }

  return 'overview'
})

const visibleDimStars = computed(() => {
  if (selectedStar.value) {
    return allStars.value.filter(star => star.type !== 'bright')
  }

  if (viewport.value.scale < 0.98) {
    return []
  }

  if (viewport.value.scale < 1.18) {
    const previewIds = ['vue', 'docker', 'cicd', 'vite']
    return allStars.value.filter(star => star.type !== 'bright' && previewIds.includes(star.id))
  }

  return allStars.value.filter(star => star.type !== 'bright')
})

const renderedStars = computed(() => {
  if (selectedStar.value) {
    return allStars.value.filter(star => (
      star.id === selectedStar.value.id || connectedNodeIds.value.includes(star.id)
    ))
  }

  const brightStars = allStars.value.filter(star => {
    if (star.type !== 'bright') {
      return false
    }

    if (!selectedStar.value && viewport.value.scale < 1.05) {
      return FEATURED_STAR_IDS.includes(star.id)
    }

    return true
  })

  return [...brightStars, ...visibleDimStars.value]
})

const visibleNodeIds = computed(() => {
  const ids = new Set(renderedStars.value.map(star => star.id))

  if (selectedStar.value) {
    ids.add(selectedStar.value.id)
  }

  ids.add('you')
  return ids
})

const visibleConnections = computed(() => starMapView.value.connections.filter(connection => {
  return visibleNodeIds.value.has(connection.from) && visibleNodeIds.value.has(connection.to)
}))

const interactionScaleLabel = computed(() => `${Math.round(viewport.value.scale * 100)}%`)

const navigationHint = computed(() => {
  if (selectedStar.value) {
    return 'Follow the connected cluster, then use the drawer for direct actions and deeper detail.'
  }

  if (isDragging.value) {
    return 'Release to settle the camera into its new position.'
  }

  return 'Start with a featured node, then drag to pan or scroll to reveal the wider network.'
})

const orbitSize = computed(() => {
  const width = containerSize.value.width || window.innerWidth
  const height = containerSize.value.height || window.innerHeight

  return {
    x: Math.max(420, Math.min(width * 0.58, 760)),
    y: Math.max(300, Math.min(height * 0.46, 560)),
  }
})

const cameraCenter = computed(() => ({
  x: containerSize.value.width * (isMobile.value ? 0.5 : 0.62) + viewport.value.x,
  y: containerSize.value.height / 2 + viewport.value.y,
}))

const focusAnchor = computed(() => {
  const width = containerSize.value.width || window.innerWidth
  const height = containerSize.value.height || window.innerHeight
  const mobile = width < 900

  return {
    x: width * (mobile ? 0.5 : 0.58) + viewport.value.x,
    y: height * 0.52 + viewport.value.y,
  }
})

const centerPosition = computed(() => {
  if (selectedStar.value?.id === 'you') {
    return focusAnchor.value
  }

  if (selectedStar.value) {
    const width = containerSize.value.width || window.innerWidth
    const height = containerSize.value.height || window.innerHeight

    return {
      x: focusAnchor.value.x - Math.min(width * 0.16, 160),
      y: focusAnchor.value.y - Math.min(height * 0.18, 160),
    }
  }

  return cameraCenter.value
})

const defaultPositions = computed(() => {
  const positions = {}

  allStars.value.forEach(star => {
    positions[star.id] = {
      x: cameraCenter.value.x + (star.position.x / 100) * orbitSize.value.x * viewport.value.scale,
      y: cameraCenter.value.y + (star.position.y / 100) * orbitSize.value.y * viewport.value.scale,
    }
  })

  positions.you = centerPosition.value

  return positions
})

const renderedPositions = computed(() => {
  const positions = { ...starPositions.value }

  Object.entries(liveStarPositions.value).forEach(([id, position]) => {
    if (visibleNodeIds.value.has(id)) {
      positions[id] = position
    }
  })

  return positions
})

function getBaseAngle(star) {
  return Math.atan2(star.position.y || 0, star.position.x || 1)
}

const starPositions = computed(() => {
  if (!selectedStar.value) {
    return defaultPositions.value
  }

  const positions = {}
  const connected = connectedNodes.value.filter(node => node.id !== 'you')
  const secondary = otherNodes.value.filter(node => node.id !== 'you')
  const width = containerSize.value.width || window.innerWidth
  const height = containerSize.value.height || window.innerHeight
  const connectedRadiusX = Math.min(width * 0.24, 300) * Math.max(0.92, viewport.value.scale)
  const connectedRadiusY = Math.min(height * 0.2, 220) * Math.max(0.92, viewport.value.scale)
  const outerRadiusX = connectedRadiusX + Math.min(width * 0.18, 220)
  const outerRadiusY = connectedRadiusY + Math.min(height * 0.14, 160)

  positions.you = centerPosition.value

  positions[selectedStar.value.id] = {
    x: focusAnchor.value.x,
    y: focusAnchor.value.y,
  }

  connected.forEach((star, index) => {
    const angle = -Math.PI / 2 + (index / Math.max(connected.length, 1)) * Math.PI * 2
    const radiusScale = 1 + (index % 2) * 0.14

    positions[star.id] = {
      x: focusAnchor.value.x + Math.cos(angle) * connectedRadiusX * radiusScale,
      y: focusAnchor.value.y + Math.sin(angle) * connectedRadiusY * radiusScale,
    }
  })

  secondary.forEach((star, index) => {
    const angle = getBaseAngle(star) + index * 0.08
    const wave = (index % 3) * 0.06 + 0.92

    positions[star.id] = {
      x: focusAnchor.value.x + Math.cos(angle) * outerRadiusX * wave,
      y: focusAnchor.value.y + Math.sin(angle) * outerRadiusY * wave,
    }
  })

  return positions
})

function isConnected(starId) {
  return connectedNodeIds.value.includes(starId)
}

function isMuted(starId) {
  if (!selectedStarId.value) {
    return false
  }

  return starId !== selectedStarId.value && !isConnected(starId)
}

function clampScale(nextScale) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale))
}

function updateContainerMetrics() {
  if (!containerRef.value) {
    return
  }

  const rect = containerRef.value.getBoundingClientRect()
  containerSize.value = {
    width: rect.width,
    height: rect.height,
  }
}

function getWorldPoint(clientX, clientY) {
  if (!containerRef.value) {
    return { x: 0, y: 0 }
  }

  const rect = containerRef.value.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  return {
    x: (clientX - rect.left - centerX - viewport.value.x) / viewport.value.scale,
    y: (clientY - rect.top - centerY - viewport.value.y) / viewport.value.scale,
  }
}

function zoomAtPoint(nextScale, clientX, clientY) {
  if (!containerRef.value || selectedStar.value) {
    viewport.value = {
      ...viewport.value,
      scale: clampScale(nextScale),
    }
    return
  }

  const scale = clampScale(nextScale)
  const worldPoint = getWorldPoint(clientX, clientY)
  const rect = containerRef.value.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  viewport.value = {
    x: clientX - rect.left - centerX - worldPoint.x * scale,
    y: clientY - rect.top - centerY - worldPoint.y * scale,
    scale,
  }
}

function nudgeZoom(direction) {
  if (!containerRef.value) {
    return
  }

  guideDismissed.value = true
  const rect = containerRef.value.getBoundingClientRect()
  const nextScale = viewport.value.scale + ZOOM_STEP * direction
  zoomAtPoint(nextScale, rect.left + rect.width / 2, rect.top + rect.height / 2)
}

function resetViewport() {
  selectedStarId.value = null
  emit('focus-change', null)
  liveStarPositions.value = {}
  viewport.value = { x: 0, y: 0, scale: 1 }
}

function focusOnStar(starId) {
  selectedStarId.value = starId
  emit('focus-change', starId)
  viewport.value = {
    x: 0,
    y: 0,
    scale: Math.max(viewport.value.scale, FOCUS_SCALE),
  }
}

function openSelectedPanel() {
  if (selectedStar.value?.panel) {
    emit('star-click', selectedStar.value.panel)
  }
}

function openSelectedAction() {
  if (!focusAction.value) {
    return
  }

  if (focusAction.value.kind === 'panel') {
    openSelectedPanel()
    return
  }

  if (focusAction.value.kind === 'mail') {
    window.location.href = focusAction.value.href
    return
  }

  window.open(focusAction.value.href, '_blank', 'noopener,noreferrer')
}

function handleStarHover(starId) {
  hoveredStarId.value = starId
}

function handleStarClick(starId) {
  if (suppressClick.value) {
    return
  }

  guideDismissed.value = true
  const star = starLookup.value[starId]

  if (selectedStarId.value === starId) {
    openSelectedPanel()
    return
  }

  focusOnStar(starId)

  if (star?.panel) {
    emit('star-click', star.panel)
  }
}

function focusFeaturedStar(starId) {
  guideDismissed.value = true
  handleStarClick(starId)
}

function handleStarPositionChange({ id, position }) {
  liveStarPositions.value = {
    ...liveStarPositions.value,
    [id]: position,
  }
}

function handlePointerDown(event) {
  if (!containerRef.value) {
    return
  }

  if (event.target.closest('button, a')) {
    return
  }

  guideDismissed.value = true

  activePointerId = event.pointerId
  dragDistance.value = 0
  isDragging.value = false
  dragStart = {
    x: event.clientX,
    y: event.clientY,
    viewportX: viewport.value.x,
    viewportY: viewport.value.y,
  }

  containerRef.value.setPointerCapture(event.pointerId)
}

function handlePointerMove(event) {
  if (activePointerId !== event.pointerId) {
    return
  }

  const deltaX = event.clientX - dragStart.x
  const deltaY = event.clientY - dragStart.y
  dragDistance.value = Math.hypot(deltaX, deltaY)

  if (dragDistance.value > 4) {
    isDragging.value = true
    suppressClick.value = true
  }

  if (!isDragging.value) {
    return
  }

  viewport.value = {
    ...viewport.value,
    x: dragStart.viewportX - deltaX,
    y: dragStart.viewportY - deltaY,
  }
}

function handlePointerUp(event) {
  if (activePointerId !== event.pointerId) {
    return
  }

  if (containerRef.value?.hasPointerCapture(event.pointerId)) {
    containerRef.value.releasePointerCapture(event.pointerId)
  }

  activePointerId = null
  isDragging.value = false

  window.setTimeout(() => {
    suppressClick.value = false
  }, 60)
}

function handlePointerLeave() {
  hoveredStarId.value = null
}

function handleWheel(event) {
  if (isMobile.value) {
    return
  }

  event.preventDefault()
  guideDismissed.value = true
  const direction = event.deltaY > 0 ? -1 : 1
  const nextScale = viewport.value.scale + ZOOM_STEP * direction
  zoomAtPoint(nextScale, event.clientX, event.clientY)
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    resetViewport()
  }

  if (event.key === '+' || event.key === '=') {
    event.preventDefault()
    nudgeZoom(1)
  }

  if (event.key === '-') {
    event.preventDefault()
    nudgeZoom(-1)
  }
}

onMounted(() => {
  updateContainerMetrics()
  window.addEventListener('resize', updateContainerMetrics)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerMetrics)
})
</script>

<template>
  <div
    ref="containerRef"
    class="star-map"
    :class="{ 'star-map--dragging': isDragging, 'star-map--focused': selectedStar }"
    tabindex="0"
    role="region"
    aria-label="Interactive constellation map"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerUp"
    @pointerleave="handlePointerLeave"
    @wheel="handleWheel"
    @keydown="handleKeydown"
  >
    <section v-if="isMobile" class="star-map__mobile" aria-labelledby="mobile-map-title" data-aos="fade-up">
      <header class="star-map__mobile-header">
        <div>
          <p class="star-map__eyebrow">Constellation directory</p>
          <h2 id="mobile-map-title" class="star-map__mobile-title">Explore the work</h2>
        </div>
        <span class="star-map__mobile-count">{{ mobileStars.length }} paths</span>
      </header>

      <p class="star-map__mobile-intro">
        Choose a path for project details, professional links, direct contact, or protected infrastructure access.
      </p>

      <div class="star-map__mobile-grid">
        <button
          v-for="star in mobileStars"
          :key="star.id"
          class="star-map__mobile-node"
          :class="{ 'star-map__mobile-node--selected': selectedStarId === star.id }"
          type="button"
          @click="focusFeaturedStar(star.id)"
        >
          <span class="star-map__mobile-icon">
            <i :class="star.icon || 'bi-stars'" />
          </span>
          <span class="star-map__mobile-category">{{ star.category }}</span>
          <strong>{{ star.label }}</strong>
          <small>{{ star.data?.description }}</small>
          <span class="star-map__mobile-action">
            Explore
            <i class="bi bi-arrow-up-right" />
          </span>
        </button>
      </div>
    </section>

    <template v-else>
      <div class="star-map__grid" />
      <div class="star-map__vignette" />

    <aside class="star-map__hud star-map__hud--status" @pointerdown.stop @wheel.stop>
      <p class="star-map__eyebrow">Explorer</p>
      <h2 class="star-map__title">Guided constellation</h2>
      <p class="star-map__hint">{{ navigationHint }}</p>
      <div class="star-map__metrics">
        <span>{{ interactionScaleLabel }}</span>
        <span>{{ renderedStars.length }} visible nodes</span>
        <span>{{ visibleConnections.length }} visible links</span>
      </div>
    </aside>

    <aside
      v-if="!selectedStar && !guideDismissed"
      class="star-map__hud star-map__hud--guide"
      @pointerdown.stop
      @wheel.stop
    >
      <div class="star-map__guide-header">
        <div>
          <p class="star-map__eyebrow">Start Here</p>
          <h3 class="star-map__guide-title">Choose a featured path into the work.</h3>
        </div>
        <button class="star-map__close" type="button" @click="guideDismissed = true" aria-label="Dismiss guide">
          <i class="bi bi-x-lg" />
        </button>
      </div>

      <p class="star-map__guide-copy">
        Featured nodes open the most useful detail first. Pan and zoom only after the story is clear.
      </p>

      <div class="star-map__guide-actions">
        <button
          v-for="star in featuredStars"
          :key="star.id"
          class="star-map__guide-action"
          type="button"
          @click="focusFeaturedStar(star.id)"
        >
          <span class="star-map__guide-icon">
            <i :class="star.icon || 'bi-stars'" />
          </span>
          <span class="star-map__guide-copy-block">
            <strong>{{ star.label }}</strong>
            <small>{{ star.data?.description || star.category || 'Featured node' }}</small>
          </span>
        </button>
      </div>
    </aside>

    <aside
      v-if="selectedStar"
      class="star-map__hud star-map__hud--focus"
      @pointerdown.stop
      @wheel.stop
    >
      <div class="star-map__focus-header">
        <div>
          <p class="star-map__eyebrow">Focused node</p>
          <h3 class="star-map__focus-title">
            <i v-if="selectedStar.icon" :class="selectedStar.icon" />
            <span>{{ selectedStar.label }}</span>
          </h3>
        </div>
        <button class="star-map__close" type="button" aria-label="Exit focused node" @click="resetViewport">
          <i class="bi bi-x-lg" />
        </button>
      </div>

      <p class="star-map__focus-copy">
        {{ selectedStar.data?.detail || selectedStar.data?.description || 'Explore the surrounding nodes and connections in this cluster.' }}
      </p>

      <div class="star-map__focus-tags">
        <span v-if="selectedStar.category">{{ selectedStar.category }}</span>
        <span>{{ connectedNodes.length }} direct links</span>
        <span v-if="selectedPanel?.title">{{ selectedPanel.title }}</span>
      </div>

      <div v-if="focusFacts.length" class="star-map__facts">
        <div v-for="fact in focusFacts" :key="fact" class="star-map__fact">
          <i class="bi bi-dot" />
          <span>{{ fact }}</span>
        </div>
      </div>

      <div class="star-map__connected-list">
        <button
          v-for="node in connectedNodes"
          :key="node.id"
          class="star-map__connected-item"
          type="button"
          @click="focusOnStar(node.id)"
        >
          <span class="star-map__connected-icon">
            <i :class="node.icon || 'bi-stars'" />
          </span>
          <span class="star-map__connected-copy">
            <strong>{{ node.label }}</strong>
            <small>{{ node.data?.description || node.category || 'Connected node' }}</small>
          </span>
        </button>
      </div>

      <button
        v-if="focusAction"
        class="star-map__panel-action"
        type="button"
        @click="openSelectedAction"
      >
        {{ focusAction.label }}
        <i :class="focusAction.icon" />
      </button>
    </aside>

    <div class="star-map__hud star-map__hud--controls" @pointerdown.stop @wheel.stop>
      <button class="star-map__control" type="button" aria-label="Zoom in" @click="nudgeZoom(1)">
        <i class="bi bi-plus-lg" />
      </button>
      <button class="star-map__control" type="button" aria-label="Zoom out" @click="nudgeZoom(-1)">
        <i class="bi bi-dash-lg" />
      </button>
      <button class="star-map__control star-map__control--wide" type="button" @click="resetViewport">
        {{ selectedStar ? 'Exit focus' : 'Reset view' }}
      </button>
    </div>

    <ConstellationLines
      :connections="visibleConnections"
      :positions="renderedPositions"
      :center="centerPosition"
      :hovered-star="hoveredStarId"
      :selected-star="selectedStarId"
    />

    <CenterPresence
      :center="starMapView.center"
      :position="centerPosition"
      :selected="selectedStarId === 'you'"
      :map-focused="Boolean(selectedStar)"
      :detail-level="detailLevel"
      @click="focusOnStar"
    />

      <Star
        v-for="star in renderedStars"
        :key="star.id"
        :star="star"
        :position="starPositions[star.id]"
        :mouse-x="mouseX"
        :mouse-y="mouseY"
        :selected="star.id === selectedStarId"
        :connected="isConnected(star.id)"
        :muted="isMuted(star.id)"
        :detail-level="detailLevel"
        @hover="handleStarHover"
        @click="handleStarClick"
        @position-change="handleStarPositionChange"
      />
    </template>
  </div>
</template>

<style scoped>
.star-map {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
  cursor: grab;
}

.star-map--dragging {
  cursor: grabbing;
}

.star-map__grid,
.star-map__vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star-map__grid {
  background:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 82px 82px;
  mask-image: radial-gradient(circle at center, black 42%, transparent 92%);
  opacity: 0.46;
}

.star-map__vignette {
  background:
    radial-gradient(circle at center, transparent 36%, rgba(5, 8, 14, 0.18) 60%, rgba(5, 8, 14, 0.76) 100%),
    linear-gradient(180deg, rgba(9, 13, 25, 0.08), rgba(9, 13, 25, 0.36));
}

.star-map__mobile {
  display: none;
}

.star-map__hud {
  position: absolute;
  z-index: 12;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(180deg, rgba(7, 12, 22, 0.7), rgba(7, 12, 22, 0.38));
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
}

.star-map__hud--status {
  top: 1.5rem;
  right: 1.5rem;
  width: min(20rem, calc(100vw - 3rem));
  padding: 1rem 1.1rem;
  border-radius: 1.1rem;
}

.star-map__hud--focus {
  top: 1.5rem;
  left: 1.5rem;
  width: min(25rem, calc(100vw - 3rem));
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  padding: 1.15rem;
  border-radius: 1.2rem;
}

.star-map__hud--guide {
  left: 50%;
  bottom: 1.5rem;
  width: min(34rem, calc(100vw - 18rem));
  padding: 1rem;
  border-radius: 1.3rem;
  transform: translateX(-50%);
}

.star-map__hud--controls {
  right: 1.5rem;
  bottom: 1.5rem;
  display: flex;
  gap: 0.65rem;
  padding: 0.7rem;
  border-radius: 999px;
}

.star-map__eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.56);
}

.star-map__title,
.star-map__focus-title {
  margin: 0;
  color: rgba(255, 255, 255, 0.96);
}

.star-map__title {
  font-size: 1.1rem;
}

.star-map__guide-title {
  margin: 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.96);
}

.star-map__focus-title {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  font-size: 1.15rem;
}

.star-map__hint,
.star-map__focus-copy,
.star-map__guide-copy {
  margin: 0.45rem 0 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.68);
}

.star-map__guide-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.star-map__guide-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
  margin-top: 1rem;
}

.star-map__guide-action {
  min-width: 0;
  padding: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.7rem;
  align-items: center;
  text-align: left;
  cursor: pointer;
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
}

.star-map__guide-action:hover,
.star-map__guide-action:focus-visible {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(90, 167, 255, 0.24);
}

.star-map__guide-icon {
  width: 2.2rem;
  height: 2.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(73, 197, 182, 0.24), rgba(90, 167, 255, 0.18));
  color: rgba(255, 255, 255, 0.96);
}

.star-map__guide-copy-block {
  min-width: 0;
  display: grid;
  gap: 0.15rem;
}

.star-map__guide-copy-block strong {
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.94);
}

.star-map__guide-copy-block small {
  font-size: 0.72rem;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.58);
}

.star-map__metrics,
.star-map__focus-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.95rem;
}

.star-map__metrics span,
.star-map__focus-tags span {
  padding: 0.45rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.84);
  font-size: 0.78rem;
}

.star-map__focus-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.star-map__close,
.star-map__control,
.star-map__connected-item,
.star-map__panel-action {
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
}

.star-map__close,
.star-map__control {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.92);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.star-map__close {
  width: 2.3rem;
  height: 2.3rem;
}

.star-map__control {
  width: 2.8rem;
  height: 2.8rem;
}

.star-map__close:hover,
.star-map__control:hover,
.star-map__connected-item:hover,
.star-map__panel-action:hover,
.star-map__close:focus-visible,
.star-map__control:focus-visible,
.star-map__connected-item:focus-visible,
.star-map__panel-action:focus-visible {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.2);
}

.star-map__control--wide {
  width: auto;
  padding: 0 1rem;
  font: inherit;
}

.star-map__connected-list {
  display: grid;
  gap: 0.6rem;
  margin-top: 1rem;
}

.star-map__facts {
  display: grid;
  gap: 0.45rem;
  margin-top: 1rem;
}

.star-map__fact {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.35rem;
  align-items: start;
  padding: 0.55rem 0.7rem;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.78rem;
  line-height: 1.4;
}

.star-map__fact i {
  color: rgba(95, 208, 191, 0.82);
}

.star-map__connected-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.8rem;
  align-items: center;
  width: 100%;
  padding: 0.75rem 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.star-map__connected-icon {
  width: 2.3rem;
  height: 2.3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(95, 208, 191, 0.14);
  color: rgba(255, 255, 255, 0.92);
}

.star-map__connected-copy {
  display: grid;
  gap: 0.15rem;
}

.star-map__connected-copy strong {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.92);
}

.star-map__connected-copy small {
  font-size: 0.72rem;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.58);
}

.star-map__panel-action {
  width: 100%;
  margin-top: 1rem;
  padding: 0.95rem 1rem;
  border: 1px solid rgba(95, 208, 191, 0.28);
  border-radius: 1rem;
  background: linear-gradient(135deg, rgba(31, 124, 114, 0.24), rgba(47, 110, 168, 0.22));
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
}

@media (min-width: 901px) and (max-height: 820px) {
  .star-map__hud--guide {
    right: 1.5rem;
    bottom: 6.5rem;
    left: auto;
    width: clamp(18rem, calc(100vw - 36rem), 30rem);
    transform: none;
  }

  .star-map__guide-copy {
    display: none;
  }

  .star-map__guide-actions {
    margin-top: 0.7rem;
  }

  .star-map__guide-action {
    padding: 0.65rem;
  }

  .star-map__guide-copy-block small {
    display: none;
  }
}

@media (min-width: 901px) and (max-width: 1100px) and (max-height: 820px) {
  .star-map__guide-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .star-map {
    height: auto;
    overflow: visible;
    touch-action: auto;
    cursor: default;
  }

  .star-map__mobile {
    position: relative;
    display: grid;
    gap: 1rem;
    padding: 1.1rem;
    border: 1px solid rgba(166, 205, 255, 0.12);
    border-radius: 1.35rem;
    background:
      linear-gradient(180deg, rgba(7, 16, 28, 0.82), rgba(7, 16, 28, 0.64)),
      radial-gradient(circle at top right, rgba(90, 167, 255, 0.16), transparent 34%);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
  }

  .star-map__mobile::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.12) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: linear-gradient(135deg, black, transparent 72%);
    pointer-events: none;
  }

  .star-map__mobile-header {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .star-map__mobile-title {
    margin: 0;
    font-size: 1.55rem;
    color: rgba(255, 255, 255, 0.98);
  }

  .star-map__mobile-count {
    flex: 0 0 auto;
    padding: 0.45rem 0.7rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.74rem;
  }

  .star-map__mobile-intro {
    position: relative;
    margin: 0;
    max-width: 38rem;
    color: rgba(223, 235, 251, 0.68);
    font-size: 0.88rem;
    line-height: 1.55;
  }

  .star-map__mobile-grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.7rem;
  }

  .star-map__mobile-node {
    min-width: 0;
    min-height: 10.5rem;
    padding: 0.9rem;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 1.05rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.025));
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  }

  .star-map__mobile-node:hover,
  .star-map__mobile-node:focus-visible,
  .star-map__mobile-node--selected {
    transform: translateY(-2px);
    border-color: rgba(95, 208, 191, 0.34);
    background: linear-gradient(145deg, rgba(73, 197, 182, 0.13), rgba(90, 167, 255, 0.06));
  }

  .star-map__mobile-icon {
    width: 2.5rem;
    height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.85rem;
    background: linear-gradient(135deg, rgba(73, 197, 182, 0.26), rgba(90, 167, 255, 0.2));
    color: rgba(255, 255, 255, 0.96);
  }

  .star-map__mobile-category {
    margin-top: 0.75rem;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.48);
  }

  .star-map__mobile-node strong {
    margin-top: 0.2rem;
    color: rgba(255, 255, 255, 0.96);
    font-family: var(--pegger-font-display);
    font-size: 0.98rem;
  }

  .star-map__mobile-node small {
    margin-top: 0.25rem;
    color: rgba(223, 235, 251, 0.58);
    font-size: 0.7rem;
    line-height: 1.4;
  }

  .star-map__mobile-action {
    margin-top: auto;
    padding-top: 0.7rem;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: rgba(95, 208, 191, 0.86);
    font-size: 0.72rem;
    font-weight: 600;
  }

  .star-map__mobile-node:last-child {
    grid-column: 1 / -1;
    min-height: 8.75rem;
  }
}

@media (max-width: 370px) {
  .star-map__mobile-grid {
    grid-template-columns: 1fr;
  }

  .star-map__mobile-node {
    min-height: 8.5rem;
  }
}
</style>

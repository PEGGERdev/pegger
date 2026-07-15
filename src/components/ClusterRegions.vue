<script setup>
import { computed } from 'vue'
import theme from '@/config/theme'

const props = defineProps({
  clusters: {
    type: Array,
    default: () => [],
  },
  positions: {
    type: Object,
    required: true,
  },
  visibleNodeIds: {
    type: Array,
    default: () => [],
  },
  selectedStarId: {
    type: String,
    default: null,
  },
})

const LABEL_WIDTH = 150
const visibleIds = computed(() => new Set(props.visibleNodeIds))

const regions = computed(() => props.clusters.map((cluster, index) => {
  const memberIds = props.selectedStarId
    ? cluster.memberIds.filter(id => visibleIds.value.has(id))
    : cluster.memberIds
  const points = memberIds
    .map(id => props.positions[id])
    .filter(position => Number.isFinite(position?.x) && Number.isFinite(position?.y))

  if (points.length < (props.selectedStarId ? 2 : 1)) {
    return null
  }

  const xValues = points.map(point => point.x)
  const yValues = points.map(point => point.y)
  const minX = Math.min(...xValues)
  const maxX = Math.max(...xValues)
  const minY = Math.min(...yValues)
  const maxY = Math.max(...yValues)
  const paddingX = Math.min(64, 42 + points.length * 3)
  const paddingY = Math.min(52, 32 + points.length * 2)
  const radiusX = Math.max(76, (maxX - minX) / 2 + paddingX)
  const radiusY = Math.max(54, (maxY - minY) / 2 + paddingY)
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2
  const tone = theme.clusterTones[cluster.tone] || theme.clusterTones.mint
  const visibleCount = cluster.memberIds.filter(id => visibleIds.value.has(id)).length

  return {
    ...cluster,
    sequence: cluster.sequence || String(index + 1).padStart(2, '0'),
    centerX,
    centerY,
    radiusX,
    radiusY,
    labelX: centerX + radiusX - LABEL_WIDTH - 16,
    labelY: centerY - radiusY - 18,
    isActive: Boolean(props.selectedStarId && cluster.memberIds.includes(props.selectedStarId)),
    isDormant: visibleCount === 0,
    style: {
      '--cluster-color': tone.color,
      '--cluster-rgb': tone.rgb,
    },
  }
}).filter(Boolean))
</script>

<template>
  <svg class="cluster-regions" aria-hidden="true" focusable="false">
    <g
      v-for="region in regions"
      :key="region.id"
      class="cluster-region"
      :class="{
        'cluster-region--active': region.isActive,
        'cluster-region--dormant': region.isDormant,
      }"
      :style="region.style"
      :data-cluster-id="region.id"
    >
      <ellipse
        class="cluster-region__field"
        :cx="region.centerX"
        :cy="region.centerY"
        :rx="region.radiusX"
        :ry="region.radiusY"
      />
      <ellipse
        class="cluster-region__orbit"
        :cx="region.centerX"
        :cy="region.centerY"
        :rx="Math.max(1, region.radiusX - 10)"
        :ry="Math.max(1, region.radiusY - 10)"
        pathLength="1"
      />
      <g class="cluster-region__label" :transform="`translate(${region.labelX} ${region.labelY})`">
        <rect :width="LABEL_WIDTH" height="30" rx="4" />
        <line x1="0" y1="0" x2="40" y2="0" />
        <text class="cluster-region__sequence" x="10" y="19">{{ region.sequence }}</text>
        <text class="cluster-region__name" x="38" y="19">{{ region.label }}</text>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.cluster-regions {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.cluster-region {
  opacity: 0.7;
  transition: opacity 320ms ease;
}

.cluster-region__field {
  fill: rgba(var(--cluster-rgb), 0.025);
  stroke: rgba(var(--cluster-rgb), 0.2);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.cluster-region__orbit {
  fill: none;
  stroke: rgba(var(--cluster-rgb), 0.12);
  stroke-width: 1;
  stroke-dasharray: 0.01 0.035;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.cluster-region__label rect {
  fill: rgba(5, 11, 20, 0.82);
  stroke: rgba(var(--cluster-rgb), 0.2);
  stroke-width: 1;
}

.cluster-region__label line {
  stroke: var(--cluster-color);
  stroke-width: 1;
  filter: drop-shadow(0 0 5px rgba(var(--cluster-rgb), 0.7));
}

.cluster-region__label text {
  dominant-baseline: auto;
  font-family: var(--pegger-font-display);
  text-transform: uppercase;
}

.cluster-region__sequence {
  fill: var(--cluster-color);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 1px;
}

.cluster-region__name {
  fill: rgba(224, 238, 251, 0.56);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 1.1px;
  text-transform: uppercase;
}

.cluster-region--dormant {
  opacity: 0.2;
}

.cluster-region--active {
  opacity: 1;
}

.cluster-region--active .cluster-region__field {
  fill: rgba(var(--cluster-rgb), 0.045);
  stroke: rgba(var(--cluster-rgb), 0.44);
  filter: drop-shadow(0 0 18px rgba(var(--cluster-rgb), 0.1));
}

.cluster-region--active .cluster-region__orbit {
  stroke: rgba(var(--cluster-rgb), 0.36);
  animation: clusterSignal 8s linear infinite;
}

.cluster-region--active .cluster-region__label rect {
  fill: rgba(5, 11, 20, 0.94);
  stroke: rgba(var(--cluster-rgb), 0.46);
}

.cluster-region--active .cluster-region__name {
  fill: rgba(239, 248, 255, 0.86);
}

@keyframes clusterSignal {
  to {
    stroke-dashoffset: -1;
  }
}
</style>

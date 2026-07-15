<script setup>
import { computed } from 'vue'

const props = defineProps({
  connections: {
    type: Array,
    required: true
  },
  positions: {
    type: Object,
    required: true
  },
  center: {
    type: Object,
    required: true
  },
  hoveredStar: {
    type: String,
    default: null
  },
  selectedStar: {
    type: String,
    default: null
  },
})

const visibleConnections = computed(() => {
  return props.connections.map(conn => {
    const fromPos = props.positions[conn.from] || props.center
    const toPos = props.positions[conn.to] || props.center
    
    return {
      ...conn,
      x1: fromPos.x,
      y1: fromPos.y,
      x2: toPos.x,
      y2: toPos.y,
      isActive: isHighlighted(conn),
      isSelected: isConnectedToSelected(conn),
    }
  })
})

function isConnectedToSelected(conn) {
  if (!props.selectedStar) return false
  return conn.from === props.selectedStar || conn.to === props.selectedStar
}

function isConnectedToHovered(conn) {
  if (!props.hoveredStar) return false
  return conn.from === props.hoveredStar || conn.to === props.hoveredStar
}

function isHighlighted(conn) {
  if (props.selectedStar) {
    return isConnectedToSelected(conn)
  }

  return isConnectedToHovered(conn)
}

</script>

<template>
  <svg class="constellation-lines" aria-hidden="true" focusable="false">
    <g
      v-for="conn in visibleConnections"
      :key="`${conn.from}-${conn.to}`"
      class="constellation-connection"
    >
      <line
        class="constellation-line__track"
        :x1="conn.x1"
        :y1="conn.y1"
        :x2="conn.x2"
        :y2="conn.y2"
        vector-effect="non-scaling-stroke"
      />
      <line
        :x1="conn.x1"
        :y1="conn.y1"
        :x2="conn.x2"
        :y2="conn.y2"
        pathLength="1"
        vector-effect="non-scaling-stroke"
        :class="[
          'constellation-line',
          `constellation-line--${conn.strength}`,
          {
            'constellation-line--active': conn.isActive,
            'constellation-line--selected': conn.isSelected,
          }
        ]"
      />
      <circle
        v-if="conn.isActive"
        class="constellation-line__signal"
        :cx="conn.x2"
        :cy="conn.y2"
        r="2.4"
      />
    </g>
  </svg>
</template>

<style scoped>
.constellation-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  overflow: visible;
}

.constellation-line__track {
  stroke: rgba(159, 197, 228, 0.04);
  stroke-width: 1.5;
  stroke-linecap: round;
}

.constellation-line {
  stroke-linecap: round;
  transition: opacity 320ms ease, stroke-width 320ms ease, filter 320ms ease;
}

.constellation-line--primary {
  stroke: rgba(101, 227, 209, 0.65);
  stroke-width: 1.4;
  opacity: 0.5;
  filter: drop-shadow(0 0 6px rgba(101, 227, 209, 0.08));
}

.constellation-line--secondary {
  stroke: rgba(112, 184, 255, 0.6);
  stroke-width: 1.1;
  opacity: 0.32;
  stroke-dasharray: 0.04 0.03;
  filter: drop-shadow(0 0 4px rgba(90, 167, 255, 0.06));
}

.constellation-line--tertiary {
  stroke: rgba(181, 207, 232, 0.5);
  stroke-width: 0.7;
  opacity: 0.18;
  stroke-dasharray: 0.015 0.045;
}

.constellation-line--active {
  stroke: rgba(174, 255, 242, 0.92);
  stroke-width: 2px;
  stroke-dasharray: 0.08 0.03;
  opacity: 1;
  filter: drop-shadow(0 0 12px rgba(101, 227, 209, 0.4));
  animation: lineSignal 3.2s linear infinite;
}

.constellation-line--selected {
  stroke-width: 2.2px;
}

.constellation-line__signal {
  fill: #effffc;
  stroke: rgba(101, 227, 209, 0.6);
  stroke-width: 3;
  opacity: 0.88;
  filter: drop-shadow(0 0 6px rgba(101, 227, 209, 0.8));
  animation: endpointPulse 2s ease-in-out infinite;
}

@keyframes lineSignal {
  to {
    stroke-dashoffset: -0.135;
  }
}

@keyframes endpointPulse {
  0%, 100% {
    opacity: 0.58;
    r: 2px;
  }
  50% {
    opacity: 1;
    r: 3px;
  }
}
</style>

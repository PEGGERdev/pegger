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
  <svg class="constellation-lines">
    <line
      v-for="conn in visibleConnections"
      :key="`${conn.from}-${conn.to}`"
      :x1="conn.x1"
      :y1="conn.y1"
      :x2="conn.x2"
      :y2="conn.y2"
        :class="[
          'constellation-line',
          `constellation-line--${conn.strength}`,
          {
            'constellation-line--active': conn.isActive,
            'constellation-line--selected': conn.isSelected,
          }
        ]"
      />

  </svg>
</template>

<style scoped>
.constellation-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.constellation-line {
  stroke-linecap: round;
  transition: opacity 300ms ease, stroke-width 300ms ease, filter 300ms ease;
  filter: drop-shadow(0 0 8px rgba(31, 124, 114, 0.15));
}

.constellation-line--primary {
  stroke: #1f7c72;
  stroke-width: 2;
  opacity: 0.5;
}

.constellation-line--secondary {
  stroke: #1f7c72;
  stroke-width: 1.5;
  opacity: 0.3;
}

.constellation-line--tertiary {
  stroke: rgba(165, 194, 222, 0.55);
  stroke-width: 1;
  opacity: 0.15;
  stroke-dasharray: 3 8;
}

.constellation-line--active {
  opacity: 1 !important;
  stroke-width: 3px !important;
  filter: drop-shadow(0 0 14px rgba(95, 208, 191, 0.28));
  animation: linePulse 1.5s ease-in-out infinite;
}

.constellation-line--selected {
  stroke-width: 2.6px;
}

@keyframes linePulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}
</style>

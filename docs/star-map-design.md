# Star Map Design Specification

## Concept

The pegger.dev landing page presents Patrik Egger's digital presence as a **personal constellation map**. The user is represented as the central, brightest star, with related services, skills, and connections orbiting as smaller stars connected by constellation lines.

## Visual Design

### Layout

```
                    ★ PEGGER.dev ★
                    
         ╱ ─ ─ ─ ─ ─╲     ╱ ─ ─ ─ ─ ─╲
        ╱    GitHub   ╲   ╱   LinkedIn  ╲
       ╱    ★    ─ ─ ─ ─ ─ ─ ★    ╲
      ╱         ╲       ╱         ╲
     ╱   Portfolio ╲   ╱  SpotOnSight  ╲
     ╲    ★    ─ ─ ─ ★    ★    ╱
      ╲         ╱       ╲         ╱
       ╲   Skills ─ ─ ─ ─ ─ ★    ╱
        ╲    ★    ─ ─ ─ ─ ─ ─╱
         ╲       ╱    ╱ ─ ─ ─ ─ ─╲
          ╲  Contact ╱   Dev Terminal ╲
           ╲   ★  ╱        ★      ╱
                    ★ (YOU)
                    
    ○ ○ ○  ○    ○  ○  ○    ○   (background stars)
```

### Star Definitions

#### Center Star (You)

```javascript
{
  id: 'you',
  type: 'center',
  label: 'Patrik Egger',
  subtitle: 'Junior Full-Stack Developer',
  location: 'Switzerland',
  style: {
    size: '80px',
    color: '#ffffff',
    glow: 'rgba(31, 124, 114, 0.8)',
    animation: 'pulse' // subtle breathing glow
  }
}
```

#### Bright Stars (Services)

```javascript
const brightStars = [
  {
    id: 'portfolio',
    label: 'Portfolio',
    type: 'bright',
    position: { x: -25, y: -20 }, // percentage from center
    connections: ['projects', 'skills'],
    panel: 'apps',
    icon: 'bi-briefcase',
    data: {
      url: 'https://portfolio.pegger.dev',
      description: 'Full-stack projects, skills, and experience'
    }
  },
  {
    id: 'spotonsight',
    label: 'SpotOnSight',
    type: 'bright',
    position: { x: 30, y: -15 },
    connections: ['vue', 'fastapi', 'mongodb', 'docker'],
    panel: 'apps',
    icon: 'bi-compass',
    data: {
      url: 'https://spotonsight.com',
      description: 'Location-based social platform'
    }
  },
  {
    id: 'payqr',
    label: 'Pay QR',
    type: 'bright',
    position: { x: 15, y: -35 },
    connections: ['vue', 'stripe'],
    panel: 'apps',
    icon: 'bi-qr-code',
    data: {
      url: 'https://pay.pegger.dev',
      description: 'Apple Pay QR invoice prototype'
    }
  },
  {
    id: 'contact',
    label: 'Contact',
    type: 'bright',
    position: { x: -35, y: 25 },
    connections: ['you'],
    panel: 'contact',
    icon: 'bi-envelope',
    data: {
      email: 'patrik.egger@email.ch',
      note: 'I typically respond within 24-48 hours'
    }
  },
  {
    id: 'github',
    label: 'GitHub',
    type: 'bright',
    position: { x: -20, y: 35 },
    connections: ['you'],
    panel: 'socials',
    icon: 'bi-github',
    data: {
      url: 'https://github.com/N3on00'
    }
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    type: 'bright',
    position: { x: 25, y: 30 },
    connections: ['you'],
    panel: 'socials',
    icon: 'bi-linkedin',
    data: {
      url: 'https://linkedin.com/in/patrik-egger'
    }
  },
  {
    id: 'dev',
    label: 'Dev Terminal',
    type: 'bright',
    position: { x: 40, y: 10 },
    connections: ['you'],
    panel: 'private',
    icon: 'bi-terminal',
    data: {
      url: 'https://dev.pegger.dev',
      badge: 'SSH'
    }
  }
];
```

#### Dim Stars (Skills/Tech Stack)

```javascript
const dimStars = [
  // Project-related skills
  { id: 'vue', label: 'Vue.js', position: { x: 45, y: -25 }, connections: ['spotonsight', 'payqr'] },
  { id: 'fastapi', label: 'FastAPI', position: { x: 50, y: -5 }, connections: ['spotonsight'] },
  { id: 'mongodb', label: 'MongoDB', position: { x: 55, y: 15 }, connections: ['spotonsight'] },
  { id: 'stripe', label: 'Stripe', position: { x: 20, y: -45 }, connections: ['payqr'] },
  
  // General skills
  { id: 'typescript', label: 'TypeScript', position: { x: -50, y: -30 }, connections: ['portfolio'] },
  { id: 'python', label: 'Python', position: { x: 55, y: -20 }, connections: ['fastapi'] },
  { id: 'docker', label: 'Docker', position: { x: 15, y: 45 }, connections: ['spotonsight', 'portfolio'] },
  { id: 'cicd', label: 'CI/CD', position: { x: -45, y: 40 }, connections: ['portfolio', 'spotonsight'] },
  { id: 'react', label: 'React', position: { x: -40, y: -25 }, connections: ['portfolio'] },
  { id: 'nodejs', label: 'Node.js', position: { x: 35, y: 40 }, connections: ['payqr'] },
  { id: 'linux', label: 'Linux', position: { x: -35, y: 50 }, connections: ['dev'] },
  { id: 'ssh', label: 'SSH', position: { x: 50, y: 25 }, connections: ['dev', 'linux'] }
];
```

### Connection Lines

Lines are drawn between connected stars. They have different weights based on relationship strength:

```javascript
const connections = [
  // Primary - direct service connections to center
  { from: 'you', to: 'portfolio', strength: 'primary' },
  { from: 'you', to: 'spotonsight', strength: 'primary' },
  { from: 'you', to: 'payqr', strength: 'primary' },
  { from: 'you', to: 'contact', strength: 'primary' },
  { from: 'you', to: 'github', strength: 'primary' },
  { from: 'you', to: 'linkedin', strength: 'primary' },
  { from: 'you', to: 'dev', strength: 'primary' },
  
  // Secondary - related services
  { from: 'portfolio', to: 'spotonsight', strength: 'secondary' },
  { from: 'spotonsight', to: 'payqr', strength: 'secondary' },
  
  // Tertiary - technology links
  { from: 'spotonsight', to: 'vue', strength: 'tertiary' },
  { from: 'spotonsight', to: 'fastapi', strength: 'tertiary' },
  { from: 'spotonsight', to: 'mongodb', strength: 'tertiary' },
  { from: 'spotonsight', to: 'docker', strength: 'tertiary' },
  { from: 'spotonsight', to: 'cicd', strength: 'tertiary' },
  { from: 'portfolio', to: 'typescript', strength: 'tertiary' },
  { from: 'portfolio', to: 'react', strength: 'tertiary' },
  { from: 'portfolio', to: 'cicd', strength: 'tertiary' },
  { from: 'payqr', to: 'vue', strength: 'tertiary' },
  { from: 'payqr', to: 'stripe', strength: 'tertiary' },
  { from: 'payqr', to: 'nodejs', strength: 'tertiary' },
  { from: 'dev', to: 'linux', strength: 'tertiary' },
  { from: 'dev', to: 'ssh', strength: 'tertiary' },
  { from: 'fastapi', to: 'python', strength: 'tertiary' },
];
```

#### Line Styles

| Strength | Opacity | Width | Color |
|----------|---------|-------|-------|
| Primary | 0.6 | 2px | Primary teal |
| Secondary | 0.4 | 1.5px | Primary teal |
| Tertiary | 0.2 | 1px | Grey |

## Animations

### 1. Ambient Wobble

Each star has a subtle, unique drifting animation:

```css
@keyframes starDrift {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(2px, -1px) rotate(0.5deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-0.3deg);
  }
  75% {
    transform: translate(-2px, -1px) rotate(0.4deg);
  }
}

.star {
  animation: starDrift var(--drift-duration, 4s) ease-in-out infinite;
  animation-delay: var(--drift-delay, 0s);
}

/* Each star gets unique values */
.star--portfolio { --drift-duration: 4.2s; --drift-delay: 0s; }
.star--spotonsight { --drift-duration: 3.8s; --drift-delay: 0.5s; }
.star--github { --drift-duration: 4.5s; --drift-delay: 1.2s; }
/* etc. */
```

### 2. Magnetic Attraction

When mouse approaches a star, it gently pulls toward the cursor:

```javascript
// composables/useStarPhysics.js
import { ref, onMounted, onUnmounted } from 'vue';
import { useMouse } from '@vueuse/core';

const MAGNETIC_RANGE = 150; // pixels
const ATTRACTION_STRENGTH = 0.12;

export function useStarPhysics(starRef, options = {}) {
  const { maxDistance = 150, strength = 0.12 } = options;
  
  const { x: mouseX, y: mouseY } = useMouse();
  const offset = ref({ x: 0, y: 0 });
  
  function calculateAttraction() {
    if (!starRef.value) return;
    
    const rect = starRef.value.getBoundingClientRect();
    const starX = rect.left + rect.width / 2;
    const starY = rect.top + rect.height / 2;
    
    const dx = mouseX.value - starX;
    const dy = mouseY.value - starY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > maxDistance || distance < 1) {
      // Spring back to center
      offset.value = {
        x: offset.value.x * 0.85,
        y: offset.value.y * 0.85
      };
      return;
    }
    
    // Calculate pull
    const normalizedDistance = 1 - (distance / maxDistance);
    const pullStrength = normalizedDistance * strength * 25;
    
    const angle = Math.atan2(dy, dx);
    offset.value = {
      x: Math.cos(angle) * pullStrength,
      y: Math.sin(angle) * pullStrength
    };
  }
  
  onMounted(() => {
    const interval = setInterval(calculateAttraction, 16); // ~60fps
    onUnmounted(() => clearInterval(interval));
  });
  
  return { offset };
}
```

### 3. Hover Brightness

Stars brighten when cursor approaches:

```javascript
// In useStarPhysics
const isMagnetic = computed(() => {
  const distance = calculateDistance(mouseX.value, mouseY.value, starX, starY);
  return distance < MAGNETIC_RANGE;
});

const brightness = computed(() => {
  if (isMagnetic.value) return 1;
  if (props.type === 'dim') return 0.3;
  return 0.8;
});
```

### 4. Line Illumination

When hovering a star, connected lines brighten:

```vue
<!-- ConstellationLines.vue -->
<template>
  <svg class="constellation-lines">
    <line
      v-for="conn in visibleConnections"
      :key="conn.id"
      :x1="getStarPosition(conn.from).x"
      :y1="getStarPosition(conn.from).y"
      :x2="getStarPosition(conn.to).x"
      :y2="getStarPosition(conn.to).y"
      :class="[
        'constellation-line',
        `constellation-line--${conn.strength}`,
        { 'constellation-line--active': isConnectedToHovered(conn) }
      ]"
    />
  </svg>
</template>
```

```css
.constellation-line {
  transition: opacity 300ms ease, stroke-width 300ms ease;
}

.constellation-line--active {
  opacity: 1 !important;
  stroke-width: 3px;
  animation: linePulse 1.5s ease-in-out infinite;
}

@keyframes linePulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
```

### 5. Expansion Animation

When clicking a star:

```vue
<!-- Star.vue -->
<template>
  <div
    class="star"
    :class="{ 'star--expanding': isExpanding }"
    @click="handleClick"
  >
    <!-- Star content -->
    
    <!-- Expansion cloud effect -->
    <div v-if="isExpanding" class="star__expansion-cloud" />
  </div>
  
  <!-- Expansion panel -->
  <Transition name="panel">
    <StarPanel
      v-if="panelOpen"
      :panel-id="activePanel"
      :origin="panelOrigin"
      @close="closePanel"
    />
  </Transition>
</template>
```

```css
.star__expansion-cloud {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(31, 124, 114, 0.6) 0%,
    rgba(31, 124, 114, 0.3) 40%,
    transparent 70%
  );
  animation: starExpand 600ms ease-out forwards;
  pointer-events: none;
}

@keyframes starExpand {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(4);
    opacity: 0.6;
    filter: blur(8px);
  }
  100% {
    transform: scale(8);
    opacity: 0;
    filter: blur(20px);
  }
}

.panel-enter-active {
  animation: panelRise 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.panel-leave-active {
  animation: panelFall 300ms ease-in;
}

@keyframes panelRise {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(30px);
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
    backdrop-filter: blur(12px);
  }
}

@keyframes panelFall {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
}
```

### 6. Center Star Pulse

```css
.center-star {
  animation: centerPulse 3s ease-in-out infinite;
}

@keyframes centerPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 
      0 0 20px rgba(31, 124, 114, 0.4),
      0 0 40px rgba(31, 124, 114, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 
      0 0 30px rgba(31, 124, 114, 0.6),
      0 0 60px rgba(31, 124, 114, 0.3);
  }
}
```

### 7. Background Star Field

Using tsparticles or custom canvas:

```javascript
// particles.config.js
export const starFieldConfig = {
  particles: {
    number: {
      value: 120,
      density: {
        enable: true,
        value_area: 800
      }
    },
    size: {
      value: { min: 1, max: 3 },
      animation: {
        enable: true,
        speed: 2,
        sync: false
      }
    },
    opacity: {
      value: { min: 0.2, max: 0.5 },
      animation: {
        enable: true,
        speed: 1,
        sync: false
      }
    },
    move: {
      enable: true,
      speed: 0.3,
      direction: 'none',
      random: true,
      straight: false,
      outModes: 'out'
    },
    twinkle: {
      particles: {
        enable: true,
        frequency: 0.3,
        opacity: 1,
        color: {
          value: '#ffffff'
        }
      }
    }
  }
};
```

## Component Specifications

### StarMap.vue (Main Container)

**Props:**
- `stars` (Array) - All star definitions
- `connections` (Array) - Connection definitions
- `centerStar` (Object) - Center "you" star

**Emits:**
- `star-click(starId)` - When a star is clicked

**Responsibilities:**
- Calculate star positions based on viewport
- Track global mouse position
- Manage active/hovered states
- Coordinate expansion animations

### Star.vue (Individual Star)

**Props:**
- `star` (Object) - Star definition
- `isHovered` (Boolean)
- `isActive` (Boolean) - Currently expanded

**Emits:**
- `hover(isHovered)`
- `click`

**States:**
- Default: Normal appearance
- Hovered: Brighter, slight scale up
- Magnetic: Pulled toward cursor
- Active: Expanded, panel open

### ConstellationLines.vue (SVG Connections)

**Props:**
- `connections` (Array)
- `starPositions` (Map) - Star ID to {x, y}
- `hoveredStar` (String|null)

**Responsibilities:**
- Draw SVG lines between connected stars
- Highlight lines connected to hovered star

### StarPanel.vue (Content Panel)

**Props:**
- `panelId` (String) - Which panel to show
- `isOpen` (Boolean)
- `originPosition` ({x, y}) - Click origin for animation

**Slots:**
- Default content from panel components

### Panels (Content)

#### AppsPanel.vue

```javascript
const appsData = {
  title: 'My Work',
  items: [
    {
      name: 'Portfolio',
      url: 'https://portfolio.pegger.dev',
      description: 'Full-stack projects, skills, and experience',
      tech: ['Vue', 'React', 'TypeScript'],
      icon: 'bi-briefcase'
    },
    {
      name: 'SpotOnSight',
      url: 'https://spotonsight.com',
      description: 'Location-based social platform',
      tech: ['Vue 3', 'FastAPI', 'MongoDB', 'Capacitor'],
      icon: 'bi-compass'
    },
    {
      name: 'Pay QR',
      url: 'https://pay.pegger.dev',
      description: 'Apple Pay QR invoice prototype',
      tech: ['Vue', 'Express', 'Stripe'],
      icon: 'bi-qr-code'
    }
  ]
};
```

#### ContactPanel.vue

```javascript
const contactData = {
  title: "Let's Connect",
  items: [
    {
      type: 'email',
      label: 'Email',
      value: 'patrik.egger@email.ch',
      action: 'mailto:patrik.egger@email.ch'
    }
  ],
  note: 'I typically respond within 24-48 hours'
};
```

#### SocialsPanel.vue

```javascript
const socialsData = {
  title: 'Find Me Online',
  items: [
    {
      name: 'GitHub',
      url: 'https://github.com/N3on00',
      icon: 'bi-github',
      description: 'Open source projects and contributions'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/patrik-egger',
      icon: 'bi-linkedin',
      description: 'Professional network and experience'
    }
  ]
};
```

#### PrivatePanel.vue

```javascript
const privateData = {
  title: 'Private Access',
  description: 'Web-based terminal for remote server management',
  items: [
    {
      name: 'Dev Terminal',
      url: 'https://dev.pegger.dev',
      icon: 'bi-terminal-fill',
      badge: 'SSH',
      note: 'Password protected'
    }
  ]
};
```

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Desktop (>1200px) | Full constellation, all stars visible |
| Tablet (768-1200px) | Smaller constellation, tighter spacing |
| Mobile (<768px) | Vertical scrollable list with star icons |

### Mobile Adaptation

On mobile, the constellation transforms into a scrollable list:

```vue
<!-- StarMap.vue responsive -->
<div class="star-map" :class="{ 'star-map--mobile': isMobile }">
  <div v-if="isMobile" class="star-list">
    <div
      v-for="star in brightStars"
      :key="star.id"
      class="star-list-item"
      @click="openPanel(star.panel)"
    >
      <i :class="star.icon" class="star-list-item__icon" />
      <span class="star-list-item__label">{{ star.label }}</span>
      <i class="bi bi-chevron-right star-list-item__arrow" />
    </div>
  </div>
  
  <template v-else>
    <!-- Full constellation view -->
  </template>
</div>
```

## Accessibility

- Keyboard navigation through stars (Tab + Enter)
- ARIA labels on all interactive elements
- Reduced motion mode disables animations
- High contrast mode for lines
- Screen reader announcements for panel content

## Performance Considerations

- Use CSS transforms for animations (GPU accelerated)
- Debounce mouse position calculations
- Lazy load panel content
- Use requestAnimationFrame for smooth updates
- Consider canvas for background stars on low-end devices

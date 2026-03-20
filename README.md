# pegger.dev

Personal hub for Patrik Egger's web presence, portfolio, and private developer tools.

## Overview

`pegger.dev` serves as the central landing page connecting all personal projects, services, and contact methods. It features an interactive star map constellation where each star represents a service, skill, or connection point in Patrik's developer universe.

## Live

- **Hub**: https://peggar.dev
- **Portfolio**: https://portfolio.pegger.dev
- **SpotOnSight**: https://spotonsight.com
- **Dev Terminal**: https://dev.peggar.dev

## Architecture

```
pegger.dev/
├── src/
│   ├── main.js              # App entry
│   ├── App.vue              # Root component
│   ├── style.css            # Design tokens + global styles
│   ├── components/
│   │   ├── StarMap.vue              # Main constellation container
│   │   ├── StarField.vue            # Background particles
│   │   ├── ConstellationLines.vue   # SVG connections
│   │   ├── Star.vue                # Interactive star
│   │   ├── StarCluster.vue          # Grouped stars
│   │   ├── StarPanel.vue           # Expansion panel
│   │   ├── CenterPresence.vue       # "You" center point
│   │   └── panels/                 # Content for each category
│   ├── composables/
│   │   ├── useStarPhysics.js        # Magnetic attraction + wobble
│   │   ├── useConstellation.js      # Connection calculations
│   │   └── useStarExpansion.js      # Panel animation
│   ├── data/
│   │   └── starMapData.js           # All stars and connections
│   └── config/
│       └── theme.js
├── deployment/                      # Docker + Nginx config
├── docs/                           # Feature specifications
└── package.json
```

## Tech Stack

- **Vue 3** with Composition API
- **Vite** for build tooling
- **Bootswatch** (flatly theme) for base styling
- **Bootstrap Icons** for iconography
- **AOS** for scroll animations
- **VueUse** for mouse tracking and composables
- **@vueuse/motion** or CSS animations for star effects
- **tsparticles** for background star field

## Design System

### Colors (matching SpotOnSight brand)

```css
--peggar-primary: #1f7c72;        /* Teal - primary brand */
--peggar-primary-rgb: 31, 124, 114;
--peggar-accent: #2f6ea8;         /* Blue - secondary accent */
--peggar-accent-rgb: 47, 110, 168;
--peggar-surface: rgba(255, 255, 255, 0.94);
--peggar-surface-soft: #f7fbfc;
--peggar-text: #16222b;
--peggar-text-muted: #607887;
```

### Typography

- **Display**: Space Grotesk
- **Body**: Plus Jakarta Sans

## Features

### Phase 1: Star Map Landing Page

The hub features a constellation map where the user is the center star.

#### Star Types

| Type | Appearance | Behavior |
|------|------------|----------|
| **Center** | Pulsing white glow, largest | Fixed at viewport center |
| **Bright Star** | Teal glow, 40-50px | Direct links to services |
| **Dim Star** | Grey, 20-30px, no glow | Skills, tech stack |
| **Background** | Tiny, subtle twinkle | Ambient decoration |

#### Star Categories

1. **Apps** - Direct service links (Portfolio, SpotOnSight, Pay QR)
2. **Socials** - GitHub, LinkedIn
3. **Contact** - Email, other contact methods
4. **Private** - Dev Terminal (SSH access)
5. **Skills** - Technology stack (Vue, FastAPI, MongoDB, Docker, etc.)

#### Animations

1. **Ambient Wobble** - Each star drifts slowly (3-5s cycle)
2. **Magnetic Attraction** - Stars pull toward cursor within 150px
3. **Brightness on Hover** - Dim stars illuminate, lines brighten
4. **Expansion** - Clicking a star triggers nebula/cloud expansion
5. **Background Stars** - Subtle floating particles

#### Expansion Animation

When a star is clicked:
1. Star creates expanding cloud/glow effect from its position
2. Lines to related stars illuminate
3. Panel slides in from center with backdrop blur
4. Content fades in
5. Click outside or X to collapse (reverse animation)

### Phase 2: Dev Terminal (dev.peggar.dev)

Web-based SSH terminal for remote server access.

#### Architecture

```
Browser ←→ WebSocket ←→ Python Proxy ←→ SSH ←→ Server Shell
         (xterm.js)     (server)      (opencode)
```

#### Components

1. **Frontend**: React + xterm.js
2. **Backend**: Python websockets + paramiko/ssh subprocess
3. **Auth**: Password (stored hashed in env)

#### Security

- Password authentication with rate limiting
- Session timeout after inactivity
- SSH connection pooling
- HTTPS required

### Phase 3: Passkey Authentication

Device-specific authentication using WebAuthn/FIDO2.

#### Implementation

- Use `@simplewebauthn/browser` for frontend
- Register device once with platform authenticator
- Subsequent visits use Touch ID / Windows Hello
- More secure than password, device-bound

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## Deployment

### Server Structure

```
/opt/
├── peggar-hub/           # peggar.dev landing page
│   ├── dist/
│   ├── config/
│   └── docker-compose.yml
├── peggar-dev/           # dev.peggar.dev terminal
│   ├── frontend/
│   ├── server/
│   └── docker-compose.yml
└── spotonsight/          # Existing infrastructure
```

### Caddy Routes

```caddy
peggar.dev {
    encode zstd gzip
    handle { reverse_proxy peggar-hub:80 }
}

dev.peggar.dev {
    encode zstd gzip
    handle { reverse_proxy peggar-dev:8080 }
}
```

## Design Specifications

See [docs/star-map-design.md](docs/star-map-design.md) for detailed animation specs.

See [docs/dev-terminal-design.md](docs/dev-terminal-design.md) for terminal specifications.

## Author

Patrik Egger - Junior Full-Stack Developer from Switzerland

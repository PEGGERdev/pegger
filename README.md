# pegger.dev

Personal hub for Patrik Egger's web presence, portfolio, and private developer tools.

## Overview

`pegger.dev` serves as the central landing page connecting all personal projects, services, and contact methods. It features an interactive star map constellation where each star represents a service, skill, or connection point in Patrik's developer universe.

## Configured destinations

- **Hub**: https://pegger.dev
- **Portfolio**: https://portfolio.pegger.dev
- **SpotOnSight**: https://spotonsight.com
- **Dev Terminal**: `https://dev.pegger.dev` is a planned private destination; no terminal server is implemented in this checkout.

Current local work, verification and the future AgentenWerk boundary: [aidocs/README.md](aidocs/README.md). A configured link is not evidence that its service is currently reachable or authenticated.

## Architecture

```
pegger.dev/
├── src/
│   ├── main.js              # App entry
│   ├── App.vue              # Root component
│   ├── style.css            # Design tokens + global styles
│   ├── components/
│   │   ├── StarMap.vue              # Responsive constellation and directory
│   │   ├── StarField.vue            # Background star canvas
│   │   ├── ConstellationLines.vue   # SVG connections
│   │   ├── Star.vue                 # Interactive star
│   │   ├── StarPanel.vue            # Accessible detail panel
│   │   ├── CenterPresence.vue       # "You" center point
│   │   ├── ItemList.vue             # Panel item collection
│   │   └── ItemCard.vue             # Panel item presentation
│   ├── composables/
│   │   └── usePeggerRuntime.js      # Runtime view-model access
│   ├── data/
│   │   └── starMapData.js           # All stars and connections
│   ├── runtime/                      # Workflow and projection catalogs
│   ├── registry/                     # Runtime registry facade
│   ├── test/                         # Runtime test scenarios and harness
│   └── config/
│       └── theme.js
├── tests/e2e/                        # Playwright interaction and visual tests
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
--pegger-primary: #49c5b6;        /* Teal - primary brand */
--pegger-primary-rgb: 73, 197, 182;
--pegger-accent: #5aa7ff;         /* Blue - secondary accent */
--pegger-accent-rgb: 90, 167, 255;
--pegger-surface: rgba(238, 246, 255, 0.94);
--pegger-surface-soft: #edf5ff;
--pegger-text: #112130;
--pegger-text-muted: #6f879b;
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

### Phase 2: Dev Terminal (dev.pegger.dev)

Planned web-based SSH terminal for remote server access. The binding delivery boundaries are in [aidocs/agentenwerk-anbindung.md](aidocs/agentenwerk-anbindung.md). [docs/dev-terminal-design.md](docs/dev-terminal-design.md) is a historical concept which may also have unpublished local revisions; its code examples are not an approved production implementation. No terminal implementation or production enablement is implied here.

#### Architecture

```
Enrolled browser ←→ mutual-TLS Caddy ←→ authenticated ASGI gateway ←→ pinned key-only SSH ←→ dedicated non-root account
```

#### Components

1. **Frontend**: React + xterm.js
2. **Backend**: planned Starlette/Uvicorn + AsyncSSH, one gateway for client/auth/WebSocket
3. **Auth**: device mutual TLS plus application session; file-mounted Argon2id hash, no default password

#### Security

- Fail-closed authentication, CSRF/Origin checks, bounded sessions and rate limits
- Dedicated non-root account, pinned host identity and key-only SSH; no connection pooling
- No published backend port, shared login with other products, or implicit AgentenWerk/worker access

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
├── pegger-hub/           # verified main checkout for pegger.dev
│   ├── deployment/
│   ├── scripts/
│   └── src/
├── pegger-dev/           # dev.pegger.dev terminal
│   ├── frontend/
│   ├── server/
│   └── docker-compose.yml
└── spotonsight/          # Existing infrastructure
```

### Caddy Routes

```caddy
pegger.dev, www.pegger.dev {
    encode zstd gzip
    handle { reverse_proxy pegger-hub:80 }
}

dev.pegger.dev {
    encode zstd gzip
    handle { reverse_proxy pegger-dev:8080 }
}
```

### Automated Deployment

Pushes and pull requests targeting `dev` or `main` run unit tests, type checks, a production build, and Linux Playwright visual comparisons. Only a verified current `main` revision can deploy; snapshot-generation dispatches never deploy.

The `deploy-production` job follows the same VPS pattern as SpotOnSight and uses these repository secrets:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`

The job verifies every scanned Ed25519 host key against the pinned fingerprint, uses an isolated strict known-hosts file, refuses a dirty remote checkout and fast-forwards `/opt/pegger-hub` to the tested `main` SHA. The deployment script retains the Caddy recovery backup until public revision verification succeeds and does not delete unrelated legacy folders. Live SSH/container/proxy verification requires separate operator access; changing this workflow locally does not publish anything.

## Design Specifications

See [docs/star-map-design.md](docs/star-map-design.md) for detailed animation specs.

See [docs/dev-terminal-design.md](docs/dev-terminal-design.md) for terminal specifications.

## Author

Patrik Egger - Junior Full-Stack Developer from Switzerland

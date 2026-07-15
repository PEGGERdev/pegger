# pegger.dev Development TODO

## Project Overview

Personal hub for Patrik Egger featuring an interactive star-map landing page. A web-based SSH terminal and passkey authentication remain future roadmap phases.

## Phase 1: Star Map Landing Page

Status: complete for the current product scope.

### Core Features

- [x] **Star Map Constellation**
  - [x] Project structure and Vue component hierarchy
  - [x] Design tokens and dark-first theme system
  - [x] Star data, balanced positions, and connection graph
  - [x] Responsive desktop constellation and mobile directory

- [x] **Animations**
  - [x] Ambient wobble with variation by star type
  - [x] Magnetic pointer attraction and smooth spring-back
  - [x] Reduced-motion-compatible canvas star field
  - [x] Center-star pulse and line illumination
  - [x] Expansion cloud and focused constellation states

- [x] **Panel System**
  - [x] Responsive desktop drawer and mobile bottom sheet
  - [x] Apps, contact, socials, and private variants
  - [x] Panel transition animations
  - [x] Project technology tags
  - [x] Contact inventory reviewed; email is the primary direct method

- [x] **Visual Polish**
  - [x] Reduced-motion and focused rendering paths for animation work
  - [x] AOS entry animations
  - [x] Product-theme decision recorded: retain the single dark-first theme
  - [x] Pointer, grab, and grabbing cursor states

### Bug Fixes and Improvements

- [x] Correct star positioning and keep content inside desktop safe zones
- [x] Update constellation geometry on resize
- [x] Handle small and mobile viewports with a dedicated directory
- [x] Add semantic controls, visible focus states, and keyboard navigation
- [x] Support Escape, close-button, and backdrop panel dismissal

### Verification

- [x] Runtime test harness with 12 passing scenarios
- [x] Type checking with `vue-tsc`
- [x] Production build with Vite
- [x] Playwright interaction coverage for desktop, compact desktop, and mobile
- [x] Twenty reviewed Windows visual baselines across all reachable hub states

## Active Operations

- [x] Repair the root-directory errors in the existing GitHub Actions workflow
- [x] Replace password deployment with the repository deployment SSH key
- [x] Add test, type-check, build, browser, health, and revision gates
- [x] Add staged release swaps, automatic rollback, and validated Caddy reloads
- [x] Pin the production SSH host keys in repository secrets
- [x] Generate the Linux visual baselines used by CI
- [x] Commit and push the generated Linux visual baselines
- [x] Merge the verified hub feature branch into `master`
- [ ] Merge the server-standard `deploy-production` alignment fix
- [ ] Confirm the automatic production deployment and public revision

## Future Phase 2: Dev Terminal

Status: future and explicitly outside the active Phase 1 frontend scope.

### Backend Roadmap

- Create the Python service and WebSocket handler
- Implement the Paramiko SSH manager and password authentication
- Add rate limiting and session timeouts

### Frontend Roadmap

- Create the terminal UI and integrate xterm.js
- Build authentication and connection-status views
- Implement WebSocket connection and terminal resizing

### Deployment Roadmap

- Add a server Dockerfile and service configuration
- Configure the reverse proxy and environment variables
- Test the complete authenticated terminal connection

## Future Phase 3: Passkey Authentication

Status: future and dependent on the Phase 2 terminal service.

- Research and select the WebAuthn implementation
- Add registration and authentication flows
- Store credentials securely
- Test across supported devices

## Future Engineering Backlog

These items are not part of the completed Phase 1 visual scope:

- Full TypeScript migration; current JavaScript is checked by `vue-tsc`
- Production monitoring/alerting
- Optional sound and easter-egg animations
- Custom 404 and loading experiences
- PWA and analytics support
- Additional SEO work and sitemap generation

## Notes

- Design matches the SpotOnSight visual direction
- Use Space Grotesk for display and Plus Jakarta Sans for body copy
- Keep animations subtle and honor reduced-motion preferences
- Mobile behavior should be purpose-built rather than identical to desktop
- Security is paramount before enabling the future dev terminal

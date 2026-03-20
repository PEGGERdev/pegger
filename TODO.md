# pegger.dev Development TODO

## Project Overview

Personal hub for Patrik Egger featuring an interactive star map constellation landing page and a web-based SSH terminal.

## Phase 1: Star Map Landing Page

### Core Features

- [ ] **Star Map Constellation**
  - [x] Project structure created
  - [x] Basic Vue components (StarMap, Star, CenterPresence, ConstellationLines, StarField)
  - [x] Design tokens and theme system
  - [x] Star data with positions and connections
  - [ ] Refine star positions for better visual balance
  - [ ] Add responsive layout for mobile

- [ ] **Animations**
  - [x] Ambient wobble animation for stars
  - [x] Magnetic attraction to mouse cursor
  - [x] Background star field with canvas
  - [x] Center star pulsing effect
  - [x] Line illumination on hover
  - [ ] Wobble variation per star type
  - [ ] Smooth spring-back when mouse leaves range
  - [ ] Expansion cloud animation on click

- [ ] **Panel System**
  - [x] Basic panel component with backdrop
  - [x] Apps panel with project cards
  - [x] Contact panel
  - [x] Socials panel
  - [x] Private panel
  - [ ] Panel transition animations
  - [ ] Tech tags display in Apps panel
  - [ ] Add more contact methods (if any)

- [ ] **Visual Polish**
  - [ ] Optimize glow effects for performance
  - [ ] Add AOS scroll animations
  - [ ] Dark mode toggle
  - [ ] Custom cursor styles
  - [ ] Sound effects (optional)

### Bug Fixes & Improvements

- [ ] Fix star positioning calculation
- [ ] Ensure constellation lines update on resize
- [ ] Handle edge cases for very small viewports
- [ ] Add keyboard navigation

## Phase 2: Dev Terminal

### Backend

- [ ] Create Python project structure
- [ ] Implement WebSocket handler
- [ ] Implement SSH manager with paramiko
- [ ] Implement password authentication
- [ ] Add rate limiting
- [ ] Add session timeout
- [ ] Implement passkey authentication (Phase 3)

### Frontend

- [ ] Create React project for terminal UI
- [ ] Integrate xterm.js
- [ ] Build authentication form
- [ ] Add connection status indicator
- [ ] Implement WebSocket connection
- [ ] Handle terminal resize

### Deployment

- [ ] Create Dockerfile for server
- [ ] Update docker-compose.yml
- [ ] Configure Caddy for WebSocket
- [ ] Set up environment variables
- [ ] Test end-to-end connection

## Phase 3: Passkey Authentication

- [ ] Research WebAuthn implementation
- [ ] Add @simplewebauthn packages
- [ ] Create registration flow
- [ ] Create authentication flow
- [ ] Store credentials securely
- [ ] Test across devices

## Technical Debt

- [ ] Add TypeScript type definitions
- [ ] Write unit tests for composables
- [ ] Add E2E tests with Playwright
- [ ] Set up CI/CD pipeline
- [ ] Document deployment process
- [ ] Create monitoring/alerting

## Nice to Have

- [ ] Easter egg animations
- [ ] Custom 404 page
- [ ] Loading animation
- [ ] PWA support
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] Sitemap generation

## Notes

- Design should match SpotOnSight brand
- Use Space Grotesk for display, Plus Jakarta Sans for body
- Animations should be subtle, not distracting
- Mobile experience should be functional, not identical
- Security is paramount for dev terminal

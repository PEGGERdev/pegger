# Pegger Hub Project Status

## Current State

- Current branch: `feature/galactic-constellation`
- Remote tracking state: local feature branch based on clean `origin/dev` at `82a4ba6`; not pushed yet
- Last updated: 2026-07-15
- Current objective: replace card-based star interaction with smooth galaxy-style zoom toward stars; remove panel system
- Main promotion allowed: no
- Reason: HUB-007 through HUB-009 are required and not yet complete on remote `dev`

## Task Tracker

| ID | Task | Source | Status | Branch | Files | Tests / Verification | Commit | Pushed to dev | Blocker / Risk |
|---|---|---|---|---|---|---|---|---|---|
| HUB-001 | Deterministic visual coverage | Prior user request | completed | `feature/visual-e2e-coverage` | Playwright configuration and snapshots | 12 scenarios, 20 baselines per platform | `ca4121c`, `1ad13c3` | yes | None |
| HUB-002 | Responsive and interaction polish | Prior user request | completed | `feature/visual-e2e-coverage` | Hub components and styles | Desktop, compact, and Pixel 7 interaction coverage | `ca4121c` | yes | None |
| HUB-003 | Phase 1 scope reconciliation | `opencode.md` | completed | `feature/visual-e2e-coverage` | `TODO.md`, `project_status.md` | Scope and evidence review | `ca4121c` | yes | None |
| HUB-004 | Celestial star bodies and center beacon | Prior user request | completed | `feature/futuristic-constellation` | `Star.vue`, `CenterPresence.vue`, theme | Runtime, type, build, visual review | `5764c7e` | yes | None |
| HUB-005 | Explicit relationship systems and grouped geometry | Prior user request | completed | `feature/futuristic-constellation` | Cluster, line, map, and data components | Schema integrity and 12 Playwright scenarios | `337a475` | yes | None |
| HUB-006 | Cross-platform visual and security approval | `opencode.md` | completed | `feature/futuristic-constellation` | Tests and 40 snapshots | Windows and Linux comparison, audit | `f799aa5`, `961c5ed` | yes | None |
| OPS-001 | Gated production deployment | Prior user request | completed | `feature/visual-e2e-coverage` | Workflow and deployment scripts | Health, revision, TLS, rollback | `4e4f3d7`, `ebe27c8` | yes | None |
| OPS-002 | Portable Caddy label detection | Production regression | completed | `fix/caddy-site-label-detection` | Deployment parser and fixture test | Ubuntu fixture, CI, successful VPS releases | `86f5267`, `30d9740` | yes | None |
| HUB-007 | Replace card-based star interaction with smooth galaxy zoom | Current user request | verified | `feature/galactic-constellation` | `StarMap.vue`, `App.vue`, `hub.e2e.spec.js` | Type check, build, npm test, E2E zoom/focus/hover tests | pending | no | Animation timing and snapshot variance |
| HUB-008 | Galaxy field depth, natural stellar light, center nucleus, and asterism paths | Current user request | open | `feature/galactic-constellation` | `StarField.vue`, `Star.vue`, `CenterPresence.vue`, `ClusterRegions.vue`, `ConstellationLines.vue` | Runtime/type/build, reduced motion, desktop/mobile visual review | pending | no | GPU cost and visual determinism |
| HUB-009 | Cross-platform galactic visual approval and production promotion | `opencode.md` | open | `feature/galactic-constellation` | Tests, snapshots, status files | Full local gates, 20 Windows and 20 Linux baselines, audit, production checks | pending | no | Platform rendering drift |

## Verification Log

| Date | Task ID | Command or Manual Check | Expected Result | Actual Result | Evidence |
|---|---|---|---|---|---|
| 2026-07-15 | HUB-006 | `npm run test:e2e` | 12 scenarios match | 12 passed | Local Windows run |
| 2026-07-15 | HUB-006 | GitHub run `29402859565` | Linux snapshots match | Passed | 20 Linux baselines |
| 2026-07-15 | OPS-002 | GitHub run `29405478802` | CI and VPS release pass | Passed | Production deploy in 39 seconds |
| 2026-07-15 | OPS-002 | `https://pegger.dev/health` and live browser checks | Healthy responsive hub | Passed | Five systems and seven paths verified |
| 2026-07-15 | HUB-007 | `npm run typecheck` | No type errors | Passed | Clean zero-error output |
| 2026-07-15 | HUB-007 | `npm run build` | Build succeeds | Passed | 41 modules, no warnings |
| 2026-07-15 | HUB-007 | `npm test` | 12 runtime tests | Passed | All 12 passed |
| 2026-07-15 | HUB-007 | Final typecheck + build after all edits | Clean typecheck and build | Passed | 41 modules, zero errors |

## Dev Integration Log

| Task ID | Commit | Dev Push | Remote Verification | Notes |
|---|---|---|---|---|
| HUB-004 | `5764c7e` | yes | present in `origin/dev` | Stellar node system |
| HUB-005 | `337a475` | yes | present in `origin/dev` | Relationship clusters |
| HUB-006 | `f799aa5`, `961c5ed` | yes | present in `origin/dev` | Cross-platform approval |
| OPS-002 | `86f5267`, `30d9740` | yes | present in `origin/dev` | Portable deployment parser |

## Main Promotion Checklist

- [ ] Every explicit user request is completed.
- [ ] Every required task in this file is completed.
- [ ] Every required task from other status or planning files is completed.
- [ ] No task is open.
- [ ] No task is in progress.
- [ ] No task is implemented but unverified.
- [ ] No required task is blocked.
- [ ] No required task is silently deferred.
- [ ] Every completed task was pushed to dev.
- [ ] All relevant automated tests pass on dev.
- [ ] Build, lint, and typecheck pass where available.
- [ ] Frontend interactions were verified where relevant.
- [ ] Backend contracts and behavior were verified where relevant.
- [ ] No unrelated changes were included.
- [ ] Final full-scope scan passed.
- [ ] Dev is synchronized with the remote.
- [ ] Main promotion is authorized by these rules.

## Main Promotion History

| Date | Dev Commit | Main Commit | Verification | Notes |
|---|---|---|---|---|
| 2026-07-15 | `7d86202` | `936a4d2` | Application CI passed; deployment rolled back safely | Initial constellation promotion exposed the awk parser defect |
| 2026-07-15 | `0d96c4c` | `7b75383` | Run `29405478802` passed CI and deployment | Corrected constellation release |
| 2026-07-15 | `82a4ba6` | `54270bd` | Run `29406945221` passed CI and deployment | Stable evidence tracking release |

## Known Risks

| ID | Risk | Status | Handling |
|---|---|---|---|
| R-001 | Galaxy layers and ambient motion can make screenshots nondeterministic. | active | Use component-local seeded generation and static reduced-motion rendering. |
| R-002 | Nebulae and asterism paths can obscure labels and controls. | active | Bound effects below interaction layers and inspect every visible state. |
| R-003 | Blur, gradients, and canvas density can reduce low-end GPU performance. | active | Cap particles and layers, scale by viewport, and avoid new JavaScript animation loops. |
| R-004 | Windows and Linux rasterization can diverge. | active | Regenerate and review both baseline sets before promotion. |
| R-005 | Repeated local SSH probes can be throttled. | monitored | Use CI release health and revision gates for production verification. |

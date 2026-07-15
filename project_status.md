# Pegger Hub Project Status

## Current Branch

- Feature branch: `fix/caddy-site-label-detection`
- Integration branch: `dev`
- Production branch: `master`
- Repository: `PEGGERdev/pegger`

## Open Tasks

| ID | Item | Source | Status | Planned files | Verification |
|---|---|---|---|---|---|
| OPS-002 | Make exact Caddy site-label detection portable across VPS awk implementations | Production run `29403733506` | in_progress | `scripts/deploy-production.sh`, deployment regression tests | Shell syntax, fixture cases, CI, rollback/public health, production revision |

## In Progress

### OPS-002: Portable Caddy Label Detection

- Failure: VPS awk rejects `index` as a loop variable, causing both exact-label checks to fail and a duplicate `pegger.dev` site block to be appended.
- Safety state: Caddy validation rejected the duplicate route, the deployment trap restored the original Caddyfile and prior image, `/health` remains `ok`, and `/revision.txt` remains `15480cf5526aacaba59ac50d15e56a67490d7867`.
- Scope: use a portable iterator name, extract or expose the detector for fixture testing, and verify apex, `www`, subdomain-only, scheme, port, comma-separated, and commented labels.
- Security and reliability: preserve exact-host matching, rollback behavior, Caddy validation, immutable image revision checks, and non-deployment CI behavior.

## Completed Work

| ID | Item | Evidence |
|---|---|---|
| HUB-001 | Deterministic desktop and mobile screenshot coverage for every visible hub state | 12 scenarios with 20 Windows and 20 Linux baselines |
| HUB-002 | Responsive, interaction, accessibility, and visual-polish corrections | Desktop, compact desktop, and Pixel 7 states reviewed; all assertions passed |
| HUB-003 | Phase 1 scope reconciliation and implementation evidence | `TODO.md` separates completed product scope from future phases |
| HUB-004 | Celestial star bodies, diffraction rays, spectral tokens, spring attraction, and a modern center beacon | Runtime/type/build checks passed; six desktop and six mobile Playwright scenarios passed; default, compact, expanded, and focused states reviewed |
| HUB-005 | Five explicit relationship systems, grouped geometry, spectral fields, signal lines, and a grouped mobile directory | All 21 nodes have one valid membership; all 26 edges validate; 12 parallel Playwright scenarios passed; long-page modal lock and compact collisions are covered |
| HUB-006 | Deterministic cross-platform visual approval, accessibility regression coverage, and focused security review | Runs `29402340871` and `29402859565` generated and matched all 20 Linux baselines; Windows matched all 20; audit found zero vulnerabilities |
| OPS-001 | Gated automatic production deployment and repaired apex routing | Run `29396387223` deployed `15480cf5526aacaba59ac50d15e56a67490d7867`; health, revision, TLS, desktop, and mobile checks passed |

## Blocked

- None.

## Verification Results

Latest redesign verification:

```text
npm test: 12 passed, 0 failed
npm run typecheck: passed
npm run build: passed
npm run test:e2e:update: 12 passed, 0 failed; 20 Windows snapshots regenerated
npm run test:e2e: 12 passed, 0 failed; all Windows snapshots matched
npm audit --audit-level=low: 0 vulnerabilities
GitHub run 29402340871: Linux baseline generation passed; 20 snapshots reviewed
GitHub run 29402859565: unit, type, build, and all Linux visual comparisons passed
Security review: no unsafe HTML/eval paths, remote runtime assets, or dependency changes introduced
GitHub run 29403733506: application CI passed; deploy rolled back after portable awk failure caused duplicate Caddy route validation
Production /health: ok
Production /revision.txt: 15480cf5526aacaba59ac50d15e56a67490d7867
```

## Known Risks

| ID | Risk | Status | Handling |
|---|---|---|---|
| R-001 | Ambient motion can make screenshots nondeterministic. | mitigated | Visual tests use seeded randomness and reduced motion. |
| R-002 | Rich star effects can obscure labels, focus rings, or connection lines. | mitigated | Effects are bounded inside node layers; default, hover, focused, and panel-open states were reviewed. |
| R-003 | Cluster regions can become visual clutter on compact screens. | mitigated | Desktop fields are low contrast, captions sit outside node paths, compact collisions are asserted, and mobile uses grouped directory sections. |
| R-004 | GPU-heavy filters can reduce animation smoothness. | mitigated | Effects use bounded CSS layers, transforms, and opacity; no new render loop or runtime dependency was added. |
| R-005 | Windows and Linux font/effect rendering can shift visual snapshots. | mitigated | Twenty reviewed baselines per platform pass locally and in GitHub's Ubuntu comparison environment. |
| R-006 | Repeated local SSH probes can be throttled. | monitored | Use serialized probes and rely on deployment health/revision gates. |
| R-007 | Caddy label parsing depended on awk accepting a built-in function name as a loop variable. | active | Rename the iterator and cover exact-label parsing with the VPS awk implementation before redeployment. |

## Next Recommended Task

Complete OPS-002, merge it through `dev`, and promote the fix so the already-merged constellation revision can deploy safely.

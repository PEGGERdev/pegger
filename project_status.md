# Pegger Hub Project Status

## Current Scope

| ID | Item | Source | Status | Files | Verification |
|---|---|---|---|---|---|
| HUB-001 | Add deterministic desktop and mobile e2e screenshot coverage for every visible hub state | User request, `TODO.md` technical debt | completed | `playwright.config.js`, `tests/e2e/hub.e2e.spec.js`, `tests/e2e/hub.e2e.spec.js-snapshots/`, `package.json` | 12 scenarios with 20 Windows and 20 generated Linux baselines |
| HUB-002 | Inspect generated screenshots and correct visible layout, responsive, and polish defects | User request, Phase 1 TODO | completed | `src/App.vue`, `src/components/StarMap.vue`, `src/components/Star.vue`, `src/components/StarPanel.vue`, `src/components/ConstellationLines.vue`, `src/style.css` | Desktop and Pixel 7 states reviewed; interaction assertions passed |
| HUB-003 | Reconcile Phase 1 TODO state with implemented behavior and record evidence | `opencode.md` | completed | `TODO.md`, `project_status.md` | Completed work and future scope are explicitly separated |
| OPS-001 | Repair production routing and add gated automatic deployment from `master` | User request | in_progress | `.github/workflows/deploy.yml`, `scripts/deploy-production.sh`, `deployment/`, `README.md` | Local gates and PR CI pass; production retry pending |

## Scope Boundaries

- Phase 1 star-map presentation and interactions are the active product scope.
- Phase 2 dev terminal and Phase 3 passkey authentication are explicitly future phases and are not enabled by this frontend.
- Optional sound effects remain outside the current product scope.
- Production deployment automation is the active operations scope.

## Baseline Verification

```text
npm test: 12 passed, 0 failed
npm run typecheck: passed
npm run build: passed
npm run test:e2e:update: 12 passed, 0 failed; 20 Windows baselines generated
npm run test:e2e: 12 passed, 0 failed; all Windows baselines matched
npm audit --audit-level=low: 0 vulnerabilities
```

## Risks

| ID | Risk | Status | Handling |
|---|---|---|---|
| R-001 | Canvas stars and ambient motion can make screenshots nondeterministic. | mitigated | Visual tests use reduced motion and seeded randomness; the canvas renders once in reduced-motion mode. |
| R-002 | Existing worktree contains broad uncommitted feature/runtime changes. | monitored | New work is isolated on `feature/visual-e2e-coverage`; unrelated changes are preserved. |
| R-003 | npm reported four dependency vulnerabilities, including high-severity Vite advisories. | mitigated | Vite and affected transitive tooling were updated; `npm audit --audit-level=low` now reports zero vulnerabilities. |
| R-004 | The apex domain has no Caddy route, so HTTPS currently fails despite a healthy hub container. | active | Deployment now detects the apex route exactly, validates Caddy, reloads it, and verifies the deployed revision publicly. |
| R-005 | Linux visual baselines were required before CI could enforce screenshot comparisons. | mitigated | Twenty Linux baselines were generated in run `29392648821`, reviewed, committed, and passed PR and master CI. |

## Deployment Continuation Notes

- GitHub repository: `PEGGERdev/pegger`; default and production branch: `master`.
- Working branch: `feature/visual-e2e-coverage`.
- Production access succeeds with `C:\Users\xxblu\.ssh\spotonsight_deploy` as the configured server user.
- Production deployment now follows the server-standard SpotOnSight pattern with `VPS_HOST`, `VPS_USER`, and `VPS_SSH_KEY`.
- The legacy `DEPLOY_PASSWORD` secret remains present but is no longer referenced.
- Server state before deployment: `pegger-hub` is running and healthy on the `spotonsight_proxy` network; `/health` succeeds inside the container.
- Public state before deployment: DNS resolves and HTTP redirects to HTTPS, but TLS fails because the shared Caddyfile has subdomain routes only and no apex `pegger.dev` route.
- Root cause in the old script: `grep -q 'pegger.dev'` matched subdomains such as `portfolio.pegger.dev`, so the apex route was never appended.
- The `deploy-production` job SSHes into the server checkout, fast-forwards `master`, verifies the exact SHA, and runs `scripts/deploy-production.sh` locally on the VPS.
- The production script builds an immutable Nginx image, creates a migration-safe rollback image from the legacy bind-mounted site, checks container health, validates and reloads Caddy with a backup, and verifies `/revision.txt` equals `GITHUB_SHA`.
- Deploy jobs are serialized, and each job rechecks that its SHA is still the current `master` head after acquiring the deployment slot.
- Pull requests and pushes run unit tests, type checks, production build, and Playwright. CI uses Linux visual baselines; local development uses Windows baselines.
- GitHub baseline generation run `29392648821` passed all 12 scenarios and produced the 20 Linux snapshots; deployment was skipped as designed.
- PR `#1` merged as `2f409472a5304a7f0d4fc210e18816fc02e7df79`; run `29393060094` passed CI but failed before the release swap because the original multiline SSH secret was rejected.
- Run `29393060094` did not change server files because SSH failed before the server-standard key-agent pattern was restored.
- The app now bundles fonts locally, restores modal focus, traps keyboard focus, locks document scrolling, preserves mobile wheel scrolling, redraws reduced-motion stars after resize, and avoids compact-height overlay collisions.

## Remaining Release Sequence

1. Commit and push the server-standard `deploy-production` workflow, Docker image, and migration-safe rollback changes.
2. Open a follow-up pull request and confirm its Linux CI and visual checks pass.
3. Merge the follow-up pull request into `master` and monitor the production job.
4. Confirm the GitHub run SHA matches `https://pegger.dev/revision.txt`, `/health` returns `ok`, the container is healthy, TLS is valid, and the live heading renders in a browser.

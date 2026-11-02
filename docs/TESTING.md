# Verification notes

Verified during development on November 2, 2026. This validates the demonstration, not readiness to handle
real applicants, sensitive documents, or money.

## Automated checks

- Strict TypeScript compilation.
- 10 Vitest tests covering: contribution recording; invalid amounts; overfunding; final-cent completion;
  application amount bounds; donor-role denial; duplicate-flag verification blocking; review and audit writes;
  valid local-state reload; malformed/outdated/nested stored-data rejection; and manipulated funding totals.
  Some related cases share a single test.
- Vite optimized production build.
- Prettier source consistency check.

Run `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm exec prettier --check .` after changes. The CI
workflow runs the first three checks after installation.

## Browser checks performed

The browser preview returned HTTP 200. The interface was inspected at desktop (1440×1000) and phone
(390×844) viewports. Tested behavior includes:

- Category filtering, search narrowing, and empty-search recovery.
- Saving a fictional request, opening the contribution dialog, rejecting overfunding, completing a simulated
  contribution, disabling a fully funded request, and updating impact/history.
- Invalid assistance amount feedback; requiring a fictional document placeholder and the demo acknowledgement;
  saving a sample application and displaying its tracking status.
- Default reviewer queue denial; simulated role selection; duplicate-flag verification blocking; successful
  review; audit history; and status persistence after reload. Reviewer role resets on reload.
- Mobile navigation opening/closing and route changes; swipe-card left-arrow navigation and visible button
  alternatives; no horizontal document overflow at 390px.
- Native modal focus behavior, close controls, form labels, visible focus styles, and reduced-motion rules.

Further formal accessibility auditing, assistive technology testing, a full browser/device matrix, and touch
gesture testing on physical devices remain necessary before a pilot. Browser checks were interactive QA;
they are not an automated end-to-end suite.

## Known demonstration boundaries

- All data is fictional and local to the browser origin. Tabs/devices do not synchronize.
- The role switch, review statuses, duplicate flag, audit list, notification switches, and document attachment
  are workflow simulations. They do not implement production security, fraud detection, messaging, or file storage.
- Initial funding amounts are fixtures, not activity by real donors. My impact totals include only your own
  simulated contributions.
- No backend authentication, database, provider integration, payment processor, or real transaction is present.
- Hosting success is established only from the deployment service's terminal result. A successful local build
  is not itself evidence that a hosted URL works.

## Suggested regression pass

Start with a new browser profile or reset demo activity in Settings after confirming the reset. Repeat both
donor and application paths, reload, review the application, check its changed status, and verify that trust
and prelaunch notices remain visible. Use only fictional presets and never attach real documents.

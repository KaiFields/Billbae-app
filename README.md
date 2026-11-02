# BillBae — prelaunch application

**Swipe Right. Pay a Bill. Change a Life.**

An early-stage financial-relief concept founded by Kai Fields under Soft But Savage Lounge LLC.
This React and TypeScript application replaces the original single-file prototype with responsive,
browser-local demonstration workflows.

**BillBae is not accepting donations or real assistance applications, processing payments, or providing financial assistance.**
All names, locations, stories, bills, funding totals, verification labels, and activity in the application are fictional or simulated.

## Install and run

Requirements: Node.js **24 LTS** (minimum 22.12) and **pnpm 11.25.0**. Install the package manager with
`npm install --global pnpm@11.25.0` if it is not already available.

```sh
git clone https://github.com/KaiFields/Billbae-app.git
cd Billbae-app
git checkout codex/prelaunch-app
pnpm install --frozen-lockfile
pnpm dev
```

Open the printed local URL, normally `http://127.0.0.1:5173`. Port 5173 is strict; stop a conflicting
process or pass `--port 5174`. There are no environment variables, API keys, or external services to configure.
Fonts and icons are bundled locally; the app does not require third-party font or image requests.
The font licenses are in `public/fonts`.

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm preview
pnpm exec prettier --check .
```

The production build is in `dist/`. `pnpm preview` serves it on port 4173. Use `pnpm exec prettier --write .`
to format source. CI runs installation, type checking, tests, and a production build on pushes and pull requests.

## Try the workflows

- **Discover:** filter electricity, water, and phone requests; search by story, fictional name, or city; sort;
  bookmark a story; switch between grid and swipe views. Swipe left to pass and right to explore helping.
  The swipe card also supports left/right arrow keys and visible buttons.
- **Simulate giving:** enter a sample amount, including cents, up to the remaining goal. The history and
  funding bar update locally. No card entry, checkout, payment SDK, receipt, or financial transaction exists.
- **My impact and saved requests:** view your own demo contributions, category totals, and bookmarks.
- **Request assistance:** choose a category, sample amount, and preset scenario; attach a built-in
  fictional document placeholder; review and acknowledge the demo; save a local application.
  There is deliberately no file picker, contact information, account number field, or free-text personal story.
- **Admin preview:** the default demo donor role cannot view the queue or change review status. Switch to
  the simulated reviewer role, review a fictional application, test a duplicate flag, and inspect local audit
  history. Verification is blocked while a duplicate flag is active. Changes appear in the application tracker.
- **Settings:** change local notification preferences (nothing is sent), or confirm a full local demo reset.
- **Welcome and trust:** use the crown-and-heart logo to find both onboarding pathways; view launch requirements
  and plain-language privacy information in Trust & transparency.

## Architecture and data boundaries

```text
src/
  App.tsx                      application shell, hash navigation, discovery and dashboards
  domain.ts                    typed records, amount validation, funding and review rules
  data/demo.ts                 isolated fictional request fixtures
  services/demoRepository.ts   localStorage adapter and runtime validation
  components/                  brand, cards, native-dialog modal, shared UI
  features/                    contribution, application, review, and trust workflows
  domain.test.ts               funding, review authorization, and persistence tests
  styles.css                   responsive brand and layout rules
  readability.css              shared readable type and touch target rules
```

The storage key is `billbae-prelaunch-v1`. Previous prototype storage is intentionally not migrated.
Corrupt or incompatible saved data falls back to a fresh demo with a visible warning. Storage failures keep
the current visit usable and show a warning. Local browser activity is device/origin-specific, can be edited
by the browser user, and is not a multi-user database. Concurrent browser tabs are not synchronized.

`Role` is only a simulation and resets to donor on reload. **It is not authentication or security.**
The admin route and all source are public client code; never place real records, secrets, or private
administrative actions here. A private hosted preview limits the audience of the entire demo; it does not
make the client role switch production authorization. The audit list is editable local demo data.

Future integration should replace the local adapter with authenticated API methods and server-side
validation/authorization. Move role decisions, ownership checks, review transitions, audit writes, and
funding accounting to the server. Keep demonstration fixtures out of production data paths. See
[the production roadmap](docs/ROADMAP.md) before integrating any real applicants or payments.

## Deployment and verification

See [deployment instructions](docs/DEPLOYMENT.md) and [verification notes](docs/TESTING.md).
The existing [B12 website](https://billbae.b12sites.com/) is a separate concept site.
Deploying this application does not update that site or its domain.

Privacy text in this demo describes current demonstration behavior and future requirements. It is not a
production privacy policy, legal approval, or a claim of financial-service readiness.

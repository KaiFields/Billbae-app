# Deployment

The application is a static React build with browser-local demo data. No backend or payment service is needed.
The existing B12 site is independent and is not modified by this deployment.

## Build

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

Check the production build at `http://127.0.0.1:4173`. Confirm the prelaunch banner and no real payment or
file-upload controls. Test a contribution, saved request, and sample application; reload to check persistence.
Browser storage belongs to each origin, so local activity will not appear on the hosted origin.

## Sites hosting

`.openai/hosting.json` records the private preview Site identity and `static.directory: dist`. Preserve that
identity for future deployments; do not create a new Site for each update. Runtime environment variables
are not used. Do not store secrets in this file or any `VITE_*` variable (those are client-visible).

Using the Sites connector and its skill workflow:

1. Read the saved Site's current ownership and audience. Preserve its private audience.
2. Obtain a short-lived repository write credential and pass it through the source helper's stdin.
   Never store credentials in files, Git remotes, command arguments, or logs.
3. Build and test the selected source. Commit and push that exact source to the Site repository.
4. Package `dist/` and `.openai/hosting.json` into a supported deployment archive using the Sites helper.
5. Save and deploy the exact pushed commit using the private publishing operation.
6. Check the deployment result through a terminal `succeeded` state and retain the returned URL/version.
   An expected URL alone is not proof of a deployed site.

Use the saved version history for rollback. Recheck the audience before rollback or redeployment.

## Another static host

Publish only `dist/` after checks pass. Hash routes such as `/#request` need no server-side history fallback;
the application must be served from the origin root. A subdirectory deployment needs a matching Vite base
and asset paths. Use HTTPS, an approved audience, and suitable hosting response headers. The HTML includes
`noindex,nofollow` but that does not restrict access; configure actual host authentication for a private preview.
Security headers in `public/_headers` apply only on hosts that support that file; verify headers on the chosen host.

Verify the deployed URL and relevant workflows rather than assuming a successful build guarantees hosting.
Do not introduce any real user data or payments until the [production roadmap](ROADMAP.md) is complete.

# Before real applications or payments

This release is a functional front-end demonstration. Nothing in this roadmap is completed merely because
a corresponding screen exists. No launch date or guarantee of assistance is implied.

## 1. Product and operating model

- Define eligibility, supported geography, bill categories, caps, review deadlines, appeals, and support ownership.
- Confirm the legal entity and operating model, payment/donation wording, accounting and reporting obligations,
  fundraising requirements, tax treatment, consumer protection, privacy obligations, and applicable provider terms
  with qualified legal, compliance, and accounting advisers. Do not imply donations are tax deductible.
- Define incident response, service provider contacts, complaints, escalation, and launch go/no-go owners.

Acceptance: documented operating policies, completed professional review, owner sign-off, and a staffed pilot plan.

## 2. Secure backend and identity

- Select an authenticated API, database, deployment environments, and secrets management.
- Establish separate production and demonstration datasets; prevent demo fixtures or local roles from enabling production actions.
- Implement donor, applicant, reviewer, and administrator identities with server-side role and resource ownership checks;
  MFA for privileged roles; session expiry; rate limits; account recovery; and access revocation.
- Use exact currency accounting in integer minor units, transactional updates, concurrency control, and idempotency.
- Add migrations, backup/restore drills, health checks, monitoring, and error reporting with sensitive-data redaction.

Acceptance: permission tests include cross-user and cross-role denial; restore and incident exercises pass.

## 3. Private applications and verification

- Obtain clear informed consent, publish an approved privacy notice, minimize fields, and implement retention/deletion rules.
- Add encrypted private object storage, short-lived access links, file type/size validation, malware scanning,
  restricted reviewer access, and document redaction. No publicly accessible identity or bill documents.
- Verify provider identity, bill ownership, balance, and eligibility; implement duplicate/fraud detection, human review,
  conflict handling, explanations, and appeals. Avoid exposing sensitive household stories publicly.
- Store append-only protected audit events with actor, reason, timestamp, and review change history.

Acceptance: security and privacy reviews pass; documents remain inaccessible to unauthenticated and unrelated users;
review decisions and appeals are traceable.

## 4. Direct-to-provider payments

- Select a suitable payment provider and approved transaction model. Complete onboarding and required controls.
- Build a server-only payment interface. Never trust browser totals, provider IDs, or callback success states.
- Use verified signed webhooks, idempotent handlers, reconciliation, partial funding rules, overfunding prevention,
  reversals/refunds, disputes, and accurate transaction reporting. Validate provider settlement destinations.
- Exercise sandbox success, declines, timeouts, replayed/out-of-order webhooks, duplicate clicks, and recovery.

Acceptance: independent end-to-end sandbox validation and approved reconciliation and dispute procedures.
Live credentials stay disabled until all launch gates are met.

## 5. Controlled pilot and mobile readiness

- Conduct independent penetration testing, dependency review, accessibility testing with assistive technology,
  user acceptance tests, and load/reliability testing. Address findings before serving real people.
- Run a limited consented pilot with documented support coverage, funding availability, and stopping criteria.
- Reuse TypeScript domain and API contracts for a future React Native/Expo client or assessed native wrapper.
  Design secure mobile sessions, permissions, document capture, notifications, and platform policies separately.
  A responsive web interface alone is not a tested Android/iOS application.

Acceptance: pilot sign-off and monitored operational readiness before any broader rollout.

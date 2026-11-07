---
id: D293
date: 2026-11-05
time: 21:03
kind: decision
title: ants-lab login copy-back fields verified from the user's keys-only listing; copy-back tightened: only token and refresh-time fields may differ, everything else byte-equal, Muse keyed on user_email
---
- **2026-11-05 ≈ 21:03 UTC — ants-lab login copy-back fields verified from the user's keys-only listing; copy-back tightened: only token and refresh-time fields may differ, everything else byte-equal, Muse keyed on user_email.**
  - **What:** the user ran a keys-only listing of the two lab login files and pasted the field names and types,
    with no values. Neither the lead nor the implementer read either file.
    - **Codex** `auth.json`: `auth_mode`, `OPENAI_API_KEY` (null), `tokens.{id_token, access_token, refresh_token,
      oauth_provenance.issuer, oauth_provenance.client_id, login_owner_id, account_id}`, `last_refresh`. The fields
      D292 assumed, `tokens.account_id` and `last_refresh`, are present.
    - **Muse** `config/muse/auth.json`: `schema_version`, `providers.meta.{access_token, api_base_url, api_key,
      mechanism, obtained_via, subs_active, user_email, user_full_name}`. None of the candidate names in
      `LOGIN_FORMAT` match. The account is `providers.meta.user_email`. There is no refresh time and no refresh
      token.
  - **Lead's decision (copy-back tightened):**
    - Account fields: Codex `tokens.account_id`; Muse `providers.meta.user_email`.
    - A session's changed login is copied back only if it parses, the account is the same, and every field except
      the engine's **refreshable fields** is equal to the lab file's: same keys, same values. The refreshable fields
      are:
      - Codex: `tokens.id_token`, `tokens.access_token`, `tokens.refresh_token`, `last_refresh`;
      - Muse: `providers.meta.access_token`.
    - Why: the old rule checked only the account. A session can edit its copy, so it could have changed
      `api_base_url`, `auth_mode`, `OPENAI_API_KEY` or `oauth_provenance` and had that become the stored login for
      every later session.
    - Codex also needs `last_refresh` to be later than the lab file's.
    - Muse records no refresh time, so on a conflict the lab file is kept (the D292 rule). Its candidate-name lists
      go.
    - Alerts keep naming fields, never values.
  - **Next:** follow-up 4, unit tests only and no model call (`brief.md` § Follow-up 4).

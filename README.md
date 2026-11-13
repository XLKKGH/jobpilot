# Jobpilot Search Lab
Software/Data/AI research prototype for Team 105. A fresh implementation inspired by the existing Jobpilot artifact and Abe Yang's job-search workflow: https://github.com/abeyang/job-skill-copilot/blob/main/SKILL.md . No source from that repository was copied.

## Scope
Live public Greenhouse board feeds for Anthropic, Databricks, Scale AI. Records source failures, fetch time, job snapshot, and rules version. This is a limited company pool, not broad market search. A listing appearing in a feed is not independent verification of its application page or evidence that the company is actively hiring.

Rules-based discipline, literal skill-term, location-text, and title-seniority matching. No trained model, LLM, embeddings, resume parser, sponsorship inference, or hiring probability. Keyword overlap can miss synonyms and negation; location text is not a legal eligibility test. Missing salary detection caps a recommendation at Questionable. No applications submitted.

## Storage and study
Cloudflare D1 stores search snapshots and completed trials. Session token authorizes trial submission; no public enumeration or results endpoint. No names/emails required. User consents before search. The JSON export includes profiles, full JD snapshots, event timestamps, before/after selections, feedback, and timings. Share exports only with study reviewers.

Baseline review and explanation review use the same job order and fixed snapshot. Changes in choice do not prove improved decision quality. This sequential design is not a comparative time-savings experiment. No pass/fail or invented results. Recruit actual job seekers; retain original 8/12 threshold separately. Review whether removed roles were independently low-fit before counting hypothesis successes.

Run `npm run dev`. Generate migrations with `npm run db:generate`; apply locally before testing. Build using the Sites helper. Hosted database migrations are applied at deployment. New Site is owner-private; facilitated tests can use the owner's screen. External participant access requires an explicitly selected sharing setting.

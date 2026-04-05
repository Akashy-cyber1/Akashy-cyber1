# SkyCode CRM — Project Plan (Phase 1 Foundation)

## Objective
Set up a production-style monorepo foundation for SkyCode CRM with clear backend/frontend structure, environment configuration, and module scaffolding.

## Scope Completed in Phase 1
- Repository structure for backend and frontend.
- Django + DRF base project configuration.
- Initial backend app scaffolds: auth, leads, followups, payments, reports.
- Next.js App Router base structure with API client utility layer.
- Environment variable template (`.env.example`).
- Updated README with setup and run steps.

## Out of Scope (Next Phases)
- Full data models and migrations for all CRM entities.
- Authentication flows (signup/login/logout).
- CRUD APIs for leads/followups/payments.
- Dashboard, reports, and UI feature pages.

## Next Technical Milestones
1. Define all core models and relationships.
2. Implement JWT auth module and role-aware business scoping.
3. Build lead management APIs with validation + tests.
4. Add frontend lead pipeline and follow-up workflows.

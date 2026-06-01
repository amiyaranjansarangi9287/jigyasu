# Jigyasu Unification Task List

## Phase 0: Foundation (Jigyasu Monorepo)

- [x] Create `D:\vision_agentic\jigyasu` directory structure.
- [x] Initialize pnpm workspace configuration.
- [x] Set up `@jigyasu/*` workspace packages:
  - [x] `@jigyasu/ui`
  - [x] `@jigyasu/utils` 
  - [x] `@jigyasu/storage`
- [x] Set up initial application skeletons:
  - [x] `apps/web` (The unified frontend)
  - [x] `apps/backend` (The Bun telemetry server)
- [ ] Copy and merge content from existing directories:
  - [x] Shared components from `learnos` to `@jigyasu/ui`
  - [x] Utilities from `learnos` to `@jigyasu/utils`
  - [x] Storage engine from `learnos` to `@jigyasu/storage`
  - [ ] Content and modules to `apps/web`
    - [x] Scaffold `apps/learn` (Vite, React, Tailwind)
    - [x] Scaffold `apps/camp` (Vite, React, Tailwind)
    - [ ] Migrate `fun-with-science` & `visual-science-learning-framework` to `apps/learn`
    - [ ] Migrate `kids-camp` & `toybox-project-memory-snapshot` to `apps/camp`

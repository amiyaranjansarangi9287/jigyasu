# Application Unification: Apps/Learn & Apps/Camp

Based on the survey of `D:\kids_website\` and `D:\vision_agentic\websites\`, we have a rich collection of learning modules and interactive toys. To align with the "Offline First" and "Equity" mission while keeping the architecture modular, we will create two distinct frontend applications in our monorepo:

1. **`apps/learn`**: The educational concept explorer (theory).
2. **`apps/camp`**: The execution/sandbox portal (interactive games/activities).

Both apps will consume our hardened `@jigyasu/ui`, `@jigyasu/utils`, and `@jigyasu/storage` packages to ensure unified telemetry and local progress syncing, without leaking private data.

## User Review Required

> [!IMPORTANT]
> Since we are creating two apps, the "Sync Code" logic (cross-device sync) will need to be accessible from both apps so a user can sync their theoretical progress (Learn) with their practical achievements (Camp). 

## Open Questions

> [!TIP]
> Should `apps/learn` and `apps/camp` share a single landing page router, or should they be built as two entirely separate HTML entry points (e.g. `learn.jigyasu.org` and `camp.jigyasu.org`) that link to each other? (Separate entry points is safer for 2G networks to reduce bundle sizes).

## Proposed Changes

### `apps/learn` (The Learning Portal)

This app will pull content related to science modules and structured learning.

#### [NEW] [package.json](file:///D:/vision_agentic/jigyasu/apps/learn/package.json)
#### [NEW] [App.tsx](file:///D:/vision_agentic/jigyasu/apps/learn/src/App.tsx)
Content Migration Sources:
- `D:\vision_agentic\websites\fun-with-science`
- `D:\vision_agentic\websites\visual-science-learning-framework`

---

### `apps/camp` (The Interactive Sandbox)

This app will pull content related to unstructured play, building, and lab execution.

#### [NEW] [package.json](file:///D:/vision_agentic/jigyasu/apps/camp/package.json)
#### [NEW] [App.tsx](file:///D:/vision_agentic/jigyasu/apps/camp/src/App.tsx)
Content Migration Sources:
- `D:\kids_website\kids-camp`
- `D:\kids_website\interactive-web-toy-examples`
- `D:\vision_agentic\websites\toybox-project-memory-snapshot`

## Verification Plan

### Automated Tests
- Run `pnpm build` in the monorepo root to ensure both new applications compile correctly against the shared packages.
- Run `vitest` to ensure no regressions in our utilities and storage layers.

### Manual Verification
- Launch both apps in dev mode (`pnpm dev`) and manually test navigation and offline data persistence (Dexie) in the browser.

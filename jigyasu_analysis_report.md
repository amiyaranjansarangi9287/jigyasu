🔍 PHASE A — Project Discovery
{
  "project_name": "jigyasu / @jigyasu/hub",
  "react_version": "^19.0.0",
  "vite_version": "^6.1.0",
  "total_components": 354,
  "total_pages": 335,
  "feature_areas": [
    "landing",
    "local profile wizard",
    "kidscamp maker activities",
    "family home",
    "tiny world",
    "early world",
    "lab world",
    "discovery world",
    "academy world",
    "explorer world",
    "biology",
    "math",
    "physics",
    "offline progress",
    "telemetry",
    "parent corner"
  ],
  "state_management": "React useState/useEffect + Zustand persist + Dexie + localStorage",
  "styling_approach": "Tailwind CSS v4 utility classes + global CSS files",
  "api_layer": "fetch('/api') + development stubs + IndexedDB offline queue",
  "test_setup": "Playwright at repo root; Vitest test files exist in hub but dependencies/scripts are missing",
  "typescript": true,
  "entry_point": "apps/hub/src/main.tsx",
  "router": "react-router-dom BrowserRouter + nested Routes"
}
Severity	Type	Finding
🔴 CRITICAL	[BUG]	apps/hub is not included in the pnpm workspace, so root pnpm -r build/lint/dev ignores the production hub. [pnpm-workspace.yaml::WorkspaceConfig::packages | line 2]
🔴 CRITICAL	[BUG]	npm run build fails because web-vitals, vitest, and Testing Library imports are referenced but not declared. [apps/hub/src/learnos/services/performance.ts::PerformanceService::imports | line 4]
🟠 HIGH	[PERF]	Vite has PWA config but no build.rollupOptions.manualChunks, target, sourcemap, or preview hardening. [apps/hub/vite.config.ts::ViteConfig::defineConfig | line 11]
🟡 MEDIUM	[A11Y]	index.html has lang, charset, and viewport, but title is generic and no description/OG metadata exists. [apps/hub/index.html::DocumentHead::title | line 7]
✅ GOOD	[BUG]	TypeScript strict mode is enabled in hub config. [apps/hub/tsconfig.json::TypeScriptConfig::compilerOptions | line 14]
Fix

# pnpm-workspace.yaml
packages:
  - 'apps/hub'
  - 'apps/camp'
  - 'apps/toys'
  - 'packages/*'
// apps/hub/package.json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "lint": "eslint ."
  },
  "dependencies": {
    "web-vitals": "^5.0.0"
  },
  "devDependencies": {
    "vitest": "^3.0.0",
    "@testing-library/react": "^16.0.0"
  }
}
Test to verify: run corepack pnpm --filter @jigyasu/hub build, corepack pnpm --filter @jigyasu/hub test, and corepack pnpm -r list --depth -1; hub must appear and build cleanly.

State: PHASE A COMPLETE — proceeding to Phase B.

⚛️ PHASE B — React + Vite Engineering Audit
Severity	Type	Finding
🔴 CRITICAL	[BUG] [KIDS-SPECIFIC]	Lab, Discovery, and Explorer progress loads from composite keys but saves under single conceptId, so children lose progress after refresh. [apps/hub/src/learnos/worlds/lab/hooks/useLabProgress.ts::useLabProgress::load | line 67]
🔴 CRITICAL	[BUG] [KIDS-SPECIFIC]	CircuitBuilder calls checkCircuit() immediately after async setComps/setWires, so success may be checked against stale state. [apps/hub/src/learnos/worlds/lab/modules/CircuitBuilder.tsx::CircuitBuilder::handleTap | line 67]
🔴 CRITICAL	[BUG]	App has only one global error boundary; a lab crash takes down the whole learning shell instead of isolating the broken activity. [apps/hub/src/learnos/App.tsx::App::routes | line 35]
🟠 HIGH	[BUG]	ExplorerShell effect uses trackConceptOpen, conceptInfo, and lumo but only depends on concept, creating stale closure risk. [apps/hub/src/learnos/worlds/explorer/ExplorerShell.tsx::ExplorerShell::useEffect | line 31]
🟠 HIGH	[PERF]	DynamicRoutes creates lazy(loader) inside render loops, causing component identity churn and remount risk. [apps/hub/src/learnos/core/modules/DynamicRoutes.tsx::WorldRoutes::map | line 151]
🟠 HIGH	[PERF]	Lint fails with 303 errors and 76 warnings, including hook purity and exhaustive-deps issues. [apps/hub/src/learnos/hooks/useIdleTimer.ts::useIdleTimer::render | line 44]
🟡 MEDIUM	[PERF]	MathApp calls Math.random() during render for animated stars, producing non-idempotent renders. [apps/hub/src/learnos/worlds/math/components/MathApp.tsx::MathAppInner::render | line 86]
🟡 MEDIUM	[BUG]	MathProvider starts toast-removal timeouts without cleanup, risking setState after unmount. [apps/hub/src/learnos/worlds/math/lib/MathContext.tsx::MathProvider::pushEvent | line 46]
Fix snippets

// useLabProgress.ts
const stored = await db.conceptProgress.get('lab-world-progress');
// useDiscoveryProgress.ts
const stored = await db.conceptProgress.get('discovery-world-progress');
// useExplorerProgress.ts
const stored = await db.conceptProgress.get(PROGRESS_KEY);
// CircuitBuilder.tsx
useEffect(() => {
  const hasBattery = comps.some((c) => c.type === 'battery');
  const hasBulb = comps.some((c) => c.type === 'bulb');
  const complete = hasBattery && hasBulb && wires.length >= Math.max(1, comps.length - 1);

  if (complete && !isOn) {
    setIsOn(true);
    void recordCircuitComplete(false, false);
    void updateCertification('circuit-builder', 'explorer');
  }
}, [comps, wires, isOn, recordCircuitComplete, updateCertification]);
// App.tsx
<Route
  path={`${ROUTES.LAB}/*`}
  element={
    <ErrorBoundary fallback={<LabRecovery />}>
      <LabWorld />
    </ErrorBoundary>
  }
/>
// DynamicRoutes.tsx
const lazyModules = Object.fromEntries(
  Object.entries(moduleLoaders).map(([key, loader]) => [key, lazy(loader)])
);
const Component = lazyModules[loaderKey];
Test to verify: add Dexie persistence tests for each progress hook, a Playwright refresh test after completing one lab step, and rerun npm run lint until it exits 0.

State: PHASE B COMPLETE — proceeding to Phase C.

🎨 PHASE C — Child-Centric UI/UX Audit
Severity	Type	Finding
🔴 CRITICAL	[UX] [KIDS-SPECIFIC]	Unknown routes silently redirect to family home, so a child/deep link gets no “not found” recovery path. [apps/hub/src/learnos/App.tsx::App::catchAllRoute | line 66]
🔴 CRITICAL	[BUG] [DESIGN]	Math hero references /images/math-kingdom-hero.jpg, but that asset is absent from apps/hub/public/images; the child sees a broken/blank hero background. [apps/hub/src/learnos/worlds/math/components/MathApp.tsx::HomePage::heroImage | line 221]
🟠 HIGH	[KIDS-SPECIFIC]	Time Capsule and Teach Me Mode collect free text with adult-style textareas and no moderation/guardrails. [apps/hub/src/learnos/crosscutting/TimeCapsule.tsx::TimeCapsule::textarea | line 240]
🟠 HIGH	[KIDS-SPECIFIC]	Some modules use tiny secondary text (text-xs, text-[10px]) for key instructions/data, too small for early readers. [apps/hub/src/learnos/worlds/lab/modules/TimelineExplorer.tsx::TimelineExplorer::eventDescription | line 51]
🟡 MEDIUM	[KIDS-SPECIFIC]	Math nav hides labels on small screens, leaving emoji-only navigation for children who may not infer meaning. [apps/hub/src/learnos/worlds/math/components/MathApp.tsx::MathAppInner::tabNav | line 160]
Fix snippets

// App.tsx
<Route path="*" element={<KidFriendlyNotFound />} />
function KidFriendlyNotFound() {
  return (
    <main className="min-h-screen grid place-items-center bg-orange-50 p-6">
      <section className="max-w-md text-center">
        <h1 className="text-3xl font-black text-slate-900">This path is missing</h1>
        <p className="mt-3 text-lg text-slate-700">Pick a world and keep going.</p>
        <Button onClick={() => navigate(ROUTES.FAMILY_HOME)} size="lg">
          Go Home
        </Button>
      </section>
    </main>
  );
}
<img
  src="/images/hero-camp.jpg"
  alt=""
  width={1200}
  height={720}
  loading="eager"
  className="w-full h-full object-cover"
/>
<label htmlFor="time-capsule-note" className="block text-lg font-bold">
  Write one short idea
</label>
<textarea
  id="time-capsule-note"
  maxLength={280}
  aria-describedby="time-capsule-help"
/>
<p id="time-capsule-help">No names, addresses, phone numbers, or private details.</p>
Test to verify: run Playwright at 375px, 768px, and desktop; visit a bad URL, Math home, and Time Capsule; verify no broken images, labels are visible, and free text rejects private info patterns.

State: PHASE C COMPLETE — proceeding to Phase D.

♿ PHASE D — Accessibility Audit (WCAG 2.2 AA)
Severity	Type	Finding
🔴 CRITICAL	[A11Y] [KIDS-SPECIFIC]	Math toast feedback is visual only; no aria-live, so screen-reader users miss correct/wrong/level-up feedback. [apps/hub/src/learnos/worlds/math/lib/MathContext.tsx::MathProvider::toastOverlay | line 96]
🔴 CRITICAL	[A11Y]	Time Capsule uses paragraph text instead of associated labels for select and textarea. [apps/hub/src/learnos/crosscutting/TimeCapsule.tsx::TimeCapsule::createForm | line 226]
🔴 CRITICAL	[A11Y] [KIDS-SPECIFIC]	Math CSS overrides global touch target minimum to 36px, below WCAG 2.5.8 target size. [apps/hub/src/learnos/worlds/math/math.css::MathCss::touchTargets | line 109]
🟠 HIGH	[A11Y]	Shared UI navbar buttons use outline-none, suppressing visible focus unless replaced everywhere. [packages/ui/src/Navbar.tsx::Navbar::brandButton | line 81]
🟠 HIGH	[A11Y]	Error boundary exposes technical details and copy-error action to children; recovery UI should be child-safe and parent-only for diagnostics. [apps/hub/src/learnos/shared/ui/ErrorBoundary.tsx::ErrorBoundary::render | line 85]
Fix snippets

<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="fixed top-20 right-4 z-[200]"
>
  {events.map((event) => (
    <FeedbackToast key={event.id} event={event} />
  ))}
</div>
/* math.css */
button,
[role="button"] {
  min-height: 44px;
  min-width: 44px;
}
<label htmlFor="capsule-duration">When should it open?</label>
<select id="capsule-duration" value={selectedConcept} onChange={...} />
<button className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500">
  Menu
</button>
Test to verify: run axe/Playwright keyboard tests; tab through navbar, Time Capsule, Math nav, and error screen; verify all controls have names, 44x44 hit areas, visible focus, and live feedback announcements.

State: PHASE D COMPLETE — proceeding to Phase E.

🔒 PHASE E — Security, Privacy, and Compliance
Severity	Type	Finding
🔴 CRITICAL	[SECURITY] [KIDS-SPECIFIC]	Welcome wizard collects a child nickname/avatar/language without a verifiable parent gate or consent flow. [apps/hub/src/App.tsx::WelcomeWizard::handleSubmit | line 29]
🔴 CRITICAL	[SECURITY] [KIDS-SPECIFIC]	Free-text child inputs can store private or inappropriate content locally and export it later. [apps/hub/src/learnos/shared/ui/DataExport.tsx::DataExport::handleExport | line 16]
🟠 HIGH	[SECURITY]	Telemetry posts analytics to ${VITE_API_BASE_URL}/analytics/batch after consent, but consent text says no personal data is sent; there is no parent consent distinction. [apps/hub/src/learnos/services/telemetry.ts::Telemetry::flushQueue | line 145]
🟠 HIGH	[SECURITY]	Sentry DSN is client-exposed via VITE_SENTRY_DSN; acceptable for DSNs, but no CSP or deployment header config is present to limit script/connect destinations. [apps/hub/src/learnos/services/sentry.ts::SentryService::config | line 12]
✅ GOOD	[SECURITY]	No dangerouslySetInnerHTML, eval, or new Function usages were found in app source. [apps/hub/src/learnos/services/api/client.ts::ApiClient::fetch | line 28]
Fix snippets

// Gate profile creation behind parent consent.
if (!parentConsent.confirmed) {
  return <ParentConsentGate onVerified={setParentConsent} />;
}
const PRIVATE_INFO = /\b(?:\d{10}|\S+@\S+\.\S+|address|phone|school name)\b/i;

function sanitizeChildText(value: string) {
  if (PRIVATE_INFO.test(value)) {
    throw new Error('Please remove private information.');
  }
  return value.slice(0, 280);
}
<!-- deployment header example -->
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  connect-src 'self' https://sentry.io;
  img-src 'self' data:;
Test to verify: attempt nickname/profile creation without parent gate, enter email/phone/address in textareas, export data, and inspect network calls after accepting/declining consent.

State: PHASE E COMPLETE — proceeding to Phase F.

🌐 PHASE F — Cross-Cutting and Edge Cases
Severity	Type	Finding
🔴 CRITICAL	[BUG]	Production build is currently blocked. npm run build fails on missing modules before Vite can bundle. [apps/hub/package.json::PackageScripts::build | line 8]
🔴 CRITICAL	[BUG]	Root error boundary is present, but section-level boundaries are missing around labs, activities, dashboard, and subject worlds. [apps/hub/src/learnos/worlds/lab/index.tsx::LabWorld::routes | line 51]
🟠 HIGH	[BUG]	npm audit cannot run for hub because the app has no local lockfile and is excluded from the pnpm workspace lock graph. [pnpm-workspace.yaml::WorkspaceConfig::packages | line 2]
🟠 HIGH	[KIDS-SPECIFIC]	Offline indicator exists, but failed API calls in telemetry/progress are silent; children get no retry/recovery state mid-activity. [apps/hub/src/learnos/services/telemetry.ts::Telemetry::flushQueue | line 166]
🟡 MEDIUM	[PERF]	Performance telemetry logs to console in production path. [apps/hub/src/learnos/services/performance.ts::PerformanceService::sendToAnalytics | line 20]
Fix snippets

// telemetry.ts
catch {
  await markSyncPending();
  notifyOfflineQueue();
}
<ErrorBoundary fallback={<ActivityRecovery activityId="lab" />}>
  <Suspense fallback={<LoadingScreen message="Opening your lab..." />}>
    <Routes>{/* lab routes */}</Routes>
  </Suspense>
</ErrorBoundary>
if (import.meta.env.DEV) {
  console.debug(`[Perf] ${metric.name}`, metric.value);
}
Test to verify: build from root and hub, disable network during a lab, refresh a deep link, run npm audit/pnpm audit after workspace inclusion, and confirm visible recovery states.

State: PHASE F COMPLETE — proceeding to Phase G.

🗺️ PHASE G — Fix Roadmap + Production Scorecard
Master Issue Registry

#	Severity	Type	Phase	Component/File	Issue	Fix Summary	Effort
1	🔴	[BUG]	A/F	pnpm-workspace.yaml	Hub excluded from workspace	Add apps/hub to workspace	XS
2	🔴	[BUG]	A/F	performance.ts, tests	Build fails missing deps	Add deps or exclude tests from app tsconfig	S
3	🔴	[BUG] [KIDS-SPECIFIC]	B	useLabProgress, useDiscoveryProgress, useExplorerProgress	Progress loads wrong key	Load saved conceptId keys	S
4	🔴	[BUG] [KIDS-SPECIFIC]	B/C	CircuitBuilder	Stale state success check	Move completion logic to effect/computed next state	S
5	🔴	[A11Y]	D	MathContext	No live feedback announcements	Add role=status / aria-live	XS
6	🔴	[SECURITY]	E	WelcomeWizard	Child profile before parent consent	Add parent consent gate	M
7	🔴	[A11Y]	D	TimeCapsule	Inputs lack real labels	Add label/htmlFor and help text	XS
8	🟠	[PERF]	B	DynamicRoutes	Lazy components created in render	Hoist lazy map	S
9	🟠	[UX]	C	App	No child-friendly 404	Add 404 route	XS
10	🟠	[SECURITY]	E	DataExport	Exports unmoderated child text	Sanitize/free-text policy	S
11	🟠	[A11Y]	D	math.css	36px touch targets	Restore 44px min	XS
12	🟡	[PERF]	B	MathApp	Random values in render	Memoize generated stars	XS
Prioritized Fix Sprints

Sprint	Task	File	Code Fix	Test to Verify	Done Criteria
🚨 0	Make hub buildable from root	pnpm-workspace.yaml	Add apps/hub	corepack pnpm -r build	Hub included and green
🚨 0	Fix missing dependencies	apps/hub/package.json	Add web-vitals, vitest, Testing Library	npm run build	No TS2307
🚨 0	Fix progress key mismatch	progress hooks	Use single conceptId lookup	Complete lab, refresh	Progress survives
🚨 0	Fix circuit stale state	CircuitBuilder.tsx	Check completion in effect	Play circuit flow	Bulb lights reliably
🔥 1	Add kid 404 and recovery	App.tsx	KidFriendlyNotFound	Visit bad URL	No silent redirect
🔥 1	Add child-safe text guardrails	TimeCapsule.tsx	max length + private info validator	Type email/phone	Blocked with friendly message
♿ 2	Add labels/live regions/focus	MathContext, forms, nav	aria-live, labels, focus rings	axe + keyboard	WCAG blockers cleared
⚡ 3	Hoist lazy route map and chunk Vite	DynamicRoutes, vite.config.ts	lazy cache + manualChunks	build bundle report	Smaller stable chunks
Quick Wins Under 1 Hour

Add apps/hub to pnpm-workspace.yaml — fixes root build invisibility.
Replace <title>hub</title> with Jigyasu Learning Hub — fixes poor browser/screen-reader title.
Add meta name="description" and theme-color to index.html — improves install/share quality.
Change math button min-height from 36px to 44px — fixes touch target regression.
Add aria-live="polite" to Math feedback overlay — screen readers hear feedback.
Fix progress db.conceptProgress.get(...) keys — stops Lab/Discovery/Explorer progress loss.
Replace missing Math hero image path with an existing public asset — removes broken visual.
Add path="*" child-friendly 404 instead of redirect — removes dead-end confusion.
Production Readiness Scorecard

Domain	Score	Biggest Issue	Priority Fix
React Code Quality	4/10	Build and lint fail	Workspace + deps + hook cleanup
Performance	5/10	Chunk strategy and render purity issues	manualChunks + hoisted lazy + memoized random UI
Child UX + Engagement	6/10	Broken hero, silent 404, text-heavy flows	404, assets, child-safe form design
Interactive Labs	5/10	Progress loss and stale state in labs	Progress key fix + lab state tests
Accessibility (WCAG 2.2)	4/10	Missing live regions, labels, touch target regression	A11Y sprint
Security + Privacy	5/10	Child profile/free text lacks parent consent guard	Parent gate + content safeguards
Overall Launch Readiness	4.8/10	Build fails and progress can be lost	Fix workspace/build and progress persistence first
This platform is not ready to launch to children. The single most important fix is the progress persistence mismatch, immediately after making the hub buildable: a child losing lab/discovery progress on refresh is both a core product failure and a trust failure. Once build, lint, and persistence are stable, the next launch gate is accessibility and parent-consent hardening.
export type TeachingBridgeFeatureStatus = 'disabled' | 'enabled' | 'unconfigured';

export interface TeachingBridgeRequest {
  query: string;
  subject?: string;
  moduleId?: string;
  learnerLevel?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  sessionId?: string;
}

export interface TeachingActivity {
  type: string;
  prompt: string;
}

export interface TeachingArtifact {
  schema: 'bip/teaching_artifact/v1';
  trace_id?: string;
  session_id?: string;
  answer?: string;
  response?: string;
  subject?: string;
  domain?: string;
  language?: string;
  complexity?: string;
  concept_ids?: string[];
  prerequisites?: string[];
  next_activity?: TeachingActivity | null;
  pramana?: {
    grade?: string;
    score?: number;
  } | null;
  citations?: unknown[];
  mastery_update?: unknown;
}

export interface TeachingBridgeHint {
  status: TeachingBridgeFeatureStatus;
  prompt: string;
  traceId?: string;
  fallback: boolean;
  reason?: string;
}

export interface TeachingBridgeConceptMap {
  status: TeachingBridgeFeatureStatus;
  conceptIds: string[];
  prerequisites: string[];
  traceId?: string;
  fallback: boolean;
  reason?: string;
}

export interface TeachingBridgeNextActivity {
  status: TeachingBridgeFeatureStatus;
  activity: TeachingActivity | null;
  traceId?: string;
  fallback: boolean;
  reason?: string;
}

export interface TeachingBridgeClientOptions {
  enabled?: boolean;
  endpoint?: string;
  fetcher?: typeof fetch;
}

const DEFAULT_HINT =
  'Try one small example from the lesson, then explain what changed in your own words.';

function bridgeEnabled(): boolean {
  return import.meta.env.VITE_TEACHING_BRIDGE_ENABLED === 'true';
}

function bridgeEndpoint(): string | undefined {
  const endpoint = import.meta.env.VITE_TEACHING_BRIDGE_URL?.trim();
  return endpoint || undefined;
}

function disabledReason(enabled: boolean, endpoint?: string): string | undefined {
  if (!enabled) {
    return 'TeachingBridge is disabled by feature flag';
  }
  if (!endpoint) {
    return 'TeachingBridge endpoint is not configured';
  }
  return undefined;
}

function featureStatus(enabled: boolean, endpoint?: string): TeachingBridgeFeatureStatus {
  if (!enabled) {
    return 'disabled';
  }
  return endpoint ? 'enabled' : 'unconfigured';
}

function fallbackHint(reason?: string): TeachingBridgeHint {
  return {
    status: reason === 'TeachingBridge endpoint is not configured' ? 'unconfigured' : 'disabled',
    prompt: DEFAULT_HINT,
    fallback: true,
    reason,
  };
}

function normalizeArtifact(payload: unknown): TeachingArtifact {
  if (!payload || typeof payload !== 'object') {
    throw new Error('TeachingBridge returned an invalid teaching artifact');
  }

  const artifact = payload as Partial<TeachingArtifact>;
  if (artifact.schema !== 'bip/teaching_artifact/v1') {
    throw new Error('TeachingBridge returned an unsupported schema');
  }

  return artifact as TeachingArtifact;
}

async function fetchTeachingArtifact(
  request: TeachingBridgeRequest,
  options: TeachingBridgeClientOptions = {}
): Promise<{ artifact?: TeachingArtifact; status: TeachingBridgeFeatureStatus; reason?: string }> {
  const enabled = options.enabled ?? bridgeEnabled();
  const endpoint = options.endpoint ?? bridgeEndpoint();
  const status = featureStatus(enabled, endpoint);
  const reason = disabledReason(enabled, endpoint);

  if (reason || !endpoint) {
    return { status, reason };
  }

  const fetcher = options.fetcher ?? fetch;
  const response = await fetcher(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: request.query,
      subject: request.subject,
      module_id: request.moduleId,
      learner_level: request.learnerLevel ?? 'beginner',
      language: request.language ?? 'en',
      session_id: request.sessionId,
      source_client: 'jigyasu_teaching_bridge',
    }),
  });

  if (!response.ok) {
    throw new Error(`TeachingBridge request failed (${response.status})`);
  }

  return {
    artifact: normalizeArtifact(await response.json()),
    status,
  };
}

export async function requestHint(
  request: TeachingBridgeRequest,
  options: TeachingBridgeClientOptions = {}
): Promise<TeachingBridgeHint> {
  const result = await fetchTeachingArtifact(request, options);
  if (!result.artifact) {
    return fallbackHint(result.reason);
  }

  return {
    status: result.status,
    prompt: result.artifact.next_activity?.prompt || result.artifact.answer || result.artifact.response || DEFAULT_HINT,
    traceId: result.artifact.trace_id,
    fallback: false,
  };
}

export async function requestConceptMap(
  request: TeachingBridgeRequest,
  options: TeachingBridgeClientOptions = {}
): Promise<TeachingBridgeConceptMap> {
  const result = await fetchTeachingArtifact(request, options);
  if (!result.artifact) {
    return {
      status: result.status,
      conceptIds: [],
      prerequisites: [],
      fallback: true,
      reason: result.reason,
    };
  }

  return {
    status: result.status,
    conceptIds: result.artifact.concept_ids ?? [],
    prerequisites: result.artifact.prerequisites ?? [],
    traceId: result.artifact.trace_id,
    fallback: false,
  };
}

export async function requestNextActivity(
  request: TeachingBridgeRequest,
  options: TeachingBridgeClientOptions = {}
): Promise<TeachingBridgeNextActivity> {
  const result = await fetchTeachingArtifact(request, options);
  if (!result.artifact) {
    return {
      status: result.status,
      activity: null,
      fallback: true,
      reason: result.reason,
    };
  }

  return {
    status: result.status,
    activity: result.artifact.next_activity ?? null,
    traceId: result.artifact.trace_id,
    fallback: false,
  };
}

export function getTeachingBridgeStatus(
  options: Pick<TeachingBridgeClientOptions, 'enabled' | 'endpoint'> = {}
): TeachingBridgeFeatureStatus {
  return featureStatus(options.enabled ?? bridgeEnabled(), options.endpoint ?? bridgeEndpoint());
}

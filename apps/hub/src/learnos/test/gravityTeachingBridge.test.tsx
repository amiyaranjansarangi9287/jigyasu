import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import GravityTeachingBridge from '../worlds/physics/components/GravityTeachingBridge';

const bridgeMocks = vi.hoisted(() => ({
  getTeachingBridgeStatus: vi.fn(),
  requestHint: vi.fn(),
  requestConceptMap: vi.fn(),
  requestNextActivity: vi.fn(),
}));

vi.mock('../services/TeachingBridge', () => ({
  getTeachingBridgeStatus: bridgeMocks.getTeachingBridgeStatus,
  requestHint: bridgeMocks.requestHint,
  requestConceptMap: bridgeMocks.requestConceptMap,
  requestNextActivity: bridgeMocks.requestNextActivity,
}));

describe('GravityTeachingBridge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing while the TeachingBridge feature flag is disabled', () => {
    bridgeMocks.getTeachingBridgeStatus.mockReturnValue('disabled');

    const { container } = render(<GravityTeachingBridge />);

    expect(container).toBeEmptyDOMElement();
    expect(bridgeMocks.requestHint).not.toHaveBeenCalled();
  });

  it('renders Sakha enrichment when the bridge is enabled', async () => {
    bridgeMocks.getTeachingBridgeStatus.mockReturnValue('enabled');
    bridgeMocks.requestHint.mockResolvedValue({
      status: 'enabled',
      prompt: 'Drop two safe objects and compare what you observe.',
      traceId: 'trace-1',
      fallback: false,
    });
    bridgeMocks.requestConceptMap.mockResolvedValue({
      status: 'enabled',
      conceptIds: ['gravity', 'mass', 'orbit'],
      prerequisites: ['force', 'motion'],
      traceId: 'trace-1',
      fallback: false,
    });
    bridgeMocks.requestNextActivity.mockResolvedValue({
      status: 'enabled',
      activity: {
        type: 'practice',
        prompt: 'Sketch a gravity well for a heavier star.',
      },
      traceId: 'trace-1',
      fallback: false,
    });

    render(<GravityTeachingBridge />);

    fireEvent.click(screen.getByRole('button', { name: 'Ask Sakha' }));

    expect(await screen.findByText('Drop two safe objects and compare what you observe.')).toBeInTheDocument();
    expect(screen.getByText('Trace: trace-1')).toBeInTheDocument();
    expect(screen.getByText('gravity, mass, orbit')).toBeInTheDocument();
    expect(screen.getByText('force, motion')).toBeInTheDocument();
    expect(screen.getByText('Sketch a gravity well for a heavier star.')).toBeInTheDocument();
  });
});

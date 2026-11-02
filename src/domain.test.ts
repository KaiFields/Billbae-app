import { describe, it, expect } from 'vitest';
import {
  amountError,
  contribute,
  freshState,
  funded,
  reviewApplication,
  type Application,
} from './domain';
import { bills } from './data/demo';
import { parseState } from './services/demoRepository';

describe('simulated funding boundaries', () => {
  it('records a contribution and updates the fictional funding total', () => {
    const state = contribute(freshState(), bills[0], 25);
    expect(state.contributions).toHaveLength(1);
    expect(funded(bills[0], state)).toBe(145);
    expect(freshState().contributions).toHaveLength(0);
  });
  it('rejects overfunding, non-finite values, negative amounts and fractions of a cent', () => {
    for (const amount of [66, 0, -1, NaN, Infinity, 10.001])
      expect(() => contribute(freshState(), bills[0], amount)).toThrow();
  });
  it('permits the last cent and rejects any further funding', () => {
    let state = contribute(freshState(), bills[0], 64.99);
    state = contribute(state, bills[0], 0.01);
    expect(funded(bills[0], state)).toBe(185);
    expect(() => contribute(state, bills[0], 0.01)).toThrow();
    expect(parseState(JSON.stringify(state))).toEqual(state);
  });
  it('validates application amount boundaries', () => {
    expect(amountError(1)).toBe('');
    expect(amountError(10000)).toBe('');
    expect(amountError(0.99)).not.toBe('');
    expect(amountError(10000.01)).not.toBe('');
  });
});

describe('demo review rules', () => {
  const application: Application = {
    id: 'DEMO-TEST',
    category: 'Water',
    amount: 75,
    scenario: 'Between jobs',
    document: true,
    status: 'Submitted',
    flagged: false,
    createdAt: new Date().toISOString(),
  };
  const initial = () => ({ ...freshState(), applications: [{ ...application }] });
  it('blocks a donor from making review changes', () => {
    expect(() =>
      reviewApplication(initial(), 'donor', application.id, 'Demo verified', false),
    ).toThrow('reviewer');
  });
  it('blocks verification while a duplicate flag is unresolved', () => {
    expect(() =>
      reviewApplication(initial(), 'reviewer', application.id, 'Demo verified', true),
    ).toThrow('duplicate');
  });
  it('updates the application and appends a timestamped audit entry', () => {
    const state = reviewApplication(initial(), 'reviewer', application.id, 'Under review', true);
    expect(state.applications[0].status).toBe('Under review');
    expect(state.applications[0].flagged).toBe(true);
    expect(state.audit[0].action).toContain('Submitted → Under review');
    expect(state.audit[0].applicationId).toBe(application.id);
    expect(Number.isFinite(Date.parse(state.audit[0].date))).toBe(true);
  });
});

describe('local persistence input validation', () => {
  it('loads an empty store and round-trips a valid demo', () => {
    expect(parseState(null)).toEqual(freshState());
    const state = contribute(freshState(), bills[0], 10);
    expect(parseState(JSON.stringify(state))).toEqual(state);
  });
  it('rejects malformed JSON, an outdated shape and invalid nested records', () => {
    for (const input of [
      'broken',
      'null',
      '{"version":2}',
      JSON.stringify({ ...freshState(), contributions: [null] }),
      JSON.stringify({ ...freshState(), saved: ['real-user-id'] }),
    ])
      expect(() => parseState(input)).toThrow();
  });
  it('rejects manipulated funding totals on reload', () => {
    const state = contribute(freshState(), bills[0], 25);
    state.contributions[0].amount = 10000;
    expect(() => parseState(JSON.stringify(state))).toThrow('funding');
  });
});

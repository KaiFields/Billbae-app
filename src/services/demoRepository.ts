import { freshState, categories, statuses, amountError, type DemoState } from '../domain';
import { bills } from '../data/demo';
export const STORAGE_KEY = 'billbae-prelaunch-v1';
export interface DemoRepository {
  load(): { state: DemoState; warning?: string };
  save(state: DemoState): string | undefined;
  clear(): void;
}
function validDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}
export function parseState(value: string | null): DemoState {
  if (!value) return freshState();
  const data = JSON.parse(value) as DemoState;
  if (
    !data ||
    data.version !== 1 ||
    !Array.isArray(data.contributions) ||
    !Array.isArray(data.saved) ||
    !Array.isArray(data.applications) ||
    !Array.isArray(data.audit) ||
    typeof data.settings?.updates !== 'boolean' ||
    typeof data.settings?.receipts !== 'boolean'
  )
    throw new Error('Invalid demo state');
  if (
    data.contributions.length > 5000 ||
    data.applications.length > 500 ||
    data.audit.length > 5000
  )
    throw new Error('Demo storage limit reached');
  if (
    !data.contributions.every(
      (c) =>
        c &&
        typeof c.id === 'string' &&
        bills.some((b) => b.id === c.billId) &&
        !amountError(c.amount, 10000, 0.01) &&
        validDate(c.date),
    )
  )
    throw new Error('Invalid contribution');
  if (!data.saved.every((id) => bills.some((b) => b.id === id)))
    throw new Error('Invalid saved request');
  if (
    !data.applications.every(
      (a) =>
        a &&
        typeof a.id === 'string' &&
        categories.includes(a.category) &&
        !amountError(a.amount) &&
        ['Unexpected expense', 'Between jobs', 'Reduced hours'].includes(a.scenario) &&
        typeof a.document === 'boolean' &&
        statuses.includes(a.status) &&
        typeof a.flagged === 'boolean' &&
        validDate(a.createdAt),
    )
  )
    throw new Error('Invalid application');
  if (
    !data.audit.every(
      (a) =>
        a &&
        typeof a.id === 'string' &&
        typeof a.applicationId === 'string' &&
        typeof a.action === 'string' &&
        a.action.length < 300 &&
        validDate(a.date),
    )
  )
    throw new Error('Invalid audit');
  if (
    bills.some(
      (b) =>
        data.contributions.filter((c) => c.billId === b.id).reduce((s, c) => s + c.amount, 0) >
        b.total - b.raised + 0.001,
    )
  )
    throw new Error('Invalid funding total');
  return data;
}
// Future production adapters must use an authenticated API. Browser roles are never authorization.
export const demoRepository: DemoRepository = {
  load() {
    try {
      return { state: parseState(localStorage.getItem(STORAGE_KEY)) };
    } catch {
      return {
        state: freshState(),
        warning:
          'Saved demo activity could not be loaded. A fresh demo is ready; your browser storage may be unavailable or contain an older format.',
      };
    }
  },
  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      return 'Your browser could not save this demo. Activity will last for this visit only.';
    }
  },
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Session state still resets. */
    }
  },
};

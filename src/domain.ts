export type Category = 'Electricity' | 'Water' | 'Phone';
export type ReviewStatus =
  'Submitted' | 'Under review' | 'Changes requested' | 'Demo verified' | 'Declined';
export type Role = 'donor' | 'reviewer';
export interface Bill {
  id: string;
  name: string;
  initials: string;
  category: Category;
  title: string;
  story: string;
  location: string;
  total: number;
  raised: number;
  days: number;
}
export interface Contribution {
  id: string;
  billId: string;
  amount: number;
  date: string;
}
export interface Application {
  id: string;
  category: Category;
  amount: number;
  scenario: string;
  document: boolean;
  status: ReviewStatus;
  flagged: boolean;
  createdAt: string;
}
export interface AuditEntry {
  id: string;
  applicationId: string;
  action: string;
  date: string;
}
export interface DemoState {
  version: 1;
  contributions: Contribution[];
  saved: string[];
  applications: Application[];
  audit: AuditEntry[];
  settings: { updates: boolean; receipts: boolean };
}
export const categories: Category[] = ['Electricity', 'Water', 'Phone'];
export const statuses: ReviewStatus[] = [
  'Submitted',
  'Under review',
  'Changes requested',
  'Demo verified',
  'Declined',
];
export const money = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount % 1 ? 2 : 0,
  }).format(amount);
export const freshState = (): DemoState => ({
  version: 1,
  contributions: [],
  saved: [],
  applications: [],
  audit: [],
  settings: { updates: true, receipts: true },
});
export function amountError(value: number, maximum = 10000, minimum = 1): string {
  if (
    !Number.isFinite(value) ||
    value < minimum ||
    value > maximum ||
    Math.abs(Math.round(value * 100) - value * 100) > 0.00001
  )
    return `Enter an amount from ${money(minimum)} to ${money(maximum)} with up to two decimal places.`;
  return '';
}
export function funded(bill: Bill, state: DemoState) {
  return Math.min(
    bill.total,
    bill.raised +
      state.contributions.filter((c) => c.billId === bill.id).reduce((sum, c) => sum + c.amount, 0),
  );
}
export function contribute(state: DemoState, bill: Bill, amount: number): DemoState {
  const remaining = Math.round((bill.total - funded(bill, state)) * 100) / 100;
  const error = amountError(amount, remaining, 0.01);
  if (error) throw new Error(error);
  return {
    ...state,
    contributions: [
      ...state.contributions,
      { id: crypto.randomUUID(), billId: bill.id, amount, date: new Date().toISOString() },
    ],
  };
}
export function reviewApplication(
  state: DemoState,
  role: Role,
  id: string,
  status: ReviewStatus,
  flagged: boolean,
): DemoState {
  if (role !== 'reviewer')
    throw new Error('Switch to the demo reviewer role to review applications.');
  const application = state.applications.find((a) => a.id === id);
  if (!application || !statuses.includes(status))
    throw new Error('Application or status is invalid.');
  if (flagged && status === 'Demo verified')
    throw new Error('Resolve the sample duplicate flag before demo verification.');
  return {
    ...state,
    applications: state.applications.map((a) => (a.id === id ? { ...a, status, flagged } : a)),
    audit: [
      ...state.audit,
      {
        id: crypto.randomUUID(),
        applicationId: id,
        action: `${application.status} → ${status}; duplicate flag ${flagged ? 'on' : 'off'}`,
        date: new Date().toISOString(),
      },
    ],
  };
}

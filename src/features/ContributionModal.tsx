import { useState, type FormEvent } from 'react';
import { ArrowRight, Heart, LockKeyhole } from 'lucide-react';
import { Modal } from '../components/Modal';
import { amountError, money, type Bill } from '../domain';

export function ContributionModal({
  bill,
  remaining,
  onClose,
  onConfirm,
}: {
  bill: Bill;
  remaining: number;
  onClose(): void;
  onConfirm(amount: number): void;
}) {
  const [amount, setAmount] = useState(String(Math.min(25, remaining)));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    const issue = amountError(n, remaining, 0.01);
    if (issue) {
      setError(issue);
      return;
    }
    setBusy(true);
    try {
      onConfirm(n);
      setSuccess(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={success ? 'Love looks good on you.' : 'Send a little love.'} onClose={onClose}>
      {success ? (
        <div className="contribution-success">
          <span className="feature-icon">
            <Heart size={35} />
          </span>
          <h3>{money(Number(amount))} of simulated kindness.</h3>
          <p>
            Your demo history has been updated. No money was charged or transferred, and no real
            household received funds.
          </p>
          <button className="button primary full" onClick={onClose}>
            Keep exploring <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <p className="muted">
            For {bill.name}’s fictional {bill.category.toLowerCase()} request.
          </p>
          <div className="notice compact">
            <LockKeyhole size={17} />
            Simulation only. No payment information is collected.
          </div>
          <p>
            <strong>{money(remaining)}</strong> remaining in this demo goal
          </p>
          <div className="amount-presets">
            {[5, 10, 25, 50].map((n) => (
              <button
                type="button"
                disabled={n > remaining}
                className={Number(amount) === n ? 'selected' : ''}
                key={n}
                onClick={() => {
                  setAmount(String(n));
                  setError('');
                }}
              >
                {money(n)}
              </button>
            ))}
          </div>
          <label className="field-label" htmlFor="contribution-amount">
            Your demo amount ($)
          </label>
          <input
            id="contribution-amount"
            type="number"
            inputMode="decimal"
            min="0.01"
            max={remaining}
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            aria-invalid={!!error}
            aria-describedby={error ? 'contribution-error' : undefined}
          />
          {error && (
            <p className="error" role="alert" id="contribution-error">
              {error}
            </p>
          )}
          <button className="button primary full" disabled={busy || remaining < 0.01}>
            {busy ? 'Updating demo…' : `Simulate ${money(Number(amount) || 0)} contribution`}
            <Heart size={16} />
          </button>
          <p className="small-note center">No fees. No charge. Fictional impact only.</p>
        </form>
      )}
    </Modal>
  );
}

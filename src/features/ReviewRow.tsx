import { useState } from 'react';
import { Check } from 'lucide-react';
import { money, statuses, type DemoState, type ReviewStatus } from '../domain';

export function ReviewRow({
  application: a,
  onSave,
}: {
  application: DemoState['applications'][number];
  onSave(status: ReviewStatus, flagged: boolean): void;
}) {
  const [status, setStatus] = useState(a.status);
  const [flagged, setFlagged] = useState(a.flagged);
  const blocked = flagged && status === 'Demo verified';
  return (
    <div className="review-row">
      <div>
        <strong>{a.id}</strong>
        <p>
          {a.category} · {money(a.amount)} · {a.scenario}
        </p>
        <small>Fictional document placeholder · Current: {a.status}</small>
      </div>
      <div className="review-controls">
        <label className="field-label">
          Verification status
          <select value={status} onChange={(e) => setStatus(e.target.value as ReviewStatus)}>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="consent-row">
          <input type="checkbox" checked={flagged} onChange={(e) => setFlagged(e.target.checked)} />
          Sample duplicate flag
        </label>
        {blocked && <p className="error">Resolve the flag before demo verification.</p>}
        <button
          className="button secondary"
          disabled={blocked || (status === a.status && flagged === a.flagged)}
          onClick={() => onSave(status, flagged)}
        >
          Save demo review
          <Check size={15} />
        </button>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileCheck2,
  FileText,
  LockKeyhole,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import { amountError, categories, money, type Category, type DemoState } from '../domain';
const dateLabel = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function RequestWorkflow({
  state,
  update,
}: {
  state: DemoState;
  update(state: DemoState): void;
}) {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<Category>('Electricity');
  const [amount, setAmount] = useState('75');
  const [scenario, setScenario] = useState('Unexpected expense');
  const [document, setDocument] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState('');
  const [busy, setBusy] = useState(false);
  const formPanel = useRef<HTMLElement>(null);
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const heading = formPanel.current?.querySelector('h2');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus();
  }, [step, created]);
  const next = () => {
    const issue =
      step === 0
        ? amountError(Number(amount))
        : !document
          ? 'Attach the fictional sample bill to continue.'
          : '';
    if (issue) {
      setError(issue);
      return;
    }
    setError('');
    setStep(step + 1);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('Confirm that this is a fictional demo application.');
      return;
    }
    const issue = amountError(Number(amount));
    if (issue || !document) {
      setError(issue || 'Attach a fictional document first.');
      return;
    }
    setBusy(true);
    const id = `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const date = new Date().toISOString();
    update({
      ...state,
      applications: [
        ...state.applications,
        {
          id,
          category,
          amount: Number(amount),
          scenario,
          document,
          status: 'Submitted',
          flagged: false,
          createdAt: date,
        },
      ],
      audit: [
        ...state.audit,
        {
          id: crypto.randomUUID(),
          applicationId: id,
          action: 'Fictional application created locally',
          date,
        },
      ],
    });
    setCreated(id);
    setBusy(false);
  };
  return (
    <>
      <section ref={formPanel} className="panel application-panel">
        {created ? (
          <div className="empty-state">
            <span className="feature-icon">
              <CheckCircle2 size={30} />
            </span>
            <h2>A little practice, a clearer path.</h2>
            <p>
              Your sample application <strong>{created}</strong> is saved on this browser. It has
              not been submitted to a real service.
            </p>
            <button
              className="button primary"
              onClick={() => {
                setCreated('');
                setStep(0);
                setDocument(false);
                setConsent(false);
              }}
            >
              Try another sample <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <ol className="stepper">
              {['Bill details', 'Sample document', 'Review & confirm'].map((title, i) => (
                <li key={title} className={step === i ? 'current' : step > i ? 'done' : ''}>
                  <span>{step > i ? <Check size={14} /> : i + 1}</span>
                  {title}
                </li>
              ))}
            </ol>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (step === 2) submit(e);
                else next();
              }}
              noValidate
            >
              {step === 0 && (
                <div className="form-step">
                  <h2>Let’s start with the essentials.</h2>
                  <p className="muted">Choose a fictional scenario to explore the process.</p>
                  <label className="field-label" htmlFor="bill-category">
                    Bill category
                  </label>
                  <select
                    id="bill-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <label className="field-label" htmlFor="request-amount">
                    Sample amount needed ($)
                  </label>
                  <input
                    id="request-amount"
                    inputMode="decimal"
                    type="number"
                    min="1"
                    max="10000"
                    step="0.01"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError('');
                    }}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'request-error' : undefined}
                  />
                  <label className="field-label" htmlFor="scenario">
                    Fictional scenario
                  </label>
                  <select
                    id="scenario"
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                  >
                    <option>Unexpected expense</option>
                    <option>Between jobs</option>
                    <option>Reduced hours</option>
                  </select>
                  <div className="small-note">
                    <ShieldCheck size={18} />
                    Personal details and account numbers aren’t needed for this demo.
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="form-step">
                  <h2>A bill, with your privacy in mind.</h2>
                  <p className="muted">
                    Real file uploads are disabled. Use our fictional sample instead.
                  </p>
                  <div className="upload-zone">
                    <span className="feature-icon">
                      <Upload size={25} />
                    </span>
                    <h3>{document ? 'Sample bill attached' : 'Try the document step'}</h3>
                    <p>
                      {document
                        ? 'fictional-utility-bill.pdf · Demo placeholder'
                        : 'No files are read, uploaded, or stored.'}
                    </p>
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => {
                        setDocument(!document);
                        setError('');
                      }}
                    >
                      {document ? 'Remove sample' : 'Attach fictional sample bill'}
                      {document ? <X size={15} /> : <FileText size={15} />}
                    </button>
                  </div>
                  <div className="notice compact">
                    <LockKeyhole size={18} />
                    Future document handling requires private storage, malware scanning, access
                    controls, consent, and a retention policy.
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="form-step">
                  <h2>One more look, with care.</h2>
                  <dl className="review-details">
                    <div>
                      <dt>Bill category</dt>
                      <dd>{category}</dd>
                    </div>
                    <div>
                      <dt>Sample amount</dt>
                      <dd>{money(Number(amount))}</dd>
                    </div>
                    <div>
                      <dt>Fictional scenario</dt>
                      <dd>{scenario}</dd>
                    </div>
                    <div>
                      <dt>Document</dt>
                      <dd>Fictional sample attached</dd>
                    </div>
                  </dl>
                  <label className="consent-row">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        setError('');
                      }}
                    />
                    <span>
                      I understand this is a fictional application stored in this browser. No real
                      assistance is being requested or provided.
                    </span>
                  </label>
                </div>
              )}
              {error && (
                <p className="error" role="alert" id="request-error">
                  {error}
                </p>
              )}
              <div className="form-actions">
                {step > 0 && (
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => {
                      setStep(step - 1);
                      setError('');
                    }}
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                )}
                <button type="submit" className="button primary" disabled={busy}>
                  {busy ? 'Saving demo…' : step === 2 ? 'Save demo application' : 'Continue'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </>
        )}
      </section>
      <section className="panel tracking-panel">
        <h2>Your sample applications</h2>
        <p className="muted">
          Local status tracking. A demo review never creates a public request or provider payment.
        </p>
        {state.applications.length ? (
          state.applications
            .slice()
            .reverse()
            .map((a) => (
              <div className="tracking-row" key={a.id}>
                <span className="feature-icon small">
                  <FileCheck2 size={20} />
                </span>
                <div>
                  <strong>
                    {a.category} · {money(a.amount)}
                  </strong>
                  <small>
                    {a.id} · {dateLabel(a.createdAt)}
                  </small>
                </div>
                <span className="pill">{a.status}</span>
              </div>
            ))
        ) : (
          <p>No sample applications yet. Your first one will appear here.</p>
        )}
      </section>
    </>
  );
}

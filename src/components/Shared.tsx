import { ArrowRight, Heart } from 'lucide-react';

export function PageIntro({
  kicker,
  title,
  text,
}: {
  kicker: string;
  title: string;
  text: string;
}) {
  return (
    <div className="page-intro">
      <span className="section-kicker">{kicker}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}
export function Empty({
  icon: Icon,
  title,
  text,
  action,
  onAction,
}: {
  icon: typeof Heart;
  title: string;
  text: string;
  action?: string;
  onAction?(): void;
}) {
  return (
    <div className="empty-state">
      <span className="feature-icon">
        <Icon size={27} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action && (
        <button className="button primary" onClick={onAction}>
          {action}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
export function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Heart;
}) {
  return (
    <section className="stat-card">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>Demo activity only</small>
      </div>
      <span className="feature-icon">
        <Icon size={23} />
      </span>
    </section>
  );
}

import { Bookmark, MapPin, Zap, Droplets, Smartphone, ArrowUpRight } from 'lucide-react';
import type { Bill } from '../domain';
import { money } from '../domain';
export const categoryIcon = { Electricity: Zap, Water: Droplets, Phone: Smartphone };
export function BillCard({
  bill,
  raised,
  saved,
  onSave,
  onHelp,
}: {
  bill: Bill;
  raised: number;
  saved: boolean;
  onSave(): void;
  onHelp(): void;
}) {
  const Icon = categoryIcon[bill.category];
  const percent = Math.round((raised / bill.total) * 100);
  return (
    <article className={`bill-card ${bill.category.toLowerCase()}`}>
      <div className="card-art">
        <span className="category-tag">
          <Icon size={13} />
          {bill.category}
        </span>
        <button
          className={`save-button ${saved ? 'saved' : ''}`}
          onClick={onSave}
          aria-label={`${saved ? 'Unsave' : 'Save'} ${bill.name}'s request`}
          aria-pressed={saved}
        >
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <div className="art-orbit" />
        <div className="art-icon">
          <Icon size={44} strokeWidth={1.4} />
        </div>
        <span className="art-spark spark-one">✦</span>
        <span className="art-spark spark-two">✧</span>
        <span className="art-caption">a little kindness changes everything</span>
      </div>
      <div className="card-content">
        <div className="requester">
          <span className="avatar">{bill.initials}</span>
          <span>
            <strong>{bill.name}</strong>
            <span className="location">
              <MapPin size={11} />
              {bill.location}
            </span>
          </span>
          <span className="sample-label">FICTIONAL</span>
        </div>
        <h3>{bill.title}</h3>
        <p>{bill.story}</p>
        <div className="funding-label">
          <span>
            <strong>{money(raised)}</strong> <span>of {money(bill.total)}</span>
          </span>
          <strong>{percent}%</strong>
        </div>
        <progress value={raised} max={bill.total} aria-label={`${bill.name} simulated funding`} />
        <div className="funding-meta">
          <span>{money(bill.total - raised)} to go</span>
          <span>Sample due in {bill.days} days</span>
        </div>
        <button className="button card-cta" onClick={onHelp} disabled={raised >= bill.total}>
          {raised >= bill.total ? 'Demo goal reached' : 'Send a little love'}
          <ArrowUpRight size={17} />
        </button>
      </div>
    </article>
  );
}

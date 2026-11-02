import {
  ArrowUpRight,
  ChevronRight,
  FileCheck2,
  Heart,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { PageIntro } from '../components/Shared';

export function TrustPage({ onTour }: { onTour(): void }) {
  return (
    <>
      <PageIntro
        kicker="KINDNESS NEEDS A STRONG FOUNDATION"
        title="Trust is part of the love."
        text="BillBae’s vision is simple: connect generosity with essential bills, while protecting the dignity and privacy of the people behind them."
      />
      <div className="notice">
        <ShieldCheck />
        BillBae is in prelaunch development. We are not accepting donations, processing payments,
        collecting real applications, or providing financial assistance.
      </div>
      <div className="trust-grid">
        {[
          {
            icon: LockKeyhole,
            title: 'Privacy comes first',
            text: 'This demo asks for no contact details, identity documents, or account numbers. Activity is stored only in this browser. There are no analytics, advertising trackers, or email subscriptions in the app.',
          },
          {
            icon: FileCheck2,
            title: 'Verification, with care',
            text: 'All people and requests here are fictional. Demo verification is a local workflow label. Before launch, real bill ownership, eligibility, duplicate detection, human review, and appeals need secure systems and tested processes.',
          },
          {
            icon: Heart,
            title: 'A direct path to essentials',
            text: 'The future goal is to pay approved bills directly to service providers. No payment integration exists in this demo. Provider validation, reconciliation, and refund handling must be built and tested first.',
          },
          {
            icon: Users,
            title: 'Consent and control',
            text: 'Sample applications use preset scenarios only. You can clear local activity in Settings. Future applicants need clear consent, limited data collection, retention and deletion choices, and a transparent review process.',
          },
        ].map(({ icon: Icon, title, text }) => (
          <section className="panel trust-card" key={title}>
            <span className="feature-icon">
              <Icon size={25} />
            </span>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </div>
      <section className="panel">
        <div className="section-heading compact">
          <div>
            <h2>Before we can serve real people</h2>
            <p>Our launch requirements, openly stated.</p>
          </div>
          <span className="pill">In development</span>
        </div>
        <ul className="launch-list">
          {[
            'Secure authentication, MFA for administrators, and server-enforced access roles',
            'Encrypted private document storage, consent, retention, and deletion workflows',
            'Document and provider verification, fraud controls, appeals, and protected audit trails',
            'Payment-provider integration, direct-to-provider settlement, reconciliation, and refunds',
            'Security and accessibility testing, independent review, legal and compliance review, and operational readiness',
          ].map((item) => (
            <li key={item}>
              <span className="check-circle" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="kindness-banner">
        <span className="banner-icon">
          <Sparkles size={24} />
        </span>
        <div>
          <h3>Founded by Kai Fields.</h3>
          <p>
            A vision from Soft But Savage Lounge LLC. Built with compassion. Designed for dignity.
          </p>
        </div>
        <button className="button secondary" onClick={onTour}>
          Explore the process
          <ChevronRight size={16} />
        </button>
      </section>
      <p className="trust-links">
        <a href="https://billbae.b12sites.com/" target="_blank" rel="noreferrer">
          Existing BillBae website
          <ArrowUpRight size={14} />
        </a>
        <a href="https://github.com/KaiFields/Billbae-app" target="_blank" rel="noreferrer">
          Project source
          <ArrowUpRight size={14} />
        </a>
      </p>
    </>
  );
}

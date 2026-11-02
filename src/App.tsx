import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Bookmark,
  Check,
  CheckCircle2,
  Compass,
  FileCheck2,
  Heart,
  LayoutDashboard,
  LayoutGrid,
  LockKeyhole,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { PageIntro, Empty, Stat } from './components/Shared';
import { ContributionModal } from './features/ContributionModal';
import { RequestWorkflow } from './features/RequestWorkflow';
import { ReviewRow } from './features/ReviewRow';
import { TrustPage } from './features/TrustPage';
import { Brand } from './components/Brand';
import { BillCard, categoryIcon } from './components/BillCard';
import { Modal } from './components/Modal';
import { bills } from './data/demo';
import {
  categories,
  contribute,
  freshState,
  funded,
  money,
  reviewApplication,
  type Bill,
  type Category,
  type DemoState,
  type Role,
} from './domain';
import { demoRepository } from './services/demoRepository';

type Page =
  'discover' | 'dashboard' | 'saved' | 'request' | 'trust' | 'settings' | 'admin' | 'welcome';
const pageTitles: Record<Page, string> = {
  discover: 'Discover bills',
  dashboard: 'My impact',
  saved: 'Saved requests',
  request: 'Request assistance',
  trust: 'Trust & transparency',
  settings: 'Account settings',
  admin: 'Admin preview',
  welcome: 'Welcome to BillBae',
};
const validPage = (): Page => {
  const hash = location.hash.slice(1);
  return Object.hasOwn(pageTitles, hash) ? (hash as Page) : 'discover';
};
const dateLabel = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function App() {
  const [loaded] = useState(() => demoRepository.load());
  const [state, setState] = useState(loaded.state);
  const [warning, setWarning] = useState(loaded.warning || '');
  const [page, setPage] = useState<Page>(validPage);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [view, setView] = useState<'grid' | 'swipe'>('grid');
  const [index, setIndex] = useState(0);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [toast, setToast] = useState('');
  const [role, setRole] = useState<Role>('donor');
  const [resetOpen, setResetOpen] = useState(false);
  const [tour, setTour] = useState(false);
  const main = useRef<HTMLElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const navigate = (next: Page) => {
    location.hash = next;
    setPage(next);
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => main.current?.focus());
  };
  useEffect(() => {
    const onHash = () => {
      setPage(validPage());
      setMobileOpen(false);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    document.title = `${pageTitles[page]} | BillBae prelaunch`;
  }, [page]);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 701px)');
    const closeAtDesktop = () => {
      if (media.matches) setMobileOpen(false);
    };
    media.addEventListener('change', closeAtDesktop);
    return () => media.removeEventListener('change', closeAtDesktop);
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const panel = navigation.current;
    const controls = panel?.querySelectorAll<HTMLButtonElement>('button');
    controls?.[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        requestAnimationFrame(() => menuButton.current?.focus());
      }
      if (event.key === 'Tab' && controls?.length) {
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);
  const update = (next: DemoState) => {
    setState(next);
    setWarning(demoRepository.save(next) || '');
  };
  const saveBill = (bill: Bill) => {
    const exists = state.saved.includes(bill.id);
    update({
      ...state,
      saved: exists ? state.saved.filter((id) => id !== bill.id) : [...state.saved, bill.id],
    });
    setToast(exists ? 'Request removed from your saved list.' : 'A little love, saved for later.');
  };
  const filtered = bills
    .filter(
      (b) =>
        (category === 'All' || b.category === category) &&
        `${b.title} ${b.name} ${b.location} ${b.category}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === 'soonest'
        ? a.days - b.days
        : sort === 'closest'
          ? a.total - funded(a, state) - (b.total - funded(b, state))
          : 0,
    );
  const currentBill = filtered[index % Math.max(filtered.length, 1)];
  const nextCard = () => setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
  const total = state.contributions.reduce((s, c) => s + c.amount, 0);
  const touched = new Set(state.contributions.map((c) => c.billId)).size;
  const navItems = [
    { key: 'discover', title: 'Discover bills', icon: Compass },
    { key: 'dashboard', title: 'My impact', icon: LayoutDashboard },
    { key: 'saved', title: 'Saved requests', icon: Bookmark },
    { key: 'request', title: 'Request assistance', icon: Heart },
  ] as const;
  const renderCard = (bill: Bill) => (
    <BillCard
      key={bill.id}
      bill={bill}
      raised={funded(bill, state)}
      saved={state.saved.includes(bill.id)}
      onSave={() => saveBill(bill)}
      onHelp={() => setSelectedBill(bill)}
    />
  );

  return (
    <div className="app-shell">
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      {mobileOpen && (
        <button
          className="nav-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        ref={navigation}
        className={`sidebar ${mobileOpen ? 'open' : ''}`}
        aria-label="Main navigation"
        role={mobileOpen ? 'dialog' : undefined}
        aria-modal={mobileOpen || undefined}
      >
        <button
          className="nav-close icon-button"
          aria-label="Close navigation"
          onClick={() => {
            setMobileOpen(false);
            requestAnimationFrame(() => menuButton.current?.focus());
          }}
        >
          <X size={19} />
        </button>
        <button
          className="brand-button"
          onClick={() => navigate('welcome')}
          aria-label="BillBae home"
        >
          <Brand />
        </button>
        <p className="sidebar-tagline">Good people. Real possibilities.</p>
        <div className="workspace-label">YOUR LITTLE CORNER OF GOOD</div>
        <nav>
          {navItems.map(({ key, title, icon: Icon }) => (
            <button
              key={key}
              className={`nav-item ${page === key ? 'active' : ''}`}
              aria-current={page === key ? 'page' : undefined}
              onClick={() => navigate(key)}
            >
              <Icon size={19} />
              <span>{title}</span>
              {key === 'saved' && state.saved.length > 0 && (
                <span className="nav-count">{state.saved.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-mission">
          <div className="mission-hearts">
            <Heart size={24} />
            <Sparkles size={15} />
          </div>
          <h3>
            A little love.
            <br />A lighter load.
          </h3>
          <p>Because everyone deserves a little breathing room.</p>
          <button onClick={() => navigate('trust')}>
            Meet the mission <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="sidebar-bottom">
          <button
            className={`nav-item ${page === 'trust' ? 'active' : ''}`}
            onClick={() => navigate('trust')}
          >
            <ShieldCheck size={18} />
            Trust & transparency
          </button>
          <button
            className={`nav-item ${page === 'settings' ? 'active' : ''}`}
            onClick={() => navigate('settings')}
          >
            <Settings size={18} />
            Settings
          </button>
          <button
            className={`nav-item ${page === 'admin' ? 'active' : ''}`}
            onClick={() => navigate('admin')}
          >
            <LockKeyhole size={18} />
            Admin preview
          </button>
          <div className="sidebar-profile">
            <span className="profile-avatar">Y</span>
            <span>
              <strong>Your demo space</strong>
              <small>No account needed</small>
            </span>
            <span className="status-dot" />
          </div>
        </div>
      </aside>
      <div className="main-shell" inert={mobileOpen}>
        <header className="topbar">
          <div className="topbar-title">
            <button
              className="icon-button mobile-menu"
              ref={menuButton}
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu />
            </button>
            <span>{pageTitles[page]}</span>
            <span className="breadcrumb-dot">/</span>
            <span className="topbar-subtitle">A little good starts here</span>
          </div>
          <div className="topbar-actions">
            <span className="demo-badge">
              <span />
              PRELAUNCH DEMO
            </span>
            <button
              className="profile-avatar"
              aria-label="Open account settings"
              onClick={() => navigate('settings')}
            >
              Y
            </button>
          </div>
        </header>
        <div className="prelaunch-notice">
          <ShieldCheck size={15} />
          <span>
            You’re exploring our prelaunch demo. All requests are fictional. No real donations,
            payments, or assistance.
          </span>
          <button onClick={() => navigate('trust')}>
            Learn more <ArrowUpRight size={13} />
          </button>
        </div>
        <main id="main-content" ref={main} tabIndex={-1}>
          {warning && (
            <div className="notice warning" role="alert">
              {warning}
              <button
                className="icon-button"
                aria-label="Dismiss storage notice"
                onClick={() => setWarning('')}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {page === 'discover' && (
            <>
              <section className="hero">
                <div className="hero-copy">
                  <span className="eyebrow">
                    <span /> KINDNESS LOOKS GOOD ON YOU
                  </span>
                  <h1>
                    Swipe right.
                    <br />
                    Make someone’s
                    <br />
                    <em>day a little lighter.</em>
                  </h1>
                  <p>
                    A small act of love can help with life’s essentials.
                    <br className="desktop-break" /> Find a bill. Feel a connection. Explore what’s
                    possible.
                  </p>
                  <button
                    className="button hero-button"
                    onClick={() => {
                      document
                        .getElementById('browse-heading')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      document.getElementById('browse-heading')?.focus();
                    }}
                  >
                    Find your connection <ArrowRight size={17} />
                  </button>
                  <span className="hero-footnote">Swipe Right. Pay a Bill. Change a Life.</span>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="orbit orbit-a" />
                  <div className="orbit orbit-b" />
                  <span className="hero-star star-a">✦</span>
                  <span className="hero-star star-b">✧</span>
                  <div className="floating-note note-a">
                    <span className="note-icon">
                      <Heart size={17} fill="currentColor" />
                    </span>
                    A little love goes far.
                  </div>
                  <div className="love-card">
                    <span className="love-card-logo">
                      <Brand compact />
                      <span>
                        Made for moments
                        <br />
                        that matter.
                      </span>
                    </span>
                    <div className="love-heart">
                      <Heart size={94} fill="currentColor" strokeWidth={0.8} />
                      <Sparkles size={25} />
                    </div>
                    <span className="love-card-bottom">
                      ONE BILL. ONE BREATH OF RELIEF.<span>♡</span>
                    </span>
                  </div>
                  <div className="floating-note note-b">
                    <span className="note-check">
                      <Check size={15} />
                    </span>
                    More kindness. Less worry.
                  </div>
                </div>
              </section>
              <div className="principles">
                <span>
                  <Heart size={17} />
                  Small acts. Meaningful possibilities.
                </span>
                <span>
                  <ShieldCheck size={17} />
                  Dignity at every step.
                </span>
                <span>
                  <LockKeyhole size={17} />
                  Privacy comes first.
                </span>
              </div>
              <section className="browse-section">
                <div className="section-heading">
                  <div>
                    <span className="section-kicker">FIND YOUR CONNECTION</span>
                    <h2 id="browse-heading" tabIndex={-1}>
                      Behind every bill is a story<span>.</span>
                    </h2>
                    <p>Explore a few ways a little kindness could make a difference.</p>
                  </div>
                  <button className="text-button" onClick={() => setTour(true)}>
                    How it works <ArrowUpRight size={15} />
                  </button>
                </div>
                <div className="browse-controls">
                  <div className="category-tabs" aria-label="Filter by bill category">
                    {(['All', ...categories] as const).map((c) => {
                      const Icon = c === 'All' ? LayoutGrid : categoryIcon[c];
                      return (
                        <button
                          className={category === c ? 'selected' : ''}
                          aria-pressed={category === c}
                          key={c}
                          onClick={() => {
                            setCategory(c);
                            setIndex(0);
                          }}
                        >
                          <Icon size={15} />
                          {c === 'All' ? 'All bills' : c}
                        </button>
                      );
                    })}
                  </div>
                  <label className="search-field">
                    <Search size={16} />
                    <input
                      type="search"
                      aria-label="Search fictional requests"
                      placeholder="Find a story…"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setIndex(0);
                      }}
                    />
                  </label>
                </div>
                <div className="results-bar">
                  <span>
                    {filtered.length} fictional requests{' '}
                    <span className="results-description">· A preview of what’s possible</span>
                  </span>
                  <div className="results-actions">
                    <label className="sort-label">
                      <SlidersHorizontal size={14} />
                      <select
                        aria-label="Sort requests"
                        value={sort}
                        onChange={(e) => {
                          setSort(e.target.value);
                          setIndex(0);
                        }}
                      >
                        <option value="featured">Featured</option>
                        <option value="soonest">Due soonest</option>
                        <option value="closest">Closest to goal</option>
                      </select>
                    </label>
                    <div className="view-toggle">
                      <button
                        aria-label="Grid view"
                        aria-pressed={view === 'grid'}
                        onClick={() => setView('grid')}
                        className={view === 'grid' ? 'selected' : ''}
                      >
                        <LayoutGrid size={16} />
                      </button>
                      <button
                        aria-label="Swipe view"
                        aria-pressed={view === 'swipe'}
                        onClick={() => setView('swipe')}
                        className={view === 'swipe' ? 'selected' : ''}
                      >
                        <Heart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                {!filtered.length ? (
                  <Empty
                    icon={Search}
                    title="No stories found"
                    text="Try a different search or choose another bill category."
                    action="Clear filters"
                    onAction={() => {
                      setCategory('All');
                      setSearch('');
                    }}
                  />
                ) : view === 'grid' ? (
                  <div className="bill-grid">{filtered.map(renderCard)}</div>
                ) : (
                  <div className="swipe-area">
                    <div
                      className="swipe-card"
                      tabIndex={0}
                      aria-label="Swipe card. Left arrow passes; right arrow opens a contribution preview."
                      onKeyDown={(e) => {
                        if (e.target !== e.currentTarget) return;
                        if (e.key === 'ArrowLeft') {
                          e.preventDefault();
                          nextCard();
                        }
                        if (e.key === 'ArrowRight') {
                          e.preventDefault();
                          setSelectedBill(currentBill);
                        }
                      }}
                      onTouchStart={(e) => {
                        swipeStart.current = {
                          x: e.changedTouches[0].clientX,
                          y: e.changedTouches[0].clientY,
                        };
                      }}
                      onTouchEnd={(e) => {
                        const start = swipeStart.current;
                        swipeStart.current = null;
                        if (!start || (e.target as HTMLElement).closest('button')) return;
                        const dx = e.changedTouches[0].clientX - start.x;
                        const dy = e.changedTouches[0].clientY - start.y;
                        if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy)) return;
                        if (dx < 0) nextCard();
                        else setSelectedBill(currentBill);
                      }}
                    >
                      {renderCard(currentBill)}
                    </div>
                    <div className="swipe-actions">
                      <button className="button secondary" onClick={nextCard}>
                        <ArrowLeft size={16} />
                        Pass for now
                      </button>
                      <span>
                        {(index % filtered.length) + 1} / {filtered.length}
                      </span>
                      <button
                        className="button primary"
                        disabled={funded(currentBill, state) >= currentBill.total}
                        onClick={() => setSelectedBill(currentBill)}
                      >
                        Simulate helping
                        <Heart size={16} />
                      </button>
                    </div>
                    <p className="muted center">
                      Swipe left to pass, right to explore helping. Buttons work too.
                    </p>
                  </div>
                )}
              </section>
              <section className="kindness-banner">
                <span className="banner-icon">
                  <Heart size={25} />
                </span>
                <div>
                  <h3>Need a little breathing room?</h3>
                  <p>See how requesting support could work. You deserve kindness, too.</p>
                </div>
                <button className="button secondary" onClick={() => navigate('request')}>
                  Explore assistance <ArrowUpRight size={16} />
                </button>
              </section>
            </>
          )}
          {page === 'welcome' && (
            <>
              <PageIntro
                kicker="SOFT HEART. REAL PURPOSE."
                title="Welcome to a kinder kind of connection."
                text="BillBae is an early-stage vision from Kai Fields and Soft But Savage Lounge LLC. Together, we’re imagining a little more breathing room for everyday life."
              />
              <div className="pathway-grid">
                <section className="panel pathway">
                  <span className="feature-icon">
                    <Heart />
                  </span>
                  <h2>I want to help.</h2>
                  <p>
                    Explore fictional stories, save a request, and see how a simulated contribution
                    could feel.
                  </p>
                  <button className="button primary" onClick={() => navigate('discover')}>
                    Explore giving <ArrowRight size={16} />
                  </button>
                </section>
                <section className="panel pathway">
                  <span className="feature-icon">
                    <Users />
                  </span>
                  <h2>I could use some help.</h2>
                  <p>
                    Walk through a sample application using preset fictional details. Nothing is
                    sent to a real review team.
                  </p>
                  <button className="button primary" onClick={() => navigate('request')}>
                    Explore assistance <ArrowRight size={16} />
                  </button>
                </section>
              </div>
              <div className="notice">
                <ShieldCheck />
                This is a prelaunch demonstration. BillBae is not accepting donations or real
                assistance applications, processing payments, or providing financial assistance.
              </div>
            </>
          )}
          {page === 'dashboard' && (
            <>
              <PageIntro
                kicker="YOUR KINDNESS, AT A GLANCE"
                title="Little acts. A lovely ripple."
                text="Your simulated activity lives here. Every number on this page is demo activity, not real financial impact."
              />
              <div className="stats-grid">
                <Stat label="Simulated contributions" value={money(total)} icon={Heart} />
                <Stat label="Fictional requests supported" value={String(touched)} icon={Users} />
                <Stat
                  label="Saved for a little later"
                  value={String(state.saved.length)}
                  icon={Bookmark}
                />
              </div>
              <div className="dashboard-grid">
                <section className="panel">
                  <h2>Your giving story</h2>
                  <p className="muted">Simulated contribution history</p>
                  {!state.contributions.length ? (
                    <Empty
                      icon={Heart}
                      title="Your story starts with a little love."
                      text="Try a simulated contribution to see your activity here."
                      action="Discover bills"
                      onAction={() => navigate('discover')}
                    />
                  ) : (
                    <div className="activity-list">
                      {state.contributions
                        .slice()
                        .reverse()
                        .map((c) => {
                          const b = bills.find((b) => b.id === c.billId)!;
                          const Icon = categoryIcon[b.category];
                          return (
                            <div className="activity-row" key={c.id}>
                              <span className="feature-icon small">
                                <Icon size={18} />
                              </span>
                              <span>
                                <strong>
                                  {b.name} · {b.category}
                                </strong>
                                <small>{dateLabel(c.date)} · Simulated</small>
                              </span>
                              <strong>{money(c.amount)}</strong>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </section>
                <section className="panel">
                  <h2>Where your love goes</h2>
                  <p className="muted">Your simulated giving by essential</p>
                  {categories.map((c) => {
                    const categoryTotal = state.contributions
                      .filter((item) => bills.find((b) => b.id === item.billId)?.category === c)
                      .reduce((s, item) => s + item.amount, 0);
                    const Icon = categoryIcon[c];
                    return (
                      <div className="impact-category" key={c}>
                        <div>
                          <span>
                            <Icon size={16} />
                            {c}
                          </span>
                          <strong>{money(categoryTotal)}</strong>
                        </div>
                        <progress
                          value={categoryTotal}
                          max={total || 1}
                          aria-label={`${c} share of simulated giving`}
                        />
                      </div>
                    );
                  })}
                  <div className="small-note">
                    <LockKeyhole size={16} />
                    No money has moved. No tax receipts are generated.
                  </div>
                </section>
              </div>
            </>
          )}
          {page === 'saved' && (
            <>
              <PageIntro
                kicker="KEEP A LITTLE LOVE CLOSE"
                title="A story worth coming back to."
                text="Your bookmarked fictional requests. Saved on this browser, ready when you are."
              />
              {state.saved.length ? (
                <div className="bill-grid">
                  {bills.filter((b) => state.saved.includes(b.id)).map(renderCard)}
                </div>
              ) : (
                <Empty
                  icon={Bookmark}
                  title="A little space for your favorites."
                  text="Tap the bookmark on any fictional request to keep it here."
                  action="Find a connection"
                  onAction={() => navigate('discover')}
                />
              )}
            </>
          )}
          {page === 'request' && (
            <>
              <PageIntro
                kicker="YOU DESERVE BREATHING ROOM"
                title="It’s okay to need a little help."
                text="Explore a guided sample application. Use fictional presets only; no names, account numbers, or actual documents are collected."
              />
              <RequestWorkflow state={state} update={update} />
            </>
          )}
          {page === 'trust' && <TrustPage onTour={() => setTour(true)} />}
          {page === 'settings' && (
            <>
              <PageIntro
                kicker="YOUR SPACE, YOUR CHOICES"
                title="Make yourself at home."
                text="These are local demo preferences. There is no live account, mailing list, or notification service."
              />
              <section className="panel settings-panel">
                <div className="account-card">
                  <span className="profile-avatar large">Y</span>
                  <div>
                    <h2>Your demo profile</h2>
                    <p>No email, password, or personal details needed.</p>
                  </div>
                  <span className="pill">Guest demo</span>
                </div>
                <h3>Notification preferences</h3>
                {(
                  [
                    {
                      key: 'updates',
                      title: 'Request updates',
                      text: 'Preview a preference for status changes on saved requests.',
                    },
                    {
                      key: 'receipts',
                      title: 'Contribution summaries',
                      text: 'Preview a preference for simulated giving summaries.',
                    },
                  ] as const
                ).map((item) => (
                  <label className="setting-row" key={item.key}>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.text}</small>
                    </span>
                    <input
                      type="checkbox"
                      role="switch"
                      checked={state.settings[item.key]}
                      onChange={(e) =>
                        update({
                          ...state,
                          settings: { ...state.settings, [item.key]: e.target.checked },
                        })
                      }
                    />
                  </label>
                ))}
                <div className="settings-reset">
                  <div>
                    <h3>Start fresh</h3>
                    <p>
                      Clear demo contributions, saved requests, applications, and preferences on
                      this device.
                    </p>
                  </div>
                  <button className="button secondary" onClick={() => setResetOpen(true)}>
                    Reset demo activity
                  </button>
                </div>
              </section>
            </>
          )}
          {page === 'admin' && (
            <>
              <PageIntro
                kicker="FOUNDER WORKSPACE · DEMO ONLY"
                title="Care, with a clear process."
                text="Explore application review with fictional data. This browser role switch is a workflow demonstration, not secure authentication or production authorization."
              />
              <div className="notice">
                <LockKeyhole size={19} />
                Real administrator access requires server-enforced roles, MFA, and protected audit
                storage before launch.
              </div>
              <section className="panel">
                <div className="section-heading compact">
                  <div>
                    <h2>Application review</h2>
                    <p>{state.applications.length} local demo applications</p>
                  </div>
                  <label className="inline-label">
                    Demo role
                    <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                      <option value="donor">Donor (read-only)</option>
                      <option value="reviewer">Reviewer (simulated)</option>
                    </select>
                  </label>
                </div>
                {role === 'donor' ? (
                  <Empty
                    icon={LockKeyhole}
                    title="Reviewer preview is locked."
                    text="Choose the simulated reviewer role above to explore the local review queue."
                  />
                ) : !state.applications.length ? (
                  <Empty
                    icon={FileCheck2}
                    title="Your demo queue is clear."
                    text="Create a sample assistance application to try the review workflow."
                    action="Create sample application"
                    onAction={() => navigate('request')}
                  />
                ) : (
                  state.applications.map((a) => (
                    <ReviewRow
                      key={a.id}
                      application={a}
                      onSave={(status, flagged) => {
                        try {
                          update(reviewApplication(state, role, a.id, status, flagged));
                          setToast('Demo review saved. Audit history updated.');
                        } catch (e) {
                          setToast((e as Error).message);
                        }
                      }}
                    />
                  ))
                )}
              </section>
              {role === 'reviewer' && (
                <section className="panel audit-panel">
                  <h2>Local audit history</h2>
                  <p className="muted">
                    Preview only. This history can be modified or cleared in the browser.
                  </p>
                  {state.audit.length ? (
                    state.audit
                      .slice()
                      .reverse()
                      .map((a) => (
                        <div className="audit-row" key={a.id}>
                          <span className="status-dot" />
                          <div>
                            <strong>{a.applicationId}</strong>
                            <p>{a.action}</p>
                            <small>{new Date(a.date).toLocaleString('en-US')}</small>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p>No demo review actions yet.</p>
                  )}
                </section>
              )}
            </>
          )}
        </main>
        <footer className="footer">
          <span>© {new Date().getFullYear()} BillBae · Soft But Savage Lounge LLC</span>
          <div>
            <span className="footer-heart">♡</span>
            <span>Built with compassion. Designed for dignity.</span>
            <button onClick={() => navigate('trust')}>Privacy & trust</button>
          </div>
        </footer>
      </div>
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="toast">
            <CheckCircle2 size={19} />
            {toast}
          </div>
        )}
      </div>
      {selectedBill && (
        <ContributionModal
          bill={selectedBill}
          remaining={Math.round((selectedBill.total - funded(selectedBill, state)) * 100) / 100}
          onClose={() => setSelectedBill(null)}
          onConfirm={(amount) => {
            update(contribute(state, selectedBill, amount));
            setToast(`You simulated ${money(amount)} of kindness. No money was charged.`);
          }}
        />
      )}
      {tour && (
        <Modal title="A little love, step by step." onClose={() => setTour(false)}>
          <p className="muted">A preview of the BillBae experience.</p>
          <ol className="how-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Find a connection</h3>
                <p>
                  Browse fictional requests for electricity, water, and essential phone service.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Explore a little kindness</h3>
                <p>Save a story or try a simulated contribution. No payment details are needed.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>See the possibilities</h3>
                <p>
                  Visit My impact to see your local demo history. Real verification and provider
                  payments are future work.
                </p>
              </div>
            </li>
          </ol>
          <button className="button primary full" onClick={() => setTour(false)}>
            Let’s explore <ArrowRight size={16} />
          </button>
        </Modal>
      )}
      {resetOpen && (
        <Modal title="A fresh start?" onClose={() => setResetOpen(false)}>
          <p>
            This clears all BillBae demo activity and preferences in this browser. It cannot be
            undone.
          </p>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setResetOpen(false)}>
              Keep my activity
            </button>
            <button
              className="button primary"
              onClick={() => {
                demoRepository.clear();
                update(freshState());
                setRole('donor');
                setResetOpen(false);
                setToast('Your demo is ready for a fresh start.');
              }}
            >
              Reset demo
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

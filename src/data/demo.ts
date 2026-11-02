import type { Bill } from '../domain';
// Fictional scenarios only. Never import these fixtures into a production repository adapter.
export const bills: Bill[] = [
  {
    id: 'demo-electric-1',
    name: 'Maya R.',
    initials: 'MR',
    category: 'Electricity',
    title: 'A little light goes a long way.',
    story:
      'An unexpected car repair stretched this fictional household’s budget. A little support would help keep their home bright this month.',
    location: 'Atlanta, GA',
    total: 185,
    raised: 120,
    days: 4,
  },
  {
    id: 'demo-water-1',
    name: 'Jordan T.',
    initials: 'JT',
    category: 'Water',
    title: 'Keep the everyday flowing.',
    story:
      'Between shifts and a new job, this fictional parent is catching up on an essential water bill. Every small act makes a difference.',
    location: 'Memphis, TN',
    total: 120,
    raised: 45,
    days: 6,
  },
  {
    id: 'demo-phone-1',
    name: 'Alex M.',
    initials: 'AM',
    category: 'Phone',
    title: 'A connection to a fresh start.',
    story:
      'A reliable phone means job callbacks and staying close to loved ones. Help this fictional neighbor stay connected during a transition.',
    location: 'Houston, TX',
    total: 85,
    raised: 50,
    days: 3,
  },
  {
    id: 'demo-electric-2',
    name: 'Taylor B.',
    initials: 'TB',
    category: 'Electricity',
    title: 'Make room for a softer month.',
    story:
      'A temporary reduction in work hours left a gap in this fictional household’s budget. Community kindness can help bridge it.',
    location: 'Birmingham, AL',
    total: 240,
    raised: 80,
    days: 8,
  },
  {
    id: 'demo-water-2',
    name: 'Riley J.',
    initials: 'RJ',
    category: 'Water',
    title: 'Small kindness. Essential comfort.',
    story:
      'This fictional caregiver is balancing household expenses after an unexpected repair. Help ease one essential bill.',
    location: 'Jackson, MS',
    total: 95,
    raised: 70,
    days: 2,
  },
  {
    id: 'demo-phone-2',
    name: 'Morgan L.',
    initials: 'ML',
    category: 'Phone',
    title: 'Keep a new chapter connected.',
    story:
      'Starting a new role comes with a wait for the first paycheck. This fictional request is for a month of essential phone service.',
    location: 'Charlotte, NC',
    total: 65,
    raised: 20,
    days: 7,
  },
];

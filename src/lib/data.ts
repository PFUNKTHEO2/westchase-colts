export interface PlayerCard {
  id: string;
  name: string;
  number: string;
  position: string;
  grade?: string;
  front: string;
  back: string;
  highlight?: string;
}

export interface TeamConfig {
  name: string;
  mascot: string;
  season: string;
  sport: string;
  tagline: string;
  fundraisingGoal: number;
  currentAmount: number;
}

export const teamConfig: TeamConfig = {
  name: "Westchase Colts",
  mascot: "Colts",
  season: "Fall 2026",
  sport: "Football & Cheer",
  tagline: "Pop Warner Football & Cheer — 200+ Colts Families Strong Since 2001",
  fundraisingGoal: 50000,
  currentAmount: 12500,
};

export const playerCards: PlayerCard[] = [
  {
    id: "1",
    name: "Jaylen Carter",
    number: "7",
    position: "Quarterback",
    grade: "12U",
    front: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "Friday night dreams start here",
  },
  {
    id: "2",
    name: "Mia Rodriguez",
    number: "3",
    position: "Flyer",
    grade: "10U Cheer",
    front: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "Fearless at the top of the pyramid",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    number: "24",
    position: "Running Back",
    grade: "10U",
    front: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "Never caught from behind",
  },
  {
    id: "4",
    name: "Ethan Nguyen",
    number: "55",
    position: "Linebacker",
    grade: "14U",
    front: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "Heart of the defense",
  },
  {
    id: "5",
    name: "Isabella Ramirez",
    number: "12",
    position: "Base",
    grade: "8U Cheer",
    front: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "The squad stands on her shoulders",
  },
  {
    id: "6",
    name: "Tyler Chen",
    number: "88",
    position: "Wide Receiver",
    grade: "12U",
    front: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "Hands like glue",
  },
  {
    id: "7",
    name: "Ava Thompson",
    number: "2",
    position: "Safety",
    grade: "8U",
    front: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "First one to every ball",
  },
  {
    id: "8",
    name: "Diego Lopez",
    number: "62",
    position: "Offensive Line",
    grade: "14U",
    front: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "Captain and leader",
  },
];

// Real Westchase Colts sponsors (from westchasecolts.com) shown as examples
export const sponsors = [
  { name: "Tech Sherpas", tier: "Gold" },
  { name: "Prosperity WA", tier: "Gold" },
  { name: "BTP Sports Media", tier: "Silver" },
  { name: "Westchase Pizza Co.", tier: "Silver" },
  { name: "Racetrack Road Dental", tier: "Bronze" },
  { name: "Ed Radice Concessions", tier: "Bronze" },
];

export const milestones = [
  { amount: 10000, label: "New game helmets and shoulder pads for every division", reached: true },
  { amount: 20000, label: "Cheer mats, uniforms, and competition entry fees", reached: false },
  { amount: 30000, label: "Field and lighting improvements at Ed Radice", reached: false },
  { amount: 40000, label: "Scholarship fund so every kid can play", reached: false },
  { amount: 50000, label: "Pop Warner Nationals travel fund", reached: false },
];

export const leaderboard = [
  { name: "Colts Booster Club", amount: 3400, rank: 1 },
  { name: "Carter Family", amount: 2200, rank: 2 },
  { name: "Westchase Rotary Club", amount: 1800, rank: 3 },
  { name: "Coach Williams", amount: 1300, rank: 4 },
  { name: "Colts Alumni Network", amount: 950, rank: 5 },
];

export const stats = {
  totalRaised: 12500,
  supporters: 214,
  cardsSold: 342,
  daysLeft: 58,
};

export const titleSponsor = {
  name: "Tech Sherpas",
  slug: "tech-sherpas",
  website: "https://www.techsherpas.com/",
  auctionFloor: 50,
  athleteShare: 25,
  developmentShare: 75,
  cardsForPrize: 1000,
  cardsSold: 247,
  prizeDescription: "Free IT Career Bootcamp Scholarship for a Colts Family",
};

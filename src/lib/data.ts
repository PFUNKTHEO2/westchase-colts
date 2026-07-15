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
  name: "PAYSL / Pflugerville FC",
  mascot: "PFC",
  season: "Spring 2026",
  sport: "Soccer",
  tagline: "Making Soccer Accessible to All — 12,000 Athletes Strong",
  fundraisingGoal: 75000,
  currentAmount: 18750,
};

export const playerCards: PlayerCard[] = [
  {
    id: "1",
    name: "Sofia Martinez",
    number: "10",
    position: "Forward",
    grade: "U-14",
    front: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "32 Goals This Season",
  },
  {
    id: "2",
    name: "Ethan Nguyen",
    number: "7",
    position: "Midfielder",
    grade: "U-12",
    front: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "Playmaker Award",
  },
  {
    id: "3",
    name: "Chloe Davis",
    number: "1",
    position: "Goalkeeper",
    grade: "U-16",
    front: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "12 Clean Sheets",
  },
  {
    id: "4",
    name: "Marcus Johnson",
    number: "9",
    position: "Forward",
    grade: "U-14",
    front: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "Hat-Trick Hero",
  },
  {
    id: "5",
    name: "Isabella Ramirez",
    number: "4",
    position: "Defender",
    grade: "U-10",
    front: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "Iron Wall Defense",
  },
  {
    id: "6",
    name: "Tyler Chen",
    number: "8",
    position: "Midfielder",
    grade: "U-12",
    front: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "Most Assists",
  },
  {
    id: "7",
    name: "Ava Thompson",
    number: "11",
    position: "Forward",
    grade: "U-8",
    front: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "Rising Star",
  },
  {
    id: "8",
    name: "Diego Lopez",
    number: "5",
    position: "Defender",
    grade: "U-16",
    front: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=560&fit=crop",
    back: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=560&fit=crop",
    highlight: "Captain & Leader",
  },
];

export const sponsors = [
  { name: "Champion Austin", tier: "Gold" },
  { name: "PUMA", tier: "Gold" },
  { name: "Dick's Sporting Goods", tier: "Silver" },
  { name: "Kwik Goal", tier: "Silver" },
  { name: "SoccerZone USA", tier: "Bronze" },
  { name: "Acurix Sports", tier: "Bronze" },
  { name: "Next College Student Athlete", tier: "Bronze" },
];

export const milestones = [
  { amount: 15000, label: "New Training Equipment for all age groups", reached: true },
  { amount: 30000, label: "Field Improvement Fund (Heatherwilde Complex)", reached: false },
  { amount: 45000, label: "Travel Fund for Select Teams (STXCL)", reached: false },
  { amount: 60000, label: "Scholarship Fund (Financial Aid expansion)", reached: false },
  { amount: 75000, label: "New Goalkeeper Academy & Coaching Development", reached: false },
];

export const leaderboard = [
  { name: "PFC Booster Club", amount: 4200, rank: 1 },
  { name: "Martinez Family", amount: 2800, rank: 2 },
  { name: "Pflugerville Rotary Club", amount: 2100, rank: 3 },
  { name: "Coach Rodriguez", amount: 1600, rank: 4 },
  { name: "PAYSL Alumni Network", amount: 1200, rank: 5 },
];

export const stats = {
  totalRaised: 18750,
  supporters: 312,
  cardsSold: 485,
  daysLeft: 42,
};

export const titleSponsor = {
  name: "Sing Orthodontics",
  slug: "sing-orthodontics",
  website: "https://www.singortho.com/",
  auctionFloor: 50,
  athleteShare: 25,
  developmentShare: 75,
  cardsForPrize: 1000,
  cardsSold: 247,
  prizeDescription: "Free Orthodontic Consultation + $500 Treatment Credit",
};

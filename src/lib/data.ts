import coltsGraphicJace from "@/assets/colts-graphic-jace.jpg";
import coltsHeroTeam from "@/assets/colts-hero-team.jpg";
import coltsPlayer6 from "@/assets/colts-player-6.jpg";
import coltsActionCelebrate from "@/assets/colts-action-celebrate.jpg";
import coltsBeAColt from "@/assets/colts-be-a-colt.jpg";

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
  currentAmount: 0,
};

export const playerCards: PlayerCard[] = [
  {
    id: "champ13u",
    name: "13U Colts",
    number: "25",
    position: "Championship Edition",
    grade: "Commemorative",
    front: coltsHeroTeam,
    back: coltsBeAColt,
    highlight: "The championship run, on a card",
  },
  {
    id: "1",
    name: "Jace Vorlicky",
    number: "8",
    position: "Quarterback",
    grade: "13U",
    front: coltsGraphicJace,
    back: coltsBeAColt,
    highlight: "Speed. Focus. Relentless.",
  },
  {
    id: "2",
    name: "Colts #6",
    number: "6",
    position: "Cornerback",
    grade: "10U",
    front: coltsPlayer6,
    back: coltsBeAColt,
    highlight: "The future is bright",
  },
  {
    id: "3",
    name: "Game Day",
    number: "18",
    position: "Wide Receiver",
    grade: "8U",
    front: coltsActionCelebrate,
    back: coltsBeAColt,
    highlight: "Touchdown celebration season",
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

// `reached` is computed live from the mint feed — nothing is pre-checked
export const milestones = [
  { amount: 10000, label: "New game helmets and shoulder pads for every division" },
  { amount: 20000, label: "Cheer mats, uniforms, and competition entry fees" },
  { amount: 30000, label: "Field and lighting improvements at Ed Radice" },
  { amount: 40000, label: "Scholarship fund so every kid can play" },
  { amount: 50000, label: "Pop Warner Nationals travel fund" },
];

export const titleSponsor = {
  name: "Tech Sherpas",
  slug: "tech-sherpas",
  website: "https://www.techsherpas.com/",
  auctionFloor: 50,
  athleteShare: 25,
  developmentShare: 75,
  cardsForPrize: 1000,
  prizeDescription: "Free IT Career Bootcamp Scholarship for a Colts Family",
};

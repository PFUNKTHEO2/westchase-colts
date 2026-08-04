import cardTemplateAthlete from "@/assets/card-template-athlete.png";
import backAthlete from "@/assets/card-backs/back-athlete.jpg";
import backProdigychain from "@/assets/card-backs/back-prodigychain.jpg";
import backFriendship from "@/assets/card-backs/back-friendship.jpg";
import backLeague from "@/assets/card-backs/back-league.jpg";
import backTeam from "@/assets/card-backs/back-team.jpg";
import cardTemplateProdigychain from "@/assets/card-template-prodigychain-new.png";
import cardTemplateFriendship from "@/assets/card-template-friendship.png";
import cardTemplateLeague from "@/assets/card-template-league.png";
import cardTemplateTeam from "@/assets/card-template-team.png";

export interface CardTemplate {
  id: string;
  label: string;
  background: string;
  frame: string;
  backFrame: string;
}

/**
 * The same 5 canonical ProdigyChain card templates used everywhere else on
 * the platform (prodigy-rankings/src/lib/cardTemplates.ts) — ported here so
 * club microsites render the real chassis instead of a lookalike. Keep this
 * list in sync with that file; do not invent a 6th club-only template
 * (David's rule: stick to the 5 until there's real new frame artwork).
 */
export const CARD_TEMPLATES: CardTemplate[] = [
  { id: "athlete", label: "Athlete", background: "linear-gradient(135deg, #ADB2CC 0%, #E6EAFF 100%)", frame: cardTemplateAthlete, backFrame: backAthlete },
  { id: "prodigychain", label: "Prodigychain", background: "linear-gradient(135deg, #9A4DFF 0%, #00AAFF 100%)", frame: cardTemplateProdigychain, backFrame: backProdigychain },
  { id: "friendship", label: "Friendship", background: "linear-gradient(135deg, #FF4DC3 0%, #FF80FF 100%)", frame: cardTemplateFriendship, backFrame: backFriendship },
  { id: "league", label: "League", background: "linear-gradient(135deg, #E55817 0%, #FFD91A 100%)", frame: cardTemplateLeague, backFrame: backLeague },
  { id: "team", label: "Team", background: "linear-gradient(135deg, #00E599 0%, #11CC00 100%)", frame: cardTemplateTeam, backFrame: backTeam },
];

export const getTemplate = (id?: string): CardTemplate =>
  CARD_TEMPLATES.find((t) => t.id === id) ?? CARD_TEMPLATES[1]; // default: prodigychain (closest to Colts blue)

/**
 * The one curated showcase card every visitor sees — a real Colts photo
 * (10U line at Ed Radice, from westchasecolts.com) in the ProdigyCard frame.
 * Family-created cards join it in the gallery; this one anchors the shelf.
 */
import coltsTenULine from "@/assets/colts-10u-line.jpg";
import type { PhotoTransform } from "@/components/print/PrintCardFront";

export interface FeaturedCard {
  id: string;
  playerName: string;
  jerseyNumber: string;
  position: string;
  program: "Football" | "Cheer";
  division: string;
  blurb: string;
  photo: string;
  photoTransform: PhotoTransform;
  /** country name key into @/utils/countryFlags COUNTRY_ISO_CODES; missing = "USA" */
  nationality?: string;
  /** one of the 5 canonical CARD_TEMPLATES ids; missing = "prodigychain" */
  templateId?: string;
}

export const featuredCards: FeaturedCard[] = [
  {
    id: "featured-10u-line",
    playerName: "10U Colts",
    jerseyNumber: "5",
    position: "Offensive Line",
    program: "Football",
    division: "10U",
    blurb:
      "The 10U line gets set at Ed Radice. One team, one family, one goal. This is where Colts are made.",
    photo: coltsTenULine,
    photoTransform: { x: 0, y: 0, scale: 1.1 , rotate: 0 },
  },
];

export function findFeaturedCard(id: string): FeaturedCard | undefined {
  return featuredCards.find((c) => c.id === id);
}

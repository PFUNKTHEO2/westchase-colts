export interface Team {
  id: string;
  ageGroup: string;
  gender: "Football" | "Cheer";
  teamPhoto: string;
  players: TeamPlayer[];
}

export interface TeamPlayer {
  id: string;
  name: string;
  number: string;
  position: string;
  born: string;
  photo: string;
  /** Family-written story for the card back (replaces stats). */
  blurb?: string;
  /** crop the family chose in the editor; lets the celebration card match */
  photoTransform?: { x: number; y: number; scale: number };
}

const footballPositions = [
  "Quarterback",
  "Running Back",
  "Running Back",
  "Wide Receiver",
  "Wide Receiver",
  "Tight End",
  "Offensive Line",
  "Offensive Line",
  "Defensive Line",
  "Defensive Line",
  "Linebacker",
  "Linebacker",
  "Cornerback",
  "Safety",
  "Kicker",
];

const cheerPositions = [
  "Flyer",
  "Flyer",
  "Base",
  "Base",
  "Base",
  "Base",
  "Backspot",
  "Backspot",
  "Tumbler",
  "Tumbler",
  "Dancer",
  "Dancer",
];

import teamSilhouette from "@/assets/team-silhouette.png";

// No photo until a family uploads one — CardFrame renders the position
// silhouette in the octagon window (the hotlinked generic avatar was the
// "error" David flagged on player profiles).
const playerPhoto = "";

// Pop Warner divisions the Colts field (football + cheer squads)
const ageGroups = ["6U", "7U", "8U", "9U", "10U", "12U", "14U"];
const programs: ("Football" | "Cheer")[] = ["Football", "Cheer"];

function generateBornYear(ageGroup: string): string {
  const ageNum = parseInt(ageGroup.replace("U", ""));
  const birthYear = 2026 - ageNum + Math.floor(Math.random() * 2);
  return String(birthYear);
}

function generatePlayers(teamId: string, ageGroup: string, program: "Football" | "Cheer"): TeamPlayer[] {
  const positions = program === "Football" ? footballPositions : cheerPositions;
  return positions.map((pos, i) => ({
    id: `${teamId}-p${i + 1}`,
    name: "Name LastName",
    number: String(i + 1),
    position: pos,
    born: generateBornYear(ageGroup),
    photo: playerPhoto,
  }));
}

export const teams: Team[] = ageGroups.flatMap((ag) =>
  programs.map((program) => {
    const id = `${ag.toLowerCase()}-${program.toLowerCase()}`;
    return {
      id,
      ageGroup: ag,
      gender: program,
      teamPhoto: teamSilhouette,
      players: generatePlayers(id, ag, program),
    };
  })
);

export const ageGroupList = ageGroups;

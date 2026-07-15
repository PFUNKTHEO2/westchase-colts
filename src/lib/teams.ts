export interface Team {
  id: string;
  ageGroup: string;
  gender: "Boys" | "Girls";
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
}

const positions = [
  "Goalkeeper",
  "Defender",
  "Defender",
  "Defender",
  "Defender",
  "Midfielder",
  "Midfielder",
  "Midfielder",
  "Midfielder",
  "Midfielder",
  "Forward",
  "Forward",
  "Forward",
  "Forward",
  "Forward",
];

import teamSilhouette from "@/assets/team-silhouette.png";

const teamPhotos: Record<string, string> = {
  "boys": teamSilhouette,
  "girls": teamSilhouette,
};

const ageGroups = ["U6", "U7", "U8", "U9", "U10", "U11", "U12", "U13", "U14", "U15", "U16", "U17", "U18", "U19"];
const genders: ("Boys" | "Girls")[] = ["Boys", "Girls"];

// Single silhouette placeholder for all players
const playerPhoto = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/512px-Windows_10_Default_Profile_Picture.svg.png";

function generateBornYear(ageGroup: string): string {
  const ageNum = parseInt(ageGroup.replace("U", ""));
  const birthYear = 2026 - ageNum + Math.floor(Math.random() * 2);
  return String(birthYear);
}

function generatePlayers(teamId: string, ageGroup: string): TeamPlayer[] {
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
  genders.map((gender) => {
    const id = `${ag.toLowerCase()}-${gender.toLowerCase()}`;
    return {
      id,
      ageGroup: ag,
      gender,
      teamPhoto: teamPhotos[gender.toLowerCase()],
      players: generatePlayers(id, ag),
    };
  })
);

export const ageGroupList = ageGroups;

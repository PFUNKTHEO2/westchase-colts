import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PlayerDetailModal } from "@/components/PlayerDetailModal";
import { teams, ageGroupList, type Team, type TeamPlayer } from "@/lib/teams";
import { teamConfig } from "@/lib/data";

const Roster = () => {
  const [selectedAge, setSelectedAge] = useState<string>("all");
  // Program filter. The PAYSL remix shipped "Boys"/"Girls" buttons, but Colts
  // teams carry gender: "Football" | "Cheer" — the comparison never matched, so
  // the filter silently did nothing (David 2026-07-16). Pop Warner's split IS
  // the program split, so filter on that and label it accordingly.
  const [selectedGender, setSelectedGender] = useState<"all" | "Football" | "Cheer">("all");
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<TeamPlayer | null>(null);
  const [selectedPlayerTeam, setSelectedPlayerTeam] = useState<Team | null>(null);

  const filteredTeams = teams.filter((t) => {
    if (selectedAge !== "all" && t.ageGroup !== selectedAge) return false;
    if (selectedGender !== "all" && t.gender !== selectedGender) return false;
    return true;
  });

  return (
    <>
      <Helmet>
        <title>{teamConfig.name} - Full Roster</title>
        <meta
          name="description"
          content={`Browse the complete ${teamConfig.name} roster across ${teams.length} teams from U6 to U19.`}
        />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Link to="/">
                <Button variant="ghost" className="gap-2 mb-6 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h1 className="section-heading">
                    <span className="text-gradient">{teamConfig.name}</span> Rosters
                  </h1>
                  <p className="text-muted-foreground">
                    {teams.length} Teams • U6–U19 • {teamConfig.season} {teamConfig.sport} Season
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {/* Program filter (Football = boys program, Cheer = girls program) */}
              <div className="flex rounded-lg overflow-hidden border border-border">
                {(["all", "Football", "Cheer"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      selectedGender === g
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {g === "all" ? "All" : g === "Football" ? "Football (Boys)" : "Cheer (Girls)"}
                  </button>
                ))}
              </div>

              {/* Age group filter */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedAge("all")}
                  className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    selectedAge === "all"
                      ? "bg-accent text-accent-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  All Ages
                </button>
                {ageGroupList.map((ag) => (
                  <button
                    key={ag}
                    onClick={() => setSelectedAge(ag)}
                    className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      selectedAge === ag
                        ? "bg-accent text-accent-foreground"
                        : "bg-card text-muted-foreground hover:text-foreground border border-border"
                    }`}
                  >
                    {ag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Teams list */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredTeams.map((team, idx) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    index={idx}
                    expanded={expandedTeam === team.id}
                    onToggle={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                    onPlayerClick={(player) => {
                      setSelectedPlayer(player);
                      setSelectedPlayerTeam(team);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>

            {filteredTeams.length === 0 && (
              <p className="text-center text-muted-foreground py-20">No teams match the selected filters.</p>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Player detail modal */}
      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          team={selectedPlayerTeam}
          onClose={() => {
            setSelectedPlayer(null);
            setSelectedPlayerTeam(null);
          }}
        />
      )}
    </>
  );
};

function TeamCard({
  team,
  index,
  expanded,
  onToggle,
  onPlayerClick,
}: {
  team: Team;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onPlayerClick: (player: TeamPlayer) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      className="rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Team header - clickable */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-primary/5 transition-colors"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <span className="font-display font-bold text-primary text-sm sm:text-base">{team.ageGroup}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-foreground text-base sm:text-lg">
            {team.ageGroup} {team.gender}
          </h3>
          <p className="text-sm text-muted-foreground">{team.players.length} Players</p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            team.gender === "Boys"
              ? "bg-primary/20 text-primary"
              : "bg-accent/20 text-accent"
          }`}
        >
          {team.gender}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5 space-y-5">
              {/* Team Photo */}
              <div className="relative rounded-lg overflow-hidden aspect-[2/1]">
                <img
                  src={team.teamPhoto}
                  alt={`${team.ageGroup} ${team.gender} team photo`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="font-display font-bold text-xl text-foreground">
                    {team.ageGroup} {team.gender}
                  </span>
                </div>
              </div>

              {/* Player roster table */}
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-12">#</th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Player</th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.players.map((player, i) => (
                      <tr
                        key={player.id}
                        onClick={() => onPlayerClick(player)}
                        className={`border-t border-border/50 cursor-pointer hover:bg-primary/10 transition-colors ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                      >
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">{player.number}</td>
                        <td className="px-4 py-2.5 text-foreground">{player.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{player.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Roster;

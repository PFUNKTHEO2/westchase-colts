import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trophy, Medal, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMintFeed } from "@/lib/mints";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-400" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-300" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-600" />;
    default:
      return <Award className="w-5 h-5 text-muted-foreground" />;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border-yellow-400/30";
    case 2:
      return "bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-300/30";
    case 3:
      return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30";
    default:
      return "bg-card border-border/30";
  }
};

export function Leaderboard() {
  // live: top cards by dollars raised for the club (privacy-safe names)
  const feed = useMintFeed();
  const top = (feed?.players ?? []).slice(0, 5).map((p, i) => ({
    name: `${p.name} · ${p.teamLabel}`,
    amount: p.raised,
    sold: p.sold,
    rank: i + 1,
  }));

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/50 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-heading mb-4">
            Top <span className="text-gradient-gold">Cards</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {top.length > 0
              ? "The cards raising the most for the Colts this season."
              : "The season leaderboard starts empty. The first card sold takes the top spot."}
          </p>
        </motion.div>

        {top.length === 0 && (
          <div className="text-center">
            <Button asChild size="lg" className="btn-primary-glow bg-primary hover:bg-primary/90">
              <Link to="/create-card">Put your Colt on the board</Link>
            </Button>
          </div>
        )}

        <div className="max-w-2xl mx-auto space-y-4">
          {top.map((supporter, index) => (
            <motion.div
              key={supporter.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(
                supporter.rank
              )} ${supporter.rank <= 3 ? "card-glow" : ""}`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background/50">
                {getRankIcon(supporter.rank)}
              </div>

              {/* Name */}
              <div className="flex-1">
                <h3
                  className={`font-bold ${
                    supporter.rank === 1
                      ? "text-lg text-yellow-400"
                      : supporter.rank <= 3
                      ? "text-foreground"
                      : "text-foreground"
                  }`}
                >
                  {supporter.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {supporter.sold} {supporter.sold === 1 ? "card" : "cards"} sold · raised for the Colts
                </p>
              </div>

              {/* Amount */}
              <div className="text-right">
                <span
                  className={`font-display font-bold text-xl ${
                    supporter.rank === 1
                      ? "text-yellow-400"
                      : supporter.rank === 2
                      ? "text-gray-300"
                      : supporter.rank === 3
                      ? "text-amber-600"
                      : "text-gradient"
                  }`}
                >
                  ${supporter.amount.toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

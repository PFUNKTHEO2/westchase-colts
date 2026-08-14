import { motion } from "framer-motion";
import { teamConfig, primarySport } from "@/lib/data";
import { SportProgressTrack } from "@/components/SportProgressTrack";

export function SponsorBanner() {
  const progress = (teamConfig.currentAmount / teamConfig.fundraisingGoal) * 100;
  const sport = primarySport(teamConfig.sport);

  return (
    <section className="py-12 bg-gradient-to-r from-secondary via-card to-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
            <span className="text-gradient-gold">Fundraising Progress</span>
          </h2>
          <p className="text-muted-foreground">Help us reach our goal!</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <SportProgressTrack
            sport={sport}
            pct={progress}
            goalLabel={`$${teamConfig.fundraisingGoal.toLocaleString()} goal`}
          />

          {/* Amount Display */}
          <div className="flex items-center justify-between text-lg mt-4">
            <div>
              <span className="text-2xl md:text-3xl font-display font-bold text-gradient">
                ${teamConfig.currentAmount.toLocaleString()}
              </span>
              <span className="text-muted-foreground ml-2">raised</span>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground mr-2">of</span>
              <span className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">
                ${teamConfig.fundraisingGoal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

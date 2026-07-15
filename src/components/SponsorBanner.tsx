import { motion } from "framer-motion";
import { teamConfig } from "@/lib/data";

export function SponsorBanner() {
  const progress = (teamConfig.currentAmount / teamConfig.fundraisingGoal) * 100;

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
          {/* Progress Bar Container */}
          <div className="relative mb-4">
            <div className="h-6 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full progress-fill"
              />
            </div>
            {/* Progress Percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
            >
              <span className="font-display font-bold text-sm text-foreground drop-shadow-lg">
                {progress.toFixed(0)}%
              </span>
            </motion.div>
          </div>

          {/* Amount Display */}
          <div className="flex items-center justify-between text-lg">
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

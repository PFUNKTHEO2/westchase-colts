import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { milestones } from "@/lib/data";
import { useMintFeed } from "@/lib/mints";

export function Milestones() {
  // reached/next computed from live dollars raised — nothing pre-checked
  const raised = useMintFeed()?.raised ?? 0;
  const withStatus = milestones.map((m) => ({ ...m, reached: raised >= m.amount }));
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading mb-4">
            <span className="text-gradient-gold">Milestones</span> & Goals
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every milestone unlocks new possibilities for our team. Help us reach the next goal!
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Vertical Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-muted" />

            {withStatus.map((milestone, index) => {
              const isNext =
                !milestone.reached &&
                (index === 0 || withStatus[index - 1].reached);

              return (
                <motion.div
                  key={milestone.amount}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex items-start gap-6 pb-10 last:pb-0"
                >
                  {/* Status Icon */}
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      milestone.reached
                        ? "bg-accent text-accent-foreground"
                        : isNext
                        ? "bg-primary text-primary-foreground animate-glow-pulse"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {milestone.reached ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 p-4 rounded-xl ${
                      milestone.reached
                        ? "bg-card/80 border border-accent/30"
                        : isNext
                        ? "bg-card card-glow border border-primary/30"
                        : "bg-muted/30 border border-border/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-display font-bold text-xl ${
                          milestone.reached
                            ? "text-gradient-gold"
                            : isNext
                            ? "text-gradient"
                            : "text-muted-foreground"
                        }`}
                      >
                        ${milestone.amount.toLocaleString()}
                      </span>
                      {milestone.reached && (
                        <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-medium">
                          Reached!
                        </span>
                      )}
                      {isNext && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium animate-pulse">
                          Next Goal
                        </span>
                      )}
                    </div>
                    <p
                      className={`${
                        milestone.reached || isNext
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {milestone.label}
                    </p>

                    {/* Progress for next milestone */}
                    {isNext && (
                      <div className="mt-4">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{
                              width: `${Math.min(100, (raised / milestone.amount) * 100)}%`,
                            }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          ${Math.max(0, milestone.amount - raised).toLocaleString()} to go
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

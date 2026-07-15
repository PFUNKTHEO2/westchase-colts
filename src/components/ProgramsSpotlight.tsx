import { motion } from "framer-motion";
import { Users, Star, Trophy, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import programsHero from "@/assets/pfc-programs-hero.jpeg";

const programs = [
  {
    icon: Users,
    title: "PAYSL Recreational League",
    description: "Fun, inclusive soccer for all ages and skill levels. Over 8,000 athletes per season.",
    color: "primary" as const,
  },
  {
    icon: Star,
    title: "PFC Jr Academy",
    description: "Developmental program bridging recreational play to competitive soccer. Ages 5-10.",
    color: "accent" as const,
  },
  {
    icon: Trophy,
    title: "PFC Select (Competitive)",
    description: "Elite competitive teams competing in STXCL and regional tournaments across Texas.",
    color: "primary" as const,
  },
  {
    icon: Shield,
    title: "Goalkeeper Academy",
    description: "Specialized training for keepers of all levels with dedicated coaching staff.",
    color: "accent" as const,
  },
];

export function ProgramsSpotlight() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
      {/* Background photo overlay */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url(${programsHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-heading mb-4">
            Programs That <span className="text-gradient-gold">Benefit</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your support directly funds these PAYSL programs serving the Pflugerville community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full card-glow border-border/50">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                      program.color === "primary" ? "bg-primary/20" : "bg-accent/20"
                    }`}
                  >
                    <program.icon
                      className={`w-7 h-7 ${
                        program.color === "primary" ? "text-primary" : "text-accent"
                      }`}
                    />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2 text-foreground">
                    {program.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {program.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

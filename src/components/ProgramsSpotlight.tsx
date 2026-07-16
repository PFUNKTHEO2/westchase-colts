import { motion } from "framer-motion";
import { Users, Star, Trophy, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import programsHero from "@/assets/pfc-programs-hero.jpeg";

const programs = [
  {
    icon: Shield,
    title: "Tackle Football (6U-14U)",
    description: "Pop Warner tackle football for every age. Real coaching, real fundamentals, Saturday game days at Ed Radice.",
    color: "primary" as const,
  },
  {
    icon: Star,
    title: "Colts Cheer",
    description: "Sideline and competition cheer squads that carry Colts spirit from August through Nationals season.",
    color: "accent" as const,
  },
  {
    icon: Users,
    title: "Scholarship Fund",
    description: "No Colt sits out over money. Registration and equipment assistance for families that need it.",
    color: "primary" as const,
  },
  {
    icon: Trophy,
    title: "Playoff & Travel Fund",
    description: "When our teams punch through to regionals and Pop Warner Nationals, the whole squad travels.",
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
            Your support directly funds these Colts programs serving the Westchase community.
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

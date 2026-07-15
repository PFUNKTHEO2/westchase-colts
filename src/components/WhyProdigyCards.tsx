import { motion } from "framer-motion";
import { Zap, Eye, Heart, BarChart3 } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "More Engaging Than a Bake Sale",
    description: "Kids love seeing themselves on a real trading card. Parents love sharing them.",
  },
  {
    icon: Eye,
    title: "Transparent Fundraising",
    description: "Every dollar is tracked. See exactly where funds go — no black boxes.",
  },
  {
    icon: Heart,
    title: "Every Athlete Benefits",
    description: "Not just star players. Every rostered athlete gets their own ProdigyCard.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Progress",
    description: "Watch the fundraising meter grow in real time as the community rallies together.",
  },
];

export function WhyProdigyCards() {
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
            Why <span className="text-gradient">ProdigyCards</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ProdigyCards turn every athlete into a collectible. Parents, grandparents, and fans can 
            support their player directly while funding the entire program. It's more engaging than a 
            bake sale and more transparent than a GoFundMe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-card/80 border border-border/50 card-glow text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <reason.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-foreground">{reason.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { CreditCard, Share2, Heart } from "lucide-react";

const steps = [
  {
    icon: CreditCard,
    title: "Choose Your Cards",
    description: "Create your own Colt's card or collect cards from teams across the program.",
  },
  {
    icon: Share2,
    title: "Share & Rally",
    description: "Share your favorite player cards with family, friends, and the Colts community.",
  },
  {
    icon: Heart,
    title: "Fund the Program",
    description: "Every card directly funds Colts football and cheer: equipment, fields, travel, and scholarships.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Supporting your Colts has never been easier. Follow these simple steps to make a difference.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-accent/50" />
              )}

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 md:-left-4 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <span className="font-display font-bold text-sm text-accent-foreground">
                    {index + 1}
                  </span>
                </div>

                {/* Icon Container */}
                <div className="w-24 h-24 rounded-2xl bg-card card-glow flex items-center justify-center mb-6">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display font-bold text-xl mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

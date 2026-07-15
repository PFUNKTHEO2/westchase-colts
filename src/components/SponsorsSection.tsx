import { motion } from "framer-motion";
import { sponsors } from "@/lib/data";

const getTierStyle = (tier: string) => {
  switch (tier) {
    case "Gold":
      return "border-yellow-400/50 bg-gradient-to-b from-yellow-400/10 to-transparent";
    case "Silver":
      return "border-gray-300/50 bg-gradient-to-b from-gray-300/10 to-transparent";
    case "Bronze":
      return "border-amber-600/50 bg-gradient-to-b from-amber-600/10 to-transparent";
    default:
      return "border-border";
  }
};

export function SponsorsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-heading mb-4">
            Our <span className="text-gradient">Sponsors</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Thank you to these amazing partners for supporting PAYSL athletes!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`p-6 rounded-xl border-2 ${getTierStyle(
                sponsor.tier
              )} flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300`}
            >
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mb-3">
                <span className="font-display font-bold text-lg text-foreground">
                  {sponsor.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-medium text-sm text-foreground mb-1">{sponsor.name}</h3>
              <span
                className={`text-xs font-medium ${
                  sponsor.tier === "Gold"
                    ? "text-yellow-400"
                    : sponsor.tier === "Silver"
                    ? "text-gray-300"
                    : "text-amber-600"
                }`}
              >
                {sponsor.tier} Sponsor
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

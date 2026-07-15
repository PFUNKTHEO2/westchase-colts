import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlayerCard } from "@/components/PlayerCard";
import { playerCards } from "@/lib/data";

export function FeaturedCards() {
  const featuredPlayers = playerCards.slice(0, 4);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-heading mb-4">
            <span className="text-gradient">Featured</span> ProdigyCards
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Collect exclusive digital trading cards of your favorite PAYSL athletes. Each card features
            stunning 3D design and interactive viewing.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredPlayers.map((player, index) => (
            <PlayerCard key={player.id} player={player} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/roster">
            <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 btn-gold">
              View All Athletes
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

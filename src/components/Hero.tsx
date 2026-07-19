import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { teamConfig } from "@/lib/data";
import { useMintFeed } from "@/lib/mints";
import coltsLogo from "@/assets/westchase-colts-logo.png";
import heroBackground from "@/assets/colts-hero-team.jpg";

function money(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${Math.round(n)}`;
}

export function Hero() {
  // live numbers from Stripe via /api/mints — zeros are real zeros
  const feed = useMintFeed();
  const statItems = [
    { icon: Trophy, value: money(feed?.raised ?? 0), label: "Raised" },
    { icon: Users, value: String(feed?.supporters ?? 0), label: "Supporters" },
    { icon: Target, value: String(feed?.count ?? 0), label: "Cards Sold" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBackground})`,
        }}
      />

      {/* Gradient Overlay */}
      <div className="hero-overlay absolute inset-0" />

      {/* Animated Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <img src={coltsLogo} alt="Westchase Colts" className="h-24 md:h-28 w-auto drop-shadow-[0_0_25px_hsl(var(--primary)/0.6)]" />
          </div>

          {/* Champions badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-3">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">4x Pop Warner National Champions — 2017, 2021, 2024</span>
          </div>
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-sm font-medium text-foreground">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              {teamConfig.season} Season Fundraiser
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="section-heading text-4xl md:text-6xl lg:text-7xl mb-4">
            Support Your
            <br />
            <span className="text-gradient">Westchase Colts</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {teamConfig.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/create-card">
              <Button size="lg" className="btn-primary-glow gap-2 text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                Create Your Colt's Card
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/roster">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-accent/50 text-accent hover:bg-accent/10">
                Browse Player Cards
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto"
          >
            {statItems.map((stat, index) => (
              <div
                key={stat.label}
                className="flex flex-col items-center p-4 rounded-xl glass"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-accent mb-2" />
                <span className="text-2xl md:text-3xl font-display font-bold text-gradient">
                  {stat.value}
                </span>
                <span className="text-xs md:text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

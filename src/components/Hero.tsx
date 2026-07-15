import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { teamConfig, stats } from "@/lib/data";
import { PFCLogo, PAYSLLogo } from "@/components/PFCLogo";
import heroBackground from "@/assets/pfc-spring-break-camp.jpg";

export function Hero() {
  const statItems = [
    { icon: Trophy, value: `$${(stats.totalRaised / 1000).toFixed(1)}K`, label: "Raised" },
    { icon: Users, value: stats.supporters.toString(), label: "Supporters" },
    { icon: Target, value: stats.cardsSold.toString(), label: "Cards Sold" },
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
          {/* Logos */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <PFCLogo size="lg" />
            <PAYSLLogo size="lg" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-accent">{teamConfig.season} Season Fundraiser</span>
          </div>

          {/* Main Heading */}
          <h1 className="section-heading text-4xl md:text-6xl lg:text-7xl mb-4">
            Support Your
            <br />
            <span className="text-gradient">PAYSL Athletes</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {teamConfig.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/roster">
              <Button size="lg" className="btn-primary-glow gap-2 text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                Browse Player Cards
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-accent/50 text-accent hover:bg-accent/10">
              Become a Sponsor
            </Button>
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

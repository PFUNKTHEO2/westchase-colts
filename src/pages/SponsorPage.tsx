import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Gift, Sparkles, Trophy, Users, DollarSign, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PFCLogo } from "@/components/PFCLogo";
import { titleSponsor, teamConfig } from "@/lib/data";
import sponsorHero from "@/assets/pfc-spring-break-camp.jpg";

export default function SponsorPage() {
  const progressPercent = (titleSponsor.cardsSold / titleSponsor.cardsForPrize) * 100;

  return (
    <>
      <Helmet>
        <title>{titleSponsor.name} Partnership | {teamConfig.name}</title>
        <meta
          name="description"
          content={`${titleSponsor.name} is the proud title sponsor of ${teamConfig.name}. Learn about our partnership and the $${titleSponsor.auctionFloor} auction floor guarantee.`}
        />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Back Button */}
          <div className="container mx-auto px-4 py-6">
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Campaign
              </Button>
            </Link>
          </div>

          {/* Hero banner */}
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: `url(${sponsorHero})` }} />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium text-accent uppercase tracking-wider">
                    Official Partnership
                  </span>
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>

                <div className="flex items-center justify-center gap-6 md:gap-12 mb-8">
                  <div className="bg-white rounded-lg p-4 md:p-6 shadow-xl">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">Sing Orthodontics</h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">SingSmile™ Your Smile. Our Passion.</p>
                  </div>
                  <span className="text-3xl text-muted-foreground font-light">×</span>
                  <PFCLogo size="lg" />
                </div>

                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  {titleSponsor.name} & {teamConfig.name}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We're proud to partner with {titleSponsor.name} to bring you an enhanced fundraising experience 
                  with guaranteed value for every player card.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Grand Prize Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
              >
                <Card className="border-accent/30 bg-gradient-to-br from-card to-accent/10 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
                        <Trophy className="h-8 w-8 text-accent" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Grand Prize Giveaway
                      </h2>
                      <p className="text-muted-foreground">
                        Help us unlock the grand prize from {titleSponsor.name}!
                      </p>
                    </div>

                    {/* Prize Box */}
                    <div className="relative mx-auto w-64 mb-8">
                      <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-6 text-center">
                        <Gift className="h-16 w-16 text-accent mx-auto mb-3" />
                        <span className="text-sm font-medium text-foreground block">
                          {titleSponsor.prizeDescription}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1 block">
                          from {titleSponsor.name}
                        </span>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur-lg opacity-30 -z-10" />
                    </div>

                    {/* Progress Tracker */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Cards Sold</span>
                        <span className="font-semibold text-foreground">
                          {titleSponsor.cardsSold} / {titleSponsor.cardsForPrize}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-3" />
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        {titleSponsor.cardsForPrize - titleSponsor.cardsSold} more cards to unlock the prize!
                      </p>
                    </div>

                    {/* How to Enter */}
                    <div className="bg-muted/30 rounded-lg p-6">
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        How to Enter
                      </h3>
                      <ol className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="font-bold text-primary">1.</span>
                          Purchase any player card from the collection
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-primary">2.</span>
                          Each card purchase = 1 entry into the drawing
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold text-primary">3.</span>
                          Winner announced when {titleSponsor.cardsForPrize} cards are sold
                        </li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Why This Model Works for Sponsors */}
          <section className="py-16 bg-gradient-to-b from-background to-secondary/30">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Why This Model <span className="text-gradient">Works for Sponsors</span>
                  </h2>
                </div>

                <Card className="border-primary/20 bg-card/80">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 rounded-full bg-primary/20 flex-shrink-0">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-3">
                          Smarter Than Traditional Sponsorships
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Traditional sponsorships cost $25,000–$50,000 with hard-to-measure ROI. With ProdigyChain's 
                          floor-based model, {titleSponsor.name} gets title sponsor visibility across 12,000 athlete families 
                          while their actual financial exposure is capped at the guaranteed floor amount — potentially $0 
                          if auctions perform well.
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mt-6">
                      {[
                        {
                          icon: DollarSign,
                          title: "Capped Exposure",
                          desc: "Financial risk is limited to the floor guarantee — pay only when auctions underperform",
                        },
                        {
                          icon: Users,
                          title: "Massive Reach",
                          desc: "Title sponsor branding across 12,000+ athlete families in the Pflugerville area",
                        },
                        {
                          icon: TrendingUp,
                          title: "Measurable ROI",
                          desc: "Real-time dashboard showing cards sold, impressions, and community engagement",
                        },
                      ].map((item) => (
                        <div key={item.title} className="text-center">
                          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                            <item.icon className="h-6 w-6 text-accent" />
                          </div>
                          <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Auction Floor Infographic */}
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  ${titleSponsor.auctionFloor} Auction Floor Commitment
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {titleSponsor.name} guarantees every card auction starts with real value
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    icon: DollarSign,
                    title: "Guaranteed Value",
                    desc: `Every card auction has a $${titleSponsor.auctionFloor} floor — no card sells for less`,
                    color: "primary",
                  },
                  {
                    icon: Users,
                    title: "Support Athletes",
                    desc: `${titleSponsor.athleteShare}% of proceeds above $${titleSponsor.auctionFloor} go directly to the athlete's family`,
                    color: "accent",
                  },
                  {
                    icon: Trophy,
                    title: "Build the Future",
                    desc: `${titleSponsor.developmentShare}% funds PAYSL development, equipment, and facilities`,
                    color: "primary",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full text-center">
                      <CardContent className="p-6">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                            item.color === "primary"
                              ? "bg-primary/20 text-primary"
                              : "bg-accent/20 text-accent"
                          }`}
                        >
                          <item.icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Support PAYSL Athletes?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Browse our collection and get your favorite player cards today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/">
                    <Button size="lg" className="gap-2">
                      Return to Campaign
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  </Link>
                  <a
                    href={titleSponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="lg">
                      Visit {titleSponsor.name}
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, CreditCard, Smartphone, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { titleSponsor } from "@/lib/data";

export function TitleSponsorSection() {
  const digitalPrice = 15;
  const physicalPrice = 30;
  const athleteShare = titleSponsor.athleteShare;
  const devShare = titleSponsor.developmentShare;

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              Title Sponsor
            </span>
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <h2 className="section-heading mb-4">
            Proudly <span className="text-gradient">Sponsored By</span>
          </h2>
          <Link
            to={`/sponsor/${titleSponsor.slug}`}
            className="inline-block hover:scale-105 transition-transform duration-300"
          >
            <div className="bg-white rounded-lg p-6 inline-block">
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Tech Sherpas</h3>
                <p className="text-sm text-gray-600 mt-1">IT Training and Certification Experts</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Main Card — Pricing Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card className="border-accent/30 bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Simple, Direct Pricing — Powered by {titleSponsor.name}
                </h3>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  No auctions, no bidding. Every ProdigyCard is available at a fixed price — easy to support, easy to collect, and every dollar goes toward our athletes.
                </p>
              </div>

              {/* Two pricing cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Digital */}
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border border-border">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Smartphone className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground text-lg mb-1">Digital ProdigyCard</h4>
                  <span className="text-4xl font-display font-bold text-gradient mb-2">${digitalPrice}</span>
                  <p className="text-sm text-muted-foreground">
                    Instant access — add to Apple Wallet or share digitally. Collect your favorite player anywhere.
                  </p>
                </div>

                {/* Physical */}
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-accent/10 border border-accent/30">
                  <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                    <CreditCard className="h-7 w-7 text-accent" />
                  </div>
                  <h4 className="font-bold text-foreground text-lg mb-1">Metal Physical ProdigyCard</h4>
                  <span className="text-4xl font-display font-bold text-gradient mb-2">${physicalPrice}</span>
                  <p className="text-sm text-muted-foreground">
                    A premium metal card available for pickup at the club — display it, trade it, or keep it as a keepsake.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Where Money Goes */}
        <div className="max-w-4xl mx-auto">
          {/* Section Heading — centered, full width above cards */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-foreground">
              Where Does the <span className="text-gradient">Money Go?</span>
            </h3>
          </div>

          <TooltipProvider>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Digital Card Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full bg-muted/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Digital Card — ${digitalPrice}</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Card Price:</span>
                        <span className="font-semibold text-foreground">${digitalPrice}.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1">
                          Costs
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-xs">
                              <p className="font-semibold mb-1">Cost breakdown:</p>
                              <ul className="space-y-0.5">
                                <li>• Payment processing</li>
                                <li>• Platform & delivery fee</li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                          :
                        </span>
                        <span className="text-sm text-muted-foreground">− $1.50</span>
                      </div>
                      <div className="h-px bg-border my-2" />
                      <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                        <span className="text-sm font-medium text-foreground">Goes to the club:</span>
                        <span className="font-bold text-primary">$13.50</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Physical Card Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Card className="h-full bg-muted/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="h-5 w-5 text-accent" />
                      <h4 className="font-semibold text-foreground">Physical Card — ${physicalPrice}</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Card Price:</span>
                        <span className="font-semibold text-foreground">${physicalPrice}.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1">
                          Costs
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-xs">
                              <p className="font-semibold mb-1">Cost breakdown:</p>
                              <ul className="space-y-0.5">
                                <li>• Card design & artwork</li>
                                <li>• Metal card production</li>
                                <li>• Payment processing</li>
                                <li>• Shipping to club</li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                          :
                        </span>
                        <span className="text-sm text-muted-foreground">− $10.00</span>
                      </div>
                      <div className="h-px bg-border my-2" />
                      <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                        <span className="text-sm font-medium text-foreground">Goes to the club:</span>
                        <span className="font-bold text-primary">$20.00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TooltipProvider>
        </div>


        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            to={`/sponsor/${titleSponsor.slug}`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Learn more about our partnership
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

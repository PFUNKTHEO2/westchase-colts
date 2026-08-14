/**
 * Simple, Direct Pricing — three tiers, one sentence on the split, no
 * per-item cost breakdown. Reads straight from lib/cart so this section can
 * never drift from what checkout actually charges (David's pricing pass,
 * 7/20: replaces the old "Where Does the Money Go" section entirely).
 */
import { motion } from "framer-motion";
import { Smartphone, CreditCard, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CARD_PRICES } from "@/lib/cart";
import { titleSponsor } from "@/lib/data";

const TIERS = [
  {
    variant: "digital" as const,
    icon: Smartphone,
    title: "Digital ProdigyCard",
    blurb: "Instant access. Share it on socials or keep it in your Gallery.",
  },
  {
    variant: "metal" as const,
    icon: CreditCard,
    title: "Physical Trading Card",
    blurb: "2.5x3.5 metal card, pickup at the club. Display it, trade it, keep it.",
  },
  {
    variant: "postcard" as const,
    icon: ImageIcon,
    title: "ProdigyCard Postcard",
    blurb: "5.5x8.5 metal print. A gift for a coach or grandparent.",
  },
];

export function PricingSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-accent/30 bg-gradient-to-br from-card to-accent/5">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Simple, Direct Pricing, Powered by {titleSponsor.name}
                </h3>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  No auctions, no bidding. Every ProdigyCard is available at a fixed price.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {TIERS.map((tier) => (
                  <div
                    key={tier.variant}
                    className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/30 border border-border"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <tier.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h4 className="font-bold text-foreground text-lg mb-1">{tier.title}</h4>
                    <span className="text-4xl font-display font-bold text-gradient mb-2">
                      ${CARD_PRICES[tier.variant]}
                    </span>
                    <p className="text-sm text-muted-foreground">{tier.blurb}</p>
                  </div>
                ))}
              </div>

              <p className="text-center text-sm text-muted-foreground mt-8">
                50% of every sale goes to the club, and the other 50% covers card creation, payment
                processing, and the platform fee.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

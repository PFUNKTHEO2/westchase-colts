import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { titleSponsor } from "@/lib/data";

export function TitleSponsorSection() {
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

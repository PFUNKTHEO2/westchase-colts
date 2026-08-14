import { motion } from "framer-motion";
import { Share2, Twitter, Facebook, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { teamConfig } from "@/lib/data";

export function SocialShare() {
  const shareUrl = window.location.href;
  const shareText = `Support the ${teamConfig.name}! Help us reach our fundraising goal.`;

  const handleShare = (platform: string) => {
    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
        return;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
            <Share2 className="w-8 h-8 text-primary" />
          </div>

          <h2 className="section-heading mb-4">
            Share & <span className="text-gradient">Rally</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-4">
            Help us reach more supporters by sharing our fundraiser with your friends and family!
          </p>
          <p className="text-muted-foreground text-base mb-8 max-w-xl mx-auto">
            There's something special about holding a player's card in your hands, setting it on the kitchen table, sticking it on the fridge, or trading it with a friend at the next game. Every physical card tells a story. Share ours, and help bring these athletes into homes beyond the field.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => handleShare("twitter")}
              className="gap-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white"
            >
              <Twitter className="w-5 h-5" />
              Share on X
            </Button>
            <Button
              size="lg"
              onClick={() => handleShare("facebook")}
              className="gap-2 bg-[#4267B2] hover:bg-[#4267B2]/90 text-white"
            >
              <Facebook className="w-5 h-5" />
              Share on Facebook
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleShare("copy")}
              className="gap-2 border-border hover:bg-muted"
            >
              <Link2 className="w-5 h-5" />
              Copy Link
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

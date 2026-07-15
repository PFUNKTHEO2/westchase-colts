import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { PlayerCard as PlayerCardType } from "@/lib/data";

interface PlayerCardProps {
  player: PlayerCardType;
  index?: number;
  linkToPreview?: boolean;
}

export function PlayerCard({ player, index = 0, linkToPreview = true }: PlayerCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="perspective-1000">
        <motion.div
          animate={{ rotateY: isHovered ? 12 : 0, scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative aspect-[2.5/3.5] rounded-xl overflow-hidden card-glow card-shine"
        >
          {/* Card Front */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${player.front}')` }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Player Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-accent font-medium">
                  {player.position}
                </p>
                <h3 className="font-display font-bold text-xl text-foreground">
                  {player.name}
                </h3>
                {player.grade && (
                  <p className="text-sm text-muted-foreground">{player.grade}</p>
                )}
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 border border-primary/30">
                <span className="font-display font-bold text-xl text-primary">
                  #{player.number}
                </span>
              </div>
            </div>

            {/* Highlight Badge */}
            {player.highlight && (
              <div className="mt-3 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30 inline-block">
                <span className="text-xs font-medium text-accent">{player.highlight}</span>
              </div>
            )}
          </div>

          {/* Hover Glow Effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : ""
            }`}
          />
        </motion.div>
      </div>

      {/* View Card Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg"
      >
        View 3D Card
      </motion.div>
    </motion.div>
  );

  if (linkToPreview) {
    return <Link to={`/card-preview/${player.id}`}>{cardContent}</Link>;
  }

  return cardContent;
}

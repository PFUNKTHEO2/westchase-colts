import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  RotateCcw,
  Twitter,
  Facebook,
  Link2,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { playerCards, teamConfig } from "@/lib/data";

const CardPreview = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const player = playerCards.find((p) => p.id === cardId);

  const [isFlipped, setIsFlipped] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startRotation = useRef(0);

  // Handle mouse drag for rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    startRotation.current = rotation.y;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
    setRotation((prev) => ({
      ...prev,
      y: startRotation.current + deltaX * 0.5,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      startX.current = e.touches[0].clientX;
      startRotation.current = rotation.y;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startX.current;
    setRotation((prev) => ({
      ...prev,
      y: startRotation.current + deltaX * 0.5,
    }));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle scroll wheel for zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 2));
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Handle flip on click
  const handleFlip = () => {
    if (!isDragging) {
      setIsFlipped((prev) => !prev);
    }
  };

  // Reset view
  const handleReset = () => {
    setRotation({ x: 0, y: 0 });
    setScale(1);
    setIsFlipped(false);
  };

  // Zoom controls
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  // Social sharing
  const shareUrl = window.location.href;
  const shareText = player
    ? `Check out ${player.name}'s player card from the ${teamConfig.name}!`
    : "";

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

  const handleDownload = () => {
    if (player) {
      const link = document.createElement("a");
      link.href = isFlipped ? player.back : player.front;
      link.download = `${player.name.replace(/\s+/g, "-")}-card.jpg`;
      link.click();
      toast.success("Card image downloaded!");
    }
  };

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Player not found</h1>
          <Link to="/roster">
            <Button>Back to Roster</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {player.name} #{player.number} - {teamConfig.name}
        </title>
        <meta
          name="description"
          content={`View ${player.name}'s interactive 3D player card. ${player.position} for the ${teamConfig.name}.`}
        />
        <meta property="og:title" content={`${player.name} - ${teamConfig.name}`} />
        <meta property="og:description" content={`${player.position} #${player.number}`} />
        <meta property="og:image" content={player.front} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={player.front} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="navbar-glass fixed top-0 left-0 right-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/roster">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Roster
                </Button>
              </Link>

              <div className="text-center">
                <h1 className="font-display font-bold text-gradient">{player.name}</h1>
                <p className="text-xs text-muted-foreground">
                  #{player.number} • {player.position}
                </p>
              </div>

              <Button variant="ghost" size="icon" onClick={handleReset}>
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          ref={containerRef}
          className="pt-20 pb-32 min-h-screen flex items-center justify-center select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 3D Card Container */}
          <div className="perspective-2000 w-full max-w-md mx-auto px-4">
            <motion.div
              ref={cardRef}
              className="relative aspect-[2.5/3.5] cursor-grab active:cursor-grabbing"
              style={{
                transform: `scale(${scale}) rotateY(${rotation.y + (isFlipped ? 180 : 0)}deg)`,
                transformStyle: "preserve-3d",
                transition: isDragging ? "none" : "transform 0.3s ease-out",
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onClick={handleFlip}
            >
              {/* Card Front */}
              <div
                className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  backgroundImage: `url('${player.front}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Card Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                {/* Card Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-wider text-accent font-medium mb-1">
                        {player.position}
                      </p>
                      <h2 className="font-display font-bold text-2xl text-foreground">
                        {player.name}
                      </h2>
                      {player.grade && (
                        <p className="text-sm text-muted-foreground">{player.grade}</p>
                      )}
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-primary/30 backdrop-blur-sm border border-primary/50 flex items-center justify-center">
                      <span className="font-display font-bold text-2xl text-primary">
                        #{player.number}
                      </span>
                    </div>
                  </div>
                  {player.highlight && (
                    <div className="mt-4 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 inline-block">
                      <span className="text-sm font-medium text-accent">{player.highlight}</span>
                    </div>
                  )}
                </div>

                {/* Holographic Effect */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: `linear-gradient(${
                      rotation.y * 2
                    }deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
                  }}
                />
              </div>

              {/* Card Back */}
              <div
                className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  backgroundImage: `url('${player.back}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="absolute inset-0 bg-card/90 backdrop-blur-sm p-6 flex flex-col justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="font-display font-bold text-3xl text-background">
                        #{player.number}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-2xl text-gradient mb-2">
                      {player.name}
                    </h3>
                    <p className="text-accent font-medium mb-4">{player.position}</p>
                    {player.grade && (
                      <p className="text-muted-foreground mb-4">{player.grade}</p>
                    )}
                    {player.highlight && (
                      <div className="px-4 py-2 rounded-lg bg-accent/20 border border-accent/30">
                        <span className="text-sm text-accent">{player.highlight}</span>
                      </div>
                    )}
                    <div className="mt-6 pt-4 border-t border-border">
                      <p className="font-display text-sm text-muted-foreground">
                        {teamConfig.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {teamConfig.season} {teamConfig.sport}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Instructions */}
          <div className="fixed bottom-32 left-1/2 -translate-x-1/2 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="hidden md:inline">Drag to rotate • Click to flip • Scroll to zoom</span>
              <span className="md:hidden">Swipe to rotate • Tap to flip • Pinch to zoom</span>
            </p>
          </div>
        </main>

        {/* Bottom Controls */}
        <div className="fixed bottom-0 left-0 right-0 navbar-glass py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 mr-4">
                <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="w-5 h-5" />
                </Button>
                <span className="text-sm text-muted-foreground w-12 text-center">
                  {Math.round(scale * 100)}%
                </span>
                <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="w-5 h-5" />
                </Button>
              </div>

              {/* Social Share */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleShare("twitter")}
                className="text-[#1DA1F2] hover:bg-[#1DA1F2]/10"
              >
                <Twitter className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleShare("facebook")}
                className="text-[#4267B2] hover:bg-[#4267B2]/10"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleShare("copy")}
              >
                <Link2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="text-accent hover:bg-accent/10"
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardPreview;

import { useState } from "react";
import { X, Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart, CARD_VARIANT_COLORS, CARD_PRICES } from "@/lib/cart";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { toast } = useToast();
  const [checkingOut, setCheckingOut] = useState(false);

  /**
   * The cart lives in memory and dies on the Stripe redirect, so we stash a
   * snapshot in localStorage right before leaving. /checkout/success reads it
   * back to render the actual card on the created-card celebration. If the photo data
   * URLs blow the storage quota, retry without photos rather than fail.
   */
  const snapshotForCelebration = () => {
    const payload = {
      ts: Date.now(),
      items: items.map((i) => ({
        playerName: i.player.name,
        number: i.player.number,
        position: i.player.position,
        program: i.team.gender,
        ageGroup: i.team.ageGroup,
        photo: i.player.photo,
        photoTransform: i.player.photoTransform,
        templateId: i.player.templateId,
        blurb: i.player.blurb,
        variant: i.variant,
        quantity: i.quantity,
      })),
    };
    try {
      localStorage.setItem("wc:last-mint", JSON.stringify(payload));
    } catch {
      try {
        localStorage.setItem(
          "wc:last-mint",
          JSON.stringify({ ...payload, items: payload.items.map(({ photo, ...rest }) => rest) }),
        );
      } catch {
        /* celebration falls back to the generic version */
      }
    }
  };

  const checkout = async () => {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            variant: i.variant,
            quantity: i.quantity,
            playerName: i.player.name,
            teamLabel: `${i.team.ageGroup} ${i.team.gender}`,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");
      snapshotForCelebration();
      window.location.href = data.url;
    } catch {
      setCheckingOut(false);
      toast({
        title: "Checkout could not start",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md border-l border-border bg-card shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-lg text-foreground">Cart ({items.length})</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">Your cart is empty.</p>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    const variant = CARD_VARIANT_COLORS[item.variant];
                    const lineTotal = CARD_PRICES[item.variant] * item.quantity;
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`flex items-center gap-3 rounded-lg border-2 ${variant.border} ${variant.bg} p-3`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{item.player.name}</p>
                          <p className="text-xs text-muted-foreground">
                            #{item.player.number} • {item.player.position} • {item.team.ageGroup} {item.team.gender}
                          </p>
                          <p className="text-xs font-medium mt-0.5" style={{ color: "hsl(var(--primary))" }}>{variant.label}</p>
                        </div>

                        {/* Quantity controls for anything but digital (1 per player) */}
                        {item.variant !== "digital" ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground shrink-0">×1</span>
                        )}

                        <p className="text-sm font-bold text-foreground shrink-0">${lineTotal}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive hover:bg-destructive/30 transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-display font-bold text-xl text-foreground">${total}</span>
                </div>
                <Button
                  onClick={checkout}
                  disabled={checkingOut}
                  className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 btn-gold font-semibold text-base"
                >
                  {checkingOut ? "Opening secure checkout..." : "Complete Purchase"}
                </Button>
                <Button onClick={clearCart} variant="ghost" size="sm" className="w-full text-muted-foreground">
                  Clear Cart
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { createContext, useContext, useState, ReactNode } from "react";
import type { TeamPlayer, Team } from "@/lib/teams";

// "digital" removed (David 2026-09-21) -- it was still live and purchasable
// on this template (PlayerDetailModal, ReturnFromCreator) even though every
// other club site dropped it back on 2026-09-16.
export type CardVariant = "metal" | "postcard";

export interface CartItem {
  id: string;
  player: TeamPlayer;
  team: Team;
  variant: CardVariant;
  quantity: number;
}

// 50/50 split on every tier: half to the club, half covers card creation,
// payment processing, and the platform fee (David's pricing pass, 7/20).
export const CARD_PRICES: Record<CardVariant, number> = {
  metal: 20,
  postcard: 38,
};

export const CLUB_SHARE: Record<CardVariant, number> = {
  metal: 10,
  postcard: 19,
};

export const CARD_VARIANT_COLORS: Record<CardVariant, { name: string; border: string; bg: string; label: string }> = {
  metal: { name: "Metal", border: "border-accent", bg: "bg-accent/20", label: "Physical Trading Card" },
  postcard: { name: "Postcard", border: "border-yellow-400/60", bg: "bg-yellow-400/10", label: "ProdigyCard Postcard (5.5x8.5)" },
};

interface CartContextType {
  items: CartItem[];
  addItem: (player: TeamPlayer, team: Team, variant: CardVariant, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  count: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (player: TeamPlayer, team: Team, variant: CardVariant, quantity: number = 1) => {
    const id = `${player.id}-${variant}`;
    const existing = items.find((i) => i.id === id);
    if (existing) {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + quantity } : i));
      return;
    }
    setItems((prev) => [...prev, { id, player, team, variant, quantity }]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + CARD_PRICES[i.variant] * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

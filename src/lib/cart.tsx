import { createContext, useContext, useState, ReactNode } from "react";
import type { TeamPlayer, Team } from "@/lib/teams";

export type CardVariant = "digital" | "metal";

export interface CartItem {
  id: string;
  player: TeamPlayer;
  team: Team;
  variant: CardVariant;
  quantity: number;
}

export const CARD_PRICES: Record<CardVariant, number> = {
  digital: 15,
  metal: 30,
};

export const CARD_VARIANT_COLORS: Record<CardVariant, { name: string; border: string; bg: string; label: string }> = {
  digital: { name: "Digital", border: "border-primary", bg: "bg-primary/20", label: "Digital ProdigyCard" },
  metal: { name: "Metal", border: "border-accent", bg: "bg-accent/20", label: "Metal Physical ProdigyCard" },
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
      // For digital, don't allow more than 1
      if (variant === "digital") return;
      // For metal, increase quantity
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Sparkles, Users, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { teamConfig } from "@/lib/data";
import { PFCLogo, PAYSLLogo } from "@/components/PFCLogo";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/lib/cart";
import prodigychainLogo from "@/assets/prodigychain-logo.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <nav className="navbar-glass fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <PFCLogo size="sm" />
                <PAYSLLogo size="sm" />
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div>
                  <h1 className="font-display font-bold text-lg md:text-xl text-foreground">{teamConfig.name}</h1>
                  <p className="text-xs text-muted-foreground">{teamConfig.season} {teamConfig.sport}</p>
                </div>
                <div className="h-8 w-px bg-border/50" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Powered by</span>
                  <img
                    src={prodigychainLogo}
                    alt="Prodigychain"
                    className="h-4 w-auto"
                  />
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/roster">
                <Button variant="ghost" className="gap-2 text-foreground hover:text-primary hover:bg-primary/10">
                  <Users className="w-4 h-4" />
                  Rosters
                </Button>
              </Link>
              <Link to="/create-card">
                <Button className="gap-2 btn-primary-glow">
                  <Sparkles className="w-4 h-4" />
                  Create Your Card
                </Button>
              </Link>
              <Button onClick={() => setCartOpen(true)} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 btn-gold">
                <ShoppingCart className="w-4 h-4" />
                Cart ({count})
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
              <div className="flex flex-col gap-2">
                <Link to="/roster" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2 text-foreground">
                    <Users className="w-4 h-4" />
                    Rosters
                  </Button>
                </Link>
                <Link to="/create-card" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-start gap-2">
                    <Sparkles className="w-4 h-4" />
                    Create Your Card
                  </Button>
                </Link>
                <Button onClick={() => { setCartOpen(true); setIsOpen(false); }} className="w-full justify-start gap-2 bg-accent text-accent-foreground">
                  <ShoppingCart className="w-4 h-4" />
                  Cart ({count})
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

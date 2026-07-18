/**
 * /checkout/success — Stripe redirects here after payment. Clears the cart
 * and confirms the order.
 */
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { teamConfig } from "@/lib/data";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Order Received | {teamConfig.name}</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <CheckCircle2 className="w-16 h-16 mx-auto text-primary mb-6" />
          <h1 className="font-display font-bold text-3xl text-foreground mb-3">Order received</h1>
          <p className="text-muted-foreground mb-8">
            Your payment went through and your ProdigyCard order is in. A receipt is on its way
            to your email. Every card sold puts money back into the Colts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/create-card">Create another card</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "@/hooks/use-cart-store";
import { toast } from "@/hooks/use-toast";

const CUSTOMISER_URL = import.meta.env.VITE_CUSTOMISER_URL || (import.meta.env.DEV ? "http://localhost:5173/" : "https://intent-love-customiser-tool-production.up.railway.app/");

const Customise = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const addToCart = useCartStore(state => state.addToCart);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('[DEBUG] Received postMessage', event.origin, event.data);
      console.log('[DEBUG] CUSTOMISER_URL', CUSTOMISER_URL);
      const customiserOrigin = CUSTOMISER_URL.replace(/\/$/, '');
      if (event.origin !== customiserOrigin) {
        console.log('[DEBUG] Origin mismatch, ignoring message');
        return;
      }
      if (event.data && event.data.type === "CUSTOMISER_OUTPUT") {
        // event.data.link is the output link
        let productId = "card-custom";
        if (event.data.productType === "notes") productId = "jar-custom";
        if (event.data.productType === "both") productId = "custom-package";
        console.log('[DEBUG] Adding to cart', { productId, link: event.data.link });
        addToCart({
          productId,
          quantity: 1,
          customLink: event.data.link,
        });
        toast({ title: "Custom product added!", description: "Your custom product has been added to the cart." });
        navigate("/cart");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [addToCart, navigate]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-20">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <div className="text-lg font-semibold text-primary">Preparing your environment...</div>
        </div>
      )}
      <iframe
        src={CUSTOMISER_URL.replace(/\/?$/, '') + '?from=shop'}
        title="Custom Card Customiser"
        className="w-full h-screen flex-1 border-0"
        allow="clipboard-write"
        onLoad={() => setLoading(false)}
        style={{ visibility: loading ? 'hidden' : 'visible' }}
      />
    </div>
  );
};

export default Customise; 
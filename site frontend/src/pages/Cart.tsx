import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/lib/fetchProducts";
import { useCartStore } from "@/hooks/use-cart-store";
import { toast } from "@/hooks/use-toast";
import { ShoppingBag } from "lucide-react";
import { AutoScrollShowcase } from "@/components/AutoScrollShowcase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(data => {
        setProducts(data || []);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const cartProducts = items.map(item => {
    const product = products.find((p: any) => p.id === item.productId);
    return product ? { ...product, ...item } : null;
  }).filter(Boolean);
  const subtotal = cartProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Your Cart</h1>
          {loading ? (
            <div className="text-center py-24 text-xl text-muted-foreground">Loading products...</div>
          ) : error ? (
            <div className="text-center py-24 text-xl text-destructive">{error}</div>
          ) : (
            <div className="flex flex-col gap-8">
              {cartProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-xl text-muted-foreground gap-6">
                  <ShoppingBag className="h-20 w-20 mb-4 text-muted-foreground" />
                  <div>Your cart is empty.</div>
                  <Button size="lg" className="rounded-full px-8 py-4 text-lg font-semibold mt-4" onClick={() => window.location.href = '/products'}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {cartProducts.map(item => {
                    // Robust image handling for cart
                    let mainImage = '';
                    if (Array.isArray(item.images)) {
                      for (const img of item.images) {
                        if (img === null || img === undefined) continue;
                        let imgUrl = '';
                        if (typeof img === 'string' && img.trim().startsWith('{')) {
                          try {
                            const parsed = JSON.parse(img);
                            if (parsed.image) imgUrl = parsed.image;
                          } catch {}
                        } else if (typeof img === 'object') {
                          if (img && typeof (img as any).image === 'string') imgUrl = (img as any).image;
                        } else if (typeof img === 'string') {
                          if (img.match(/\.(png|jpe?g|webp|gif)(\?.*)?$/i)) imgUrl = img;
                        }
                        if (imgUrl) {
                          mainImage = imgUrl;
                          break;
                        }
                      }
                    }
                    return (
                      <div key={item.id} className="flex gap-6 items-center bg-white/80 rounded-2xl shadow p-4">
                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={item.name}
                            loading="lazy"
                            className="w-24 h-24 object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-24 h-24 flex items-center justify-center bg-gray-200 text-gray-400 rounded-xl">No image</div>
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-lg mb-1">{item.name}</div>
                          {item.customLink && (
                            <div className="mb-1">
                              <a href={item.customLink} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
                                See Preview
                              </a>
                            </div>
                          )}
                          <div className="text-muted-foreground text-sm mb-2">₦{item.price.toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} each</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Qty:</span>
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={e => {
                                updateQuantity(item.id, Number(e.target.value));
                                toast({ title: 'Cart updated', description: `Quantity for ${item.name} updated.` });
                              }}
                              className="w-16 px-2 py-1 border rounded text-center"
                            />
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                          removeFromCart(item.id);
                          toast({ title: 'Removed from cart', description: `${item.name} removed from your cart.` });
                        }}>
                          ×
                        </Button>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center mt-8 border-t pt-6">
                    <div className="text-xl font-bold">Subtotal</div>
                    <div className="text-2xl font-bold text-primary">₦{subtotal.toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</div>
                  </div>
                  <Button size="lg" className="rounded-full px-8 py-4 text-lg font-semibold w-full mt-4" onClick={() => {
                    navigate("/checkout");
                  }}>
                    Proceed to Checkout
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <Button size="lg" variant="outline" className="rounded-full px-8 py-4 text-lg font-semibold w-full text-primary" onClick={() => window.location.href = '/products'}>
                      Continue Shopping
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full px-8 py-4 text-lg font-semibold w-full text-destructive" onClick={() => {
                      clearCart();
                      toast({ title: 'Cart cleared', description: 'Your cart has been emptied.' });
                    }}>
                      Clear Cart
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <AutoScrollShowcase products={products} />
      </main>
      <Footer />
    </div>
  );
};

export default Cart; 
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCartStore } from "@/hooks/use-cart-store";
import { toast } from "@/hooks/use-toast";
import { ShoppingBag } from "lucide-react";

export const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const cartProducts = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter(Boolean);
  const subtotal = cartProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Your Cart</h1>
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
              {cartProducts.map(item => (
                <div key={item.id} className="flex gap-6 items-center bg-white/80 rounded-2xl shadow p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-1">{item.name}</div>
                    <div className="text-muted-foreground text-sm mb-2">${item.price.toFixed(2)} each</div>
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
              ))}
              <div className="flex justify-between items-center mt-8 border-t pt-6">
                <div className="text-xl font-bold">Subtotal</div>
                <div className="text-2xl font-bold text-primary">${subtotal.toFixed(2)}</div>
              </div>
              <Button size="lg" className="rounded-full px-8 py-4 text-lg font-semibold w-full mt-4" onClick={() => {
                clearCart();
                toast({ title: 'Cart cleared', description: 'Your cart has been emptied.' });
              }}>
                Checkout
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart; 
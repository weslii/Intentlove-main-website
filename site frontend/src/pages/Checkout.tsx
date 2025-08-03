import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/hooks/use-cart-store";
import { toast } from "@/hooks/use-toast";
import { fetchProducts } from "@/lib/fetchProducts";
import { createOrder, ShippingInfo } from "@/lib/orderService";
import { initializePaystack, getPaystackPublicKey } from "@/lib/paystackService";

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Shipping information state
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    // Fetch products to get details
    setLoading(true);
    fetchProducts()
      .then(data => {
        setProducts(data || []);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [items, navigate]);

  // Calculate cart totals
  const cartProducts = items.map(item => {
    const product = products.find((p: any) => p.id === item.productId);
    return product ? { ...product, ...item } : null;
  }).filter(Boolean);
  
  const subtotal = cartProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 1500; // Fixed shipping cost of ₦1,500
  const total = subtotal + shipping;

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field as keyof ShippingInfo]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessing(true);
      
      // Initialize Paystack payment
      await initializePaystack({
        publicKey: getPaystackPublicKey(),
        email: shippingInfo.email,
        amount: total * 100, // Convert to kobo (smallest currency unit)
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: shippingInfo.fullName,
            },
            {
              display_name: "Order Items",
              variable_name: "order_items",
              value: items.length.toString(),
            },
          ],
        },
        callback: async (response) => {
          if (response.status === "success") {
            try {
              // Create order in database
              const orderData = await createOrder({
                items,
                shippingInfo,
                subtotal: total,
                paymentReference: response.reference,
              });
              
              // Clear cart and redirect to success page
              clearCart();
              navigate(`/order-success?reference=${response.reference}`);
              
              toast({
                title: "Order placed successfully!",
                description: "Thank you for your purchase.",
              });
            } catch (error) {
              console.error("Error creating order:", error);
              toast({
                title: "Error creating order",
                description: "Your payment was successful, but we couldn't create your order. Please contact support.",
                variant: "destructive",
              });
            }
          } else {
            toast({
              title: "Payment failed",
              description: response.message || "Your payment could not be processed.",
              variant: "destructive",
            });
          }
        },
        onClose: () => {
          setProcessing(false);
          toast({
            title: "Payment cancelled",
            description: "You cancelled the payment process.",
          });
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      setProcessing(false);
      toast({
        title: "Payment error",
        description: error instanceof Error ? error.message : "An error occurred during payment.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>
            <div className="text-center py-24 text-xl text-muted-foreground">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>
            <div className="text-center py-24 text-xl text-destructive">{error}</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shipping Information Form */}
            <div className="md:col-span-2">
              <div className="bg-white/80 rounded-2xl shadow p-6">
                <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        placeholder="+234 800 000 0000"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        placeholder="Lagos"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        placeholder="Lagos State"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleInputChange}
                        placeholder="100001"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white/80 rounded-2xl shadow p-6 sticky top-24">
                <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cartProducts.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center">
                          {item.quantity}
                        </span>
                        <span className="font-medium truncate max-w-[150px]">{item.name}</span>
                      </div>
                      <span>₦{(item.price * item.quantity).toLocaleString("en-NG")}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString("en-NG")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₦{shipping.toLocaleString("en-NG")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₦{total.toLocaleString("en-NG")}</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 rounded-full px-8 py-4 text-lg font-semibold"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Pay Now"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-4 rounded-full px-8 py-4 text-lg font-semibold"
                  size="lg"
                  onClick={() => navigate("/cart")}
                  disabled={processing}
                >
                  Return to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
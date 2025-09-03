import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { createUserAccount } from "@/lib/orderService";
import { CheckCircle } from "lucide-react";

export const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reference] = useState<string>(
    new URLSearchParams(location.search).get("reference") || ""
  );
  const [showSignup, setShowSignup] = useState<boolean>(false);
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // If no reference is provided, redirect to home
    if (!reference) {
      navigate("/");
    }
  }, [reference, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!signupData.email || !signupData.password || !signupData.fullName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create user account and automatically sign them in
      const result = await createUserAccount(
        signupData.email,
        signupData.password,
        signupData.fullName
      );
      
      // Check if user is now signed in
      if (result.user) {
        toast({
          title: "Account created successfully! ✨",
          description: "Welcome! You're now signed in and can view your order history. Any previous orders with this email have been linked to your account.",
        });
        
        // Redirect directly to account page since they're already signed in
        navigate("/account");
      } else {
        // Fallback: redirect to login if something went wrong
        toast({
          title: "Account created successfully! ✨",
          description: "Please sign in to view your order history.",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      
      // Handle specific error cases
      let errorMessage = "An error occurred while creating your account.";
      
      if (error instanceof Error) {
        if (error.message.includes("already registered")) {
          errorMessage = "An account with this email already exists. Please try logging in instead.";
        } else if (error.message.includes("password")) {
          errorMessage = "Password must be at least 6 characters long.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "There was an issue with the sign-in process. Please try logging in manually.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error creating account",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white/80 rounded-2xl shadow p-8 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Order Successful!</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="bg-primary/5 rounded-xl p-4 mb-8">
              <p className="font-medium">Order Reference:</p>
              <p className="text-lg font-bold">{reference}</p>
            </div>

            {!showSignup ? (
              <div className="space-y-6">
                <div className="bg-primary/5 rounded-xl p-6">
                  <h2 className="text-2xl font-semibold mb-4">Save your information for future orders?</h2>
                  <p className="text-muted-foreground mb-6">
                    Create an account to track your orders, save your shipping information, and enjoy a faster checkout experience next time.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="rounded-full px-8 py-4 text-lg font-semibold"
                      onClick={() => setShowSignup(true)}
                    >
                      Create Account
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full px-8 py-4 text-lg font-semibold"
                      onClick={() => navigate("/")}
                    >
                      No Thanks
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Create Your Account</h2>
                <form onSubmit={handleSignup} className="space-y-4 text-left">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={signupData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={signupData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={signupData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-full px-8 py-4 text-lg font-semibold w-full"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="rounded-full px-8 py-4 text-lg font-semibold w-full"
                      onClick={() => setShowSignup(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div className="mt-8 pt-6 border-t">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-4 text-lg font-semibold"
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
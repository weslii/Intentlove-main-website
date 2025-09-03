import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { signInUser } from "@/lib/orderService";
import { Loader2 } from "lucide-react";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Sign in user
      await signInUser(formData.email, formData.password);
      
      toast({
        title: "Welcome back! ✨",
        description: "You've successfully signed in to your account.",
      });
      
      // Redirect to account page
      navigate("/account");
    } catch (error) {
      console.error("Error signing in:", error);
      
      // Handle specific error cases
      let errorMessage = "Invalid email or password.";
      
      if (error instanceof Error) {
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please check your email and click the confirmation link to activate your account before signing in.";
        } else if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Too many login attempts. Please wait a moment before trying again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error signing in",
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
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white/80 rounded-2xl shadow p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full rounded-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-muted-foreground mb-4">
                Don't have an account?
              </p>
              <Button
                variant="outline"
                className="w-full rounded-full"
                size="lg"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
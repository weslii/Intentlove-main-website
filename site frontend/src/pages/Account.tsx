import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getCurrentUser, getUserOrders, signOutUser } from "@/lib/orderService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, Package, User } from "lucide-react";

export const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          fetchOrders(currentUser.id);
        } else {
          // Redirect to login if not logged in
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking user:", error);
        toast({
          title: "Authentication error",
          description: "Please log in again.",
          variant: "destructive",
        });
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const fetchOrders = async (userId: string) => {
    try {
      setLoadingOrders(true);
      const userOrders = await getUserOrders(userId);
      setOrders(userOrders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error fetching orders",
        description: "We couldn't load your order history.",
        variant: "destructive",
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-xl">Loading...</span>
            </div>
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
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">My Account</h1>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="h-4 w-4 mr-2" />
                Order History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your account details and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-muted-foreground">Email</h3>
                      <p className="text-lg">{user?.email}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">Name</h3>
                      <p className="text-lg">{user?.user_metadata?.full_name || "Not provided"}</p>
                    </div>
                    <div className="pt-4">
                      <Button className="rounded-full">Update Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View and track all your previous orders.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">Loading orders...</span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't placed any orders yet.
                      </p>
                      <Button
                        className="rounded-full"
                        onClick={() => navigate("/products")}
                      >
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border rounded-xl p-4 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-medium">Order #{order.id.substring(0, 8)}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString("en-NG", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">
                                ₦{order.subtotal.toLocaleString("en-NG")}
                              </div>
                              <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {order.items.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>
                                  {item.quantity} × {item.productId}
                                </span>
                                <span className="font-medium">
                                  ₦{(item.price * item.quantity).toLocaleString("en-NG")}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-2 border-t flex justify-end">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getCurrentUser, getUserOrders, signOutUser } from "@/lib/orderService";
import { supabase } from "@/lib/supabaseClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, LogOut, Package, User, Calendar, MapPin, CreditCard, Truck } from "lucide-react";

export const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState<boolean>(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState<boolean>(false);
  const [updateProfileData, setUpdateProfileData] = useState({
    fullName: "",
    email: "",
  });
  const [updatingProfile, setUpdatingProfile] = useState<boolean>(false);

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
        
        // Handle specific authentication errors
        let errorMessage = "Please log in again.";
        
        if (error instanceof Error) {
          if (error.message.includes("Auth session missing")) {
            errorMessage = "Your session has expired. Please log in again.";
          } else if (error.message.includes("JWT expired")) {
            errorMessage = "Your login session has expired. Please log in again.";
          }
        }
        
        toast({
          title: "Authentication error",
          description: errorMessage,
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
        title: "Signed out successfully 👋",
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

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateProfile = () => {
    setUpdateProfileData({
      fullName: user?.user_metadata?.full_name || "",
      email: user?.email || "",
    });
    setShowUpdateProfile(true);
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!updateProfileData.fullName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your full name.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingProfile(true);
      
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: updateProfileData.fullName.trim(),
        },
      });

      if (error) throw error;

      // Update local user state
      setUser(prev => ({
        ...prev,
        user_metadata: {
          ...prev?.user_metadata,
          full_name: updateProfileData.fullName.trim(),
        },
      }));

      toast({
        title: "Profile updated successfully! ✨",
        description: "Your profile information has been updated.",
      });

      setShowUpdateProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setUpdatingProfile(false);
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
                      <Button className="rounded-full" onClick={handleUpdateProfile}>
                        Update Profile
                      </Button>
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
                              <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                                {order.status}
                              </Badge>
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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewOrderDetails(order)}
                            >
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

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </DialogTitle>
            <DialogDescription>
              Complete information about your order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    Order #{selectedOrder.id.substring(0, 8)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(selectedOrder.created_at).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </Badge>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Order Items
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.productId}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₦{(item.price * item.quantity).toLocaleString("en-NG")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₦{item.price.toLocaleString("en-NG")} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Shipping Information */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{selectedOrder.shipping_info?.fullName || selectedOrder.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.shipping_info?.email || selectedOrder.customer_email}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.shipping_info?.phone}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.shipping_address}</p>
                </div>
              </div>

              <Separator />

              {/* Payment Information */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Payment Reference</p>
                  <p className="font-medium">{selectedOrder.payment_reference}</p>
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Order Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₦{selectedOrder.subtotal?.toLocaleString("en-NG") || selectedOrder.total_amount?.toLocaleString("en-NG")}</span>
                  </div>
                  {selectedOrder.shipping_info?.shippingCost && (
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>₦{selectedOrder.shipping_info.shippingCost.toLocaleString("en-NG")}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₦{selectedOrder.total_amount?.toLocaleString("en-NG")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
                 </DialogContent>
       </Dialog>

       {/* Update Profile Modal */}
       <Dialog open={showUpdateProfile} onOpenChange={setShowUpdateProfile}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               <User className="h-5 w-5" />
               Update Profile
             </DialogTitle>
             <DialogDescription>
               Update your account information
             </DialogDescription>
           </DialogHeader>

           <form onSubmit={handleProfileSubmit} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="fullName">Full Name</Label>
               <Input
                 id="fullName"
                 name="fullName"
                 value={updateProfileData.fullName}
                 onChange={handleProfileInputChange}
                 placeholder="Enter your full name"
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
                 value={updateProfileData.email}
                 disabled
                 className="bg-gray-50"
               />
               <p className="text-xs text-muted-foreground">
                 Email address cannot be changed for security reasons
               </p>
             </div>

             <div className="flex gap-3 pt-4">
               <Button
                 type="submit"
                 className="flex-1"
                 disabled={updatingProfile}
               >
                 {updatingProfile ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Updating...
                   </>
                 ) : (
                   "Update Profile"
                 )}
               </Button>
               <Button
                 type="button"
                 variant="outline"
                 onClick={() => setShowUpdateProfile(false)}
                 disabled={updatingProfile}
               >
                 Cancel
               </Button>
             </div>
           </form>
         </DialogContent>
       </Dialog>
     </div>
   );
 };

export default Account;
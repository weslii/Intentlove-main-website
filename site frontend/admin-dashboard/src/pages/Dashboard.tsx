import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Plus,
  FileText,
  BarChart3,
} from "lucide-react";
import { ordersApi, productsApi, customersApi, analyticsApi } from "@/api/adminApi";
import { Order, Product } from "@/lib/supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    productsChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const statsData = await analyticsApi.getDashboardStats();
      setStats(statsData);
      
      // Load recent orders
      const orders = await ordersApi.getOrders();
      setRecentOrders(orders.slice(0, 5));
      
      // Load top products
      const products = await productsApi.getProducts();
      setTopProducts(products.slice(0, 5));
      
      // Load chart data
      const revenue = await analyticsApi.getRevenueData();
      setRevenueData(revenue);
      
      const orderStatus = await analyticsApi.getOrderStatusData();
      setOrderStatusData(orderStatus);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions for Quick Actions
  const handleNewOrder = () => {
    navigate('/admin/orders');
  };

  const handleAddProduct = () => {
    navigate('/admin/products');
  };

  const handleViewCustomers = () => {
    navigate('/admin/customers');
  };

  const handleViewAnalytics = () => {
    navigate('/admin/analytics');
  };

  const statsData = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      description: "This month",
      icon: DollarSign,
      trend: { value: stats.revenueChange, isPositive: stats.revenueChange >= 0 },
    },
    {
      title: "Orders",
      value: stats.totalOrders.toString(),
      description: "This month",
      icon: ShoppingCart,
      trend: { value: stats.ordersChange, isPositive: stats.ordersChange >= 0 },
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toString(),
      description: "Active customers",
      icon: Users,
      trend: { value: stats.customersChange, isPositive: stats.customersChange >= 0 },
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      description: "Active products",
      icon: Package,
      trend: { value: stats.productsChange, isPositive: stats.productsChange >= 0 },
    },
  ];

  if (loading) {
    return (
      <div className="admin-content flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <Button 
          onClick={loadDashboardData}
          variant="outline"
          className="flex items-center space-x-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [value, 'Orders']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Orders</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/admin/orders')}
                className="text-primary hover:text-primary/80"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/admin/orders')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(order.total_amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => navigate('/admin/orders')}
                      className="hover:bg-primary/10"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Top Products</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/admin/products')}
                className="text-primary hover:text-primary/80"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/admin/products')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(product.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Price
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate('/admin/products')}
                    className="hover:bg-primary/10"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={handleNewOrder}
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-sm">View Orders</span>
            </Button>
            <Button 
              onClick={handleAddProduct}
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-secondary/50 transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm">Manage Products</span>
            </Button>
            <Button 
              onClick={handleViewCustomers}
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-secondary/50 transition-colors"
            >
              <Users className="w-6 h-6" />
              <span className="text-sm">View Customers</span>
            </Button>
            <Button 
              onClick={handleViewAnalytics}
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-secondary/50 transition-colors"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { ordersApi } from "@/api/adminApi";
import { Order } from "@/lib/supabaseClient";
import { useRealtime } from "@/hooks/useRealtime";
import { BulkActions } from "@/components/BulkActions";
import { toast } from "react-hot-toast";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  MoreHorizontal,
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const statusOptions = ["all", "pending", "processing", "completed", "cancelled"];
const paymentOptions = ["all", "paid", "pending", "failed"];
const shippingOptions = ["all", "pending", "shipped", "delivered"];

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [shippingFilter, setShippingFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  // Real-time data
  const realtimeData = useRealtime();

  useEffect(() => {
    loadOrders();
  }, []);

  // Update orders when real-time data changes
  useEffect(() => {
    if (realtimeData.orders.length > 0) {
      const previousOrderCount = orders.length;
      setOrders(realtimeData.orders);
      
      // Show notification for new orders
      if (realtimeData.orders.length > previousOrderCount) {
        const newOrdersCount = realtimeData.orders.length - previousOrderCount;
        toast.success(`🎉 New order${newOrdersCount > 1 ? 's' : ''} received! ${newOrdersCount} order${newOrdersCount > 1 ? 's' : ''} just placed.`);
      }
    }
  }, [realtimeData.orders, orders.length]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.customer_email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.payment_status === paymentFilter;
    const matchesShipping = shippingFilter === "all" || order.shipping_status === shippingFilter;

    return matchesSearch && matchesStatus && matchesPayment && matchesShipping;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedOrders.length} orders?`)) {
      try {
        // In a real implementation, you would call the API to delete multiple orders
        console.log('Deleting orders:', selectedOrders);
        setSelectedOrders([]);
        await loadOrders(); // Reload orders
      } catch (error) {
        console.error('Error deleting orders:', error);
      }
    }
  };

  const handleBulkExport = () => {
    const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Total', 'Status', 'Date'],
      ...selectedOrdersData.map(order => [
        order.id,
        order.customer_name || '',
        order.customer_email || '',
        order.total_amount?.toString() || '',
        order.status,
        order.created_at
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkEdit = () => {
    // In a real implementation, you would open a modal for bulk editing
    console.log('Bulk editing orders:', selectedOrders);
  };

  const getStatusIcon = (status?: string) => {
    if (!status) return <ShoppingCart className="w-4 h-4 text-gray-600" />;
    
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "processing":
        return <Package className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <ShoppingCart className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="admin-content flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">Manage customer orders and track fulfillment</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadOrders}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === "pending").length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === "processing").length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === "completed").length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedItems={selectedOrders}
        totalItems={filteredOrders.length}
        onSelectAll={handleSelectAll}
        onDelete={handleBulkDelete}
        onExport={handleBulkExport}
        onBulkEdit={handleBulkEdit}
        onClearSelection={() => setSelectedOrders([])}
        itemType="orders"
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Payment</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {paymentOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Shipping</label>
              <select
                value={shippingFilter}
                onChange={(e) => setShippingFilter(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {shippingOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                    />
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name || 'Unknown Customer'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total_amount || 0)}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status || 'Unknown'}
                    </span>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">Contact</p>
                    <p className="text-muted-foreground">{order.customer_email || 'No email'}</p>
                    <p className="text-muted-foreground">{order.shipping_info?.phone || 'No phone'}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Payment</p>
                    <p className="text-muted-foreground">Status: {order.payment_status || 'Unknown'}</p>
                    <p className="text-muted-foreground">Reference: {order.payment_reference || 'No reference'}</p>
                    <p className="text-muted-foreground">Method: Paystack</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Shipping</p>
                    <p className="text-muted-foreground truncate">{order.shipping_address || 'No address'}</p>
                    <p className="text-muted-foreground">
                      {order.shipping_info?.shippingService ? 
                        `${order.shipping_info.shippingService.charAt(0).toUpperCase() + order.shipping_info.shippingService.slice(1)} (₦${order.shipping_info.shippingCost?.toLocaleString()})` : 
                        'Standard'
                      }
                    </p>
                    <p className="text-muted-foreground text-xs">{order.shipping_info?.shippingZone || 'Unknown zone'}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Order Summary</p>
                    <p className="text-muted-foreground">Subtotal: ₦{(order.subtotal || 0).toLocaleString()}</p>
                    <p className="text-muted-foreground">Shipping: ₦{(order.shipping_info?.shippingCost || 0).toLocaleString()}</p>
                    <p className="text-muted-foreground font-medium">Total: ₦{order.total_amount?.toLocaleString()}</p>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Items:</p>
                      {order.items && order.items.length > 0 ? (
                        <div className="space-y-1">
                          {order.items.slice(0, 3).map((item: any, index: number) => (
                            <div key={index} className="text-xs text-muted-foreground flex justify-between">
                              <span className="truncate max-w-[120px]">
                                {item.quantity}x {item.name || item.productName || 'Unknown Product'}
                              </span>
                              <span>₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{order.items.length - 3} more items
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No items</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
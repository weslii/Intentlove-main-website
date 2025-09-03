import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Order } from "@/lib/supabaseClient";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { Copy, Check } from "lucide-react";

interface OrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderId: string, updates: Partial<Order>) => Promise<void>;
  mode: 'view' | 'edit';
}

export const OrderModal: React.FC<OrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onSave,
  mode
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Order>>({});
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  React.useEffect(() => {
    if (order) {
      setFormData({
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        status: order.status,
        payment_status: order.payment_status,
        shipping_status: order.shipping_status,
        shipping_address: order.shipping_address,
        total_amount: order.total_amount,
        subtotal: order.subtotal,
      });
    }
  }, [order]);

  const handleSave = async () => {
    if (!order) return;
    
    setLoading(true);
    try {
      await onSave(order.id, formData);
      toast.success('Order updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update order');
      console.error('Error updating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(link);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'view' ? 'Order Details' : 'Edit Order'} - {order.id.substring(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Information</h3>
            
            <div>
              <Label>Customer Name</Label>
              {mode === 'view' ? (
                <p className="text-sm text-muted-foreground">{order.customer_name}</p>
              ) : (
                <Input
                  value={formData.customer_name || ''}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                />
              )}
            </div>

            <div>
              <Label>Email</Label>
              {mode === 'view' ? (
                <p className="text-sm text-muted-foreground">{order.customer_email}</p>
              ) : (
                <Input
                  value={formData.customer_email || ''}
                  onChange={(e) => handleInputChange('customer_email', e.target.value)}
                />
              )}
            </div>

            <div>
              <Label>Phone</Label>
              <p className="text-sm text-muted-foreground">
                {order.shipping_info?.phone || 'No phone'}
              </p>
            </div>
          </div>

          {/* Order Status */}
          <div className="space-y-4">
            <h3 className="font-semibold">Order Status</h3>
            
            <div>
              <Label>Order Status</Label>
              {mode === 'view' ? (
                <p className="text-sm text-muted-foreground">{order.status}</p>
              ) : (
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label>Payment Status</Label>
              {mode === 'view' ? (
                <p className="text-sm text-muted-foreground">{order.payment_status}</p>
              ) : (
                <Select value={formData.payment_status} onValueChange={(value) => handleInputChange('payment_status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label>Shipping Status</Label>
              {mode === 'view' ? (
                <p className="text-sm text-muted-foreground">{order.shipping_status}</p>
              ) : (
                <Select value={formData.shipping_status} onValueChange={(value) => handleInputChange('shipping_status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shipping status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Shipping Information</h3>
            
            <div>
              <Label>Shipping Address</Label>
              {mode === 'view' ? (
                <p className="text-sm text-muted-foreground">{order.shipping_address}</p>
              ) : (
                <Textarea
                  value={formData.shipping_address || ''}
                  onChange={(e) => handleInputChange('shipping_address', e.target.value)}
                  rows={3}
                />
              )}
            </div>

            <div>
              <Label>Shipping Service</Label>
              <p className="text-sm text-muted-foreground">
                {order.shipping_info?.shippingService ? 
                  `${order.shipping_info.shippingService.charAt(0).toUpperCase() + order.shipping_info.shippingService.slice(1)}` : 
                  'Standard'
                }
              </p>
            </div>

            <div>
              <Label>Shipping Zone</Label>
              <p className="text-sm text-muted-foreground">
                {order.shipping_info?.shippingZone || 'Unknown zone'}
              </p>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Financial Information</h3>
            
            <div>
              <Label>Subtotal</Label>
              {mode === 'view' ? (
                <p className="text-sm text-muted-foreground">{formatCurrency(order.subtotal || 0)}</p>
              ) : (
                <Input
                  type="number"
                  value={formData.subtotal || 0}
                  onChange={(e) => handleInputChange('subtotal', parseFloat(e.target.value))}
                />
              )}
            </div>

            <div>
              <Label>Shipping Cost</Label>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(order.shipping_info?.shippingCost || 0)}
              </p>
            </div>

            <div>
              <Label>Total Amount</Label>
              {mode === 'view' ? (
                <p className="text-sm text-muted-foreground font-medium">{formatCurrency(order.total_amount || 0)}</p>
              ) : (
                <Input
                  type="number"
                  value={formData.total_amount || 0}
                  onChange={(e) => handleInputChange('total_amount', parseFloat(e.target.value))}
                />
              )}
            </div>

            <div>
              <Label>Payment Reference</Label>
              <p className="text-sm text-muted-foreground">{order.payment_reference}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Order Items</h3>
          <div className="space-y-2">
            {order.items && order.items.length > 0 ? (
                             order.items.map((item: any, index: number) => (
                 <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                   <div className="flex-1">
                     <p className="font-medium">
                       {item.quantity}x {item.name || item.productName || item.productId || 'Unknown Product'}
                     </p>
                     {item.customLink && (
                       <div className="flex items-center gap-2 mt-1">
                         <p className="text-xs text-muted-foreground">Custom Link:</p>
                         <div className="flex items-center gap-1">
                           <a 
                             href={item.customLink} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-xs text-blue-600 hover:text-blue-800 underline truncate max-w-[200px]"
                           >
                             {item.customLink}
                           </a>
                           <Button
                             variant="ghost"
                             size="sm"
                             className="h-6 w-6 p-0"
                             onClick={() => handleCopyLink(item.customLink)}
                           >
                             {copiedLink === item.customLink ? (
                               <Check className="h-3 w-3 text-green-600" />
                             ) : (
                               <Copy className="h-3 w-3" />
                             )}
                           </Button>
                         </div>
                       </div>
                     )}
                   </div>
                   <p className="font-medium ml-4">
                     {formatCurrency((item.price || 0) * (item.quantity || 1))}
                   </p>
                 </div>
               ))
            ) : (
              <p className="text-muted-foreground">No items</p>
            )}
          </div>
        </div>

        {/* Order Metadata */}
        <div className="mt-6 text-sm text-muted-foreground">
          <p>Created: {formatDate(order.created_at)}</p>
          <p>Last Updated: {formatDate(order.updated_at)}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {mode === 'edit' && (
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

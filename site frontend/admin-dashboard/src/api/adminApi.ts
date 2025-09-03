import { supabase, Order, Product, Customer } from '@/lib/supabaseClient';

export const ordersApi = {
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform the data to include computed fields for admin display
    return (data || []).map(order => ({
      ...order,
      // Handle both old format (shipping_info) and new format (separate columns)
      customer_name: order.customer_name || order.shipping_info?.fullName || 'Unknown',
      customer_email: order.customer_email || order.shipping_info?.email || 'Unknown',
      total_amount: order.total_amount || (order.subtotal || 0) + (order.shipping_info?.shippingCost || 0),
      shipping_address: order.shipping_address || `${order.shipping_info?.address || ''}, ${order.shipping_info?.city || ''}, ${order.shipping_info?.state || ''}`.trim(),
      payment_status: order.status === 'completed' ? 'paid' : 'pending'
    }));
  },

  async getOrder(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getOrdersStats() {
    const { data, error } = await supabase
      .from('orders')
      .select('status, total_amount, created_at');
    
    if (error) throw error;
    return data || [];
  }
};

export const productsApi = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async toggleProductActive(id: string, active: boolean): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ active })
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const customersApi = {
  async getCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getCustomer(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createCustomer(customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const analyticsApi = {
  async getDashboardStats() {
    // Get current month stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Get last month stats for comparison
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current month orders
    const { data: currentOrders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', startOfMonth.toISOString())
      .lte('created_at', endOfMonth.toISOString());

    if (ordersError) throw ordersError;

    // Last month orders
    const { data: lastMonthOrders, error: lastMonthError } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', startOfLastMonth.toISOString())
      .lte('created_at', endOfLastMonth.toISOString());

    if (lastMonthError) throw lastMonthError;

    // Products count
    const { count: productsCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (productsError) throw productsError;

    // Customers count
    const { count: customersCount, error: customersError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    if (customersError) throw customersError;

    // Calculate stats
    const currentRevenue = currentOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    const lastMonthRevenue = lastMonthOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    const revenueChange = lastMonthRevenue > 0 ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    const currentOrdersCount = currentOrders?.length || 0;
    const lastMonthOrdersCount = lastMonthOrders?.length || 0;
    const ordersChange = lastMonthOrdersCount > 0 ? ((currentOrdersCount - lastMonthOrdersCount) / lastMonthOrdersCount) * 100 : 0;

    return {
      totalRevenue: currentRevenue,
      totalOrders: currentOrdersCount,
      totalCustomers: customersCount || 0,
      totalProducts: productsCount || 0,
      revenueChange,
      ordersChange,
      customersChange: 0, // Placeholder - would need customer creation dates
      productsChange: 0, // Placeholder - would need product creation dates
    };
  },

  async getRevenueData() {
    // Get last 7 days of revenue data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const { data, error } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by date and sum revenue
    const revenueByDate = data?.reduce((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + (order.total_amount || 0);
      return acc;
    }, {} as Record<string, number>) || {};

    // Convert to array format for charts
    return Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  },

  async getOrderStatusData() {
    const { data, error } = await supabase
      .from('orders')
      .select('status');

    if (error) throw error;

    // Count orders by status
    const statusCounts = data?.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Convert to array format for charts
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  },

  async getTopProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('price', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data || [];
  }
}; 
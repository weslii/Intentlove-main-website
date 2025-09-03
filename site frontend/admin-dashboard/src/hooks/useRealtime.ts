import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Order, Product, Customer } from '@/lib/supabaseClient';

interface RealtimeData {
  orders: Order[];
  products: Product[];
  customers: Customer[];
}

export const useRealtime = () => {
  const [data, setData] = useState<RealtimeData>({
    orders: [],
    products: [],
    customers: [],
  });

  useEffect(() => {
    // Load initial data
    const loadInitialData = async () => {
      try {
        const [ordersData, productsData, customersData] = await Promise.all([
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('products').select('*').order('name'),
          supabase.from('customers').select('*').order('created_at', { ascending: false })
        ]);

        setData({
          orders: ordersData.data || [],
          products: productsData.data || [],
          customers: customersData.data || [],
        });
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();

    // Subscribe to orders changes
    const ordersSubscription = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Orders change:', payload);
          
          if (payload.eventType === 'INSERT') {
            // New order placed
            setData(prev => ({
              ...prev,
              orders: [payload.new as Order, ...prev.orders]
            }));
          } else if (payload.eventType === 'UPDATE') {
            // Order updated
            setData(prev => ({
              ...prev,
              orders: prev.orders.map(order => 
                order.id === payload.new.id ? payload.new as Order : order
              )
            }));
          } else if (payload.eventType === 'DELETE') {
            // Order deleted
            setData(prev => ({
              ...prev,
              orders: prev.orders.filter(order => order.id !== payload.old.id)
            }));
          }
        }
      )
      .subscribe();

    // Subscribe to products changes
    const productsSubscription = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Products change:', payload);
        }
      )
      .subscribe();

    // Subscribe to customers changes
    const customersSubscription = supabase
      .channel('customers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers',
        },
        (payload) => {
          console.log('Customers change:', payload);
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      ordersSubscription.unsubscribe();
      productsSubscription.unsubscribe();
      customersSubscription.unsubscribe();
    };
  }, []);

  return data;
}; 
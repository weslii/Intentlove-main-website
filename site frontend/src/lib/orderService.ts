import { supabase } from './supabaseClient';
import { CartItem } from '@/hooks/use-cart-store';

export type ShippingInfo = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
};

export type OrderDetails = {
  items: CartItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  paymentReference: string;
  userId?: string; // Optional, only for logged-in users
};

// Create a new order in the database
export async function createOrder(orderDetails: OrderDetails) {
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        items: orderDetails.items,
        shipping_info: orderDetails.shippingInfo,
        subtotal: orderDetails.subtotal,
        payment_reference: orderDetails.paymentReference,
        user_id: orderDetails.userId || null,
        status: 'completed',
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) throw error;
  return data?.[0];
}

// Get orders for a specific user
export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Create a new user account
export async function createUserAccount(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

// Sign in a user
export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Sign out a user
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get the current user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data?.user;
}
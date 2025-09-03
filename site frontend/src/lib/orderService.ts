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
  shippingService?: 'standard' | 'express';
  shippingCost?: number;
  shippingZone?: string;
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
        status: 'pending',
        created_at: new Date().toISOString(),
        // Extract required fields from shipping_info for database compatibility
        customer_name: orderDetails.shippingInfo.fullName,
        customer_email: orderDetails.shippingInfo.email,
        shipping_address: `${orderDetails.shippingInfo.address}, ${orderDetails.shippingInfo.city}, ${orderDetails.shippingInfo.state}`.trim(),
        total_amount: orderDetails.subtotal + (orderDetails.shippingInfo.shippingCost || 0),
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

// Link existing orders to a user account based on email
export async function linkOrdersToUser(userId: string, email: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ user_id: userId })
    .eq('customer_email', email)
    .is('user_id', null)
    .select();

  if (error) throw error;
  return data;
}

// Create a new user account and automatically sign them in
export async function createUserAccount(email: string, password: string, fullName: string) {
  // First, create the account
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

  // If account creation is successful, automatically sign in the user
  if (data.user) {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // If auto-signin fails, still return the created user data
      console.warn("Account created but auto-signin failed:", signInError);
      return data;
    }

    // Link any existing orders with the same email to this user account
    try {
      await linkOrdersToUser(data.user.id, email);
    } catch (linkError) {
      console.warn("Failed to link existing orders:", linkError);
      // Don't throw error here as account creation was successful
    }

    return signInData;
  }

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
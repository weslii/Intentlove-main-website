import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://htnxqfnzirxxvuepdaof.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bnhxZm56aXJ4eHZ1ZXBkYW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MjQ5ODIsImV4cCI6MjA2ODUwMDk4Mn0.kImw6EMpRm2AXnyzbi4usJCO3zolrJRpvW9g5JMrZJY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name for product media
// Change this to match your actual bucket name in Supabase
export const PRODUCT_MEDIA_BUCKET = 'product-media';

// Type definitions for admin dashboard
export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

// Updated Product interface to match your existing structure
export type ProductType = 'jar' | 'card' | 'flower_stem' | 'bouquet';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  theme?: string; // e.g., "Romantic", "Birthday", "Anniversary", "Apology"
  description?: string;
  image: string;
  images: string[];
  price: number;
  originalprice?: number;
  isonsale?: boolean;
  isfavorite?: boolean;
  active?: boolean; // Whether the product is active/visible on the website
  size?: 'regular' | 'mega' | 'super';
  tags?: string[];
}

// Media upload functions
export interface UploadedMedia {
  url: string;
  type: 'image' | 'video';
  filename: string;
}

export async function uploadMedia(file: File): Promise<UploadedMedia> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  // Determine media type
  const isVideo = file.type.startsWith('video/');
  const mediaType = isVideo ? 'video' : 'image';

  const { data, error } = await supabase.storage
    .from(PRODUCT_MEDIA_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(PRODUCT_MEDIA_BUCKET)
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    type: mediaType,
    filename: fileName
  };
}

export async function deleteMedia(filename: string): Promise<void> {
  const { data, error } = await supabase.storage
    .from(PRODUCT_MEDIA_BUCKET)
    .remove([filename]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
}

export async function listMedia(): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(PRODUCT_MEDIA_BUCKET)
    .list();

  if (error) {
    throw new Error(`List failed: ${error.message}`);
  }

  return data.map(file => file.name);
}



export interface Order {
  id: string;
  items: any[]; // Cart items with product details
  shipping_info: {
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
  subtotal: number;
  payment_reference: string; // Paystack transaction reference
  user_id?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_status: 'pending' | 'shipped' | 'delivered';
  created_at: string;
  updated_at: string;
  
  // Computed fields for admin display
  customer_name?: string;
  customer_email?: string;
  total_amount?: number;
  shipping_address?: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
} 
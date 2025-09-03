import { supabase } from './supabaseClient';

export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*').eq('active', true);
  if (error) throw error;
  return data;
}

export async function fetchProductById(id: string) {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).eq('active', true).single();
  if (error) throw error;
  return data;
} 
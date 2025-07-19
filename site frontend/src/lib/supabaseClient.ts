import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://htnxqfnzirxxvuepdaof.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bnhxZm56aXJ4eHZ1ZXBkYW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MjQ5ODIsImV4cCI6MjA2ODUwMDk4Mn0.kImw6EMpRm2AXnyzbi4usJCO3zolrJRpvW9g5JMrZJY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://htnxqfnzirxxvuepdaof.supabase.co';
// Replace this with your actual service_role key from Supabase dashboard
// Go to Settings → API → Copy the service_role key (not the anon key)
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bnhxZm56aXJ4eHZ1ZXBkYW9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjkyNDk4MiwiZXhwIjoyMDY4NTAwOTgyfQ.Ohlmk6zGDfs1OMgIc8pf8VJYLLCli03RV2qnvJ5D6yY'; // Replace this!

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdminUser() {
  try {
    console.log('Setting up admin user...');
    
    // Create the admin user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@intentlove.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin'
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    console.log('Auth user created successfully:', authData.user.id);

    // Insert admin user record into admin_users table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .insert({
        id: authData.user.id,
        email: 'admin@intentlove.com',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin'
      });

    if (adminError) {
      console.error('Error creating admin user record:', adminError);
      return;
    }

    console.log('Admin user record created successfully');
    console.log('Admin user setup complete!');
    console.log('Email: admin@intentlove.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
}

setupAdminUser(); 
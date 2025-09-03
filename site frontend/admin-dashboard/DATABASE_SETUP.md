# Database Setup Guide for Intentlove Admin Dashboard

This guide will help you set up a production-ready database for the admin dashboard.

## Prerequisites

1. **Supabase Account**: You need access to your Supabase project
2. **Service Role Key**: You'll need the service role key from your Supabase dashboard
3. **Existing Products Table**: This setup assumes you already have a products table

## Step 1: Set Up Database Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to the **SQL Editor** tab
4. Copy and paste the contents of `database-setup.sql` into the editor
5. Click **Run** to execute the SQL script

This will create:
- `admin_users` table for admin authentication
- `orders` table for order management
- `customers` table for customer data
- Row Level Security (RLS) policies for data protection
- Sample data for testing

**Note**: The script will NOT modify your existing `products` table. It will only add RLS policies to it.

## Step 2: Get Your Service Role Key

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the **service_role** key (not the anon key)
3. Replace `YOUR_SERVICE_ROLE_KEY` in `setup-admin-user.js` with your actual service role key

## Step 3: Create Admin User

### Option A: Using the Script (Recommended)

1. Install dependencies:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Run the setup script:
   ```bash
   node setup-admin-user.js
   ```

### Option B: Manual Setup

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **Add User**
3. Enter:
   - Email: `admin@intentlove.com`
   - Password: `admin123`
4. Click **Create User**
5. Copy the user ID
6. Go to **Table Editor** → **admin_users**
7. Insert a new row with:
   - id: (the user ID you copied)
   - email: `admin@intentlove.com`
   - first_name: `Admin`
   - last_name: `User`
   - role: `admin`

## Step 4: Test the Login

1. Start your admin dashboard:
   ```bash
   npm run dev
   ```

2. Go to the login page
3. Use these credentials:
   - Email: `admin@intentlove.com`
   - Password: `admin123`

## Production Security Considerations

### 1. Change Default Password
After first login, immediately change the admin password through the admin dashboard settings.

### 2. Environment Variables
For production, move your Supabase credentials to environment variables:

```env
VITE_SUPABASE_URL=https://htnxqfnzirxxvuepdaof.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Row Level Security
The database is set up with RLS policies that ensure:
- Only authenticated admin users can access data
- Users can only access data they're authorized to see
- All operations are logged and auditable

### 4. Backup Strategy
Set up regular backups in your Supabase dashboard:
1. Go to **Settings** → **Database**
2. Configure automated backups
3. Set up point-in-time recovery

## Database Schema Overview

### admin_users
- Stores admin user profiles
- Links to Supabase Auth users
- Includes role-based permissions

### orders
- Tracks all customer orders
- Includes payment and shipping status
- Links to customers

### products (existing)
- Your existing product catalog
- Includes all your current product data
- Now has RLS policies for admin access

### customers
- Customer information
- Order history tracking
- Contact details

## Existing Products Table Structure

Your existing products table should have these columns:
- `id` (string)
- `name` (string)
- `type` (ProductType: 'jar' | 'card' | 'flower_stem' | 'bouquet')
- `theme` (optional string)
- `description` (optional string)
- `image` (string)
- `images` (string array)
- `price` (number)
- `originalPrice` (optional number)
- `isOnSale` (optional boolean)
- `isFavorite` (optional boolean)
- `size` (optional: 'regular' | 'mega' | 'super')
- `tags` (optional string array)

## Troubleshooting

### "Invalid credentials" error
1. Check that the admin user exists in Supabase Auth
2. Verify the admin_users table has the correct user record
3. Ensure the user's email is confirmed

### "Permission denied" errors
1. Check that RLS policies are properly set up
2. Verify the user is authenticated
3. Ensure the user has admin role

### Database connection issues
1. Verify your Supabase URL and keys are correct
2. Check that your Supabase project is active
3. Ensure your IP is not blocked by Supabase

### Products table issues
1. Verify your existing products table has the expected columns
2. Check that RLS policies were applied to the products table
3. Ensure the admin user can access the products table

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Verify all SQL scripts executed successfully
3. Test the connection with the Supabase client
4. Check the browser console for error messages

## Next Steps

After successful setup:
1. Customize the admin dashboard branding
2. Add more admin users as needed
3. Configure email notifications
4. Set up monitoring and analytics
5. Implement additional security measures 
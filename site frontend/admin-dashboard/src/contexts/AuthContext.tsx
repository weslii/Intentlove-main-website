import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, AdminUser } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      console.log('Getting initial session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session:', session);
      setUser(session?.user ?? null);
      
              if (session?.user) {
          await fetchAdminUser(session.user.id);
        } else {
          console.log('No session found, setting loading to false');
        }
        
        console.log('Setting loading to false after initial session check');
        setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchAdminUser(session.user.id);
        } else {
          setAdminUser(null);
        }
        
        // Always set loading to false after auth state change
        console.log('Setting loading to false after auth state change');
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchAdminUser = async (userId: string) => {
    try {
      console.log('Fetching admin user for userId:', userId);
      
      // First, let's check if the admin_users table exists by trying a simple query
      console.log('Testing admin_users table access...');
      
      try {
        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 3000)
        );
        
        const queryPromise = supabase
          .from('admin_users')
          .select('count')
          .limit(1);
        
        const { data: testData, error: testError } = await Promise.race([
          queryPromise,
          timeoutPromise
        ]) as any;
        
        console.log('Table access test result:', { testData, testError });
        
        if (testError) {
          console.error('Cannot access admin_users table:', testError);
          // If we can't access the table, just set adminUser to null and continue
          setAdminUser(null);
          return;
        }
      } catch (tableError) {
        console.error('Table access error:', tableError);
        setAdminUser(null);
        return;
      }
      
      // Try to find by email first (most common approach)
      const user = await supabase.auth.getUser();
      console.log('Current user:', user.data.user);
      
      if (user.data.user?.email) {
        console.log('Trying to find admin user by email:', user.data.user.email);
        
        try {
          const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', user.data.user.email)
            .single();
          
          console.log('Query by email result:', { data, error });
          
                  if (!error && data) {
          console.log('Setting admin user:', data);
          setAdminUser(data);
          console.log('Admin user set successfully, authentication complete');
          return;
        }
        } catch (emailError) {
          console.error('Email query error:', emailError);
        }
      }
      
      // If email lookup failed, try by user_id
      console.log('Trying to find admin user by user_id:', userId);
      
      try {
        const { data: dataByUserId, error: errorByUserId } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        console.log('Query by user_id result:', { dataByUserId, errorByUserId });
        
        if (!errorByUserId && dataByUserId) {
          console.log('Setting admin user:', dataByUserId);
          setAdminUser(dataByUserId);
          return;
        }
      } catch (userIdError) {
        console.error('User ID query error:', userIdError);
      }
      
      // If user_id lookup failed, try by id
      console.log('Trying to find admin user by id:', userId);
      
      try {
        const { data: dataById, error: errorById } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', userId)
          .single();
        
        console.log('Query by id result:', { dataById, errorById });
        
        if (!errorById && dataById) {
          console.log('Setting admin user:', dataById);
          setAdminUser(dataById);
          return;
        }
      } catch (idError) {
        console.error('ID query error:', idError);
      }
      
      // If all lookups failed, set to null
      console.log('No admin user found, setting to null');
      setAdminUser(null);
      
    } catch (error) {
      console.error('Error fetching admin user:', error);
      setAdminUser(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in result:', { data, error });

      if (error) {
        return { error };
      }

      // If sign in successful, the onAuthStateChange will handle the rest
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    adminUser,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
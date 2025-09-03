import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Dashboard } from "@/pages/Dashboard";
import { Orders } from "@/pages/Orders";
import { Products } from "@/pages/Products";
import { Reports } from "@/pages/Reports";
import { Payments } from "@/pages/Payments";
import { Login } from "@/pages/Login";
import { Shipping } from "@/pages/Shipping";
import { Notifications } from "@/pages/Notifications";
import { Settings } from "@/pages/Settings";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="admin-main">
                  {/* Sidebar */}
                  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                  {/* Main content area */}
                  <div className="lg:ml-64 min-h-screen">
                    {/* Header */}
                    <Header onMenuToggle={toggleSidebar} />

                    {/* Page content */}
                    <main className="admin-main">
                      <Routes>
                        <Route path="/admin" element={<Dashboard />} />
                        <Route path="/admin/orders" element={<Orders />} />
                        <Route path="/admin/products" element={<Products />} />
                        <Route path="/admin/reports" element={<Reports />} />
                        <Route path="/admin/payments" element={<Payments />} />
                        <Route path="/admin/shipping" element={<Shipping />} />
                        <Route path="/admin/notifications" element={<Notifications />} />
                        <Route path="/admin/settings" element={<Settings />} />
                        <Route path="/" element={<Navigate to="/admin" replace />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

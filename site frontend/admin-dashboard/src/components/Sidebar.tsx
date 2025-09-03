import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useRealtime } from "@/hooks/useRealtime";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  FileText,
  Truck,
  CreditCard,
  Bell,
  LogOut,
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const realtimeData = useRealtime();

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      badge: realtimeData.orders.length,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: FileText,
    },
    {
      title: "Shipping",
      href: "/admin/shipping",
      icon: Truck,
    },
    {
      title: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">
                I
              </span>
            </div>
            <span className="font-semibold text-lg">Intentlove Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "admin-sidebar-item",
                  isActive && "active"
                )}
                onClick={() => {
                  // Close sidebar on mobile when item is clicked
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <span className="bg-sidebar-primary text-sidebar-primary-foreground text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <button className="admin-sidebar-item w-full">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}; 
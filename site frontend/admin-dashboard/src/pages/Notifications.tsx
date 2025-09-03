import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Settings,
  Trash2,
  Archive,
  Filter,
  Search
} from 'lucide-react';

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-001 has been placed by John Doe',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    priority: 'high',
    category: 'orders'
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Successful',
    message: 'Payment of ₦45,000 received for Order #ORD-001',
    timestamp: '2024-01-15T10:35:00Z',
    read: true,
    priority: 'medium',
    category: 'payments'
  },
  {
    id: 3,
    type: 'inventory',
    title: 'Low Stock Alert',
    message: 'Romantic Jar is running low on stock (5 items remaining)',
    timestamp: '2024-01-15T09:15:00Z',
    read: false,
    priority: 'high',
    category: 'inventory'
  },
  {
    id: 4,
    type: 'shipping',
    title: 'Order Shipped',
    message: 'Order #ORD-002 has been shipped via DHL Express',
    timestamp: '2024-01-15T08:45:00Z',
    read: true,
    priority: 'medium',
    category: 'shipping'
  },
  {
    id: 5,
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight at 2:00 AM',
    timestamp: '2024-01-15T07:30:00Z',
    read: false,
    priority: 'low',
    category: 'system'
  }
];

const notificationSettings = [
  {
    category: 'Orders',
    email: true,
    push: true,
    sms: false
  },
  {
    category: 'Payments',
    email: true,
    push: true,
    sms: true
  },
  {
    category: 'Inventory',
    email: true,
    push: false,
    sms: false
  },
  {
    category: 'Shipping',
    email: true,
    push: true,
    sms: false
  },
  {
    category: 'System',
    email: false,
    push: true,
    sms: false
  }
];

export const Notifications: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRead, setShowRead] = useState(true);
  const [settings, setSettings] = useState(notificationSettings);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'inventory':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'shipping':
        return <Mail className="w-5 h-5 text-purple-600" />;
      case 'system':
        return <Info className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
    const matchesReadStatus = showRead || !notification.read;
    return matchesCategory && matchesReadStatus;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleMarkAsRead = (id: number) => {
    // In real app, this would update the database
    console.log('Mark as read:', id);
  };

  const handleDeleteNotification = (id: number) => {
    // In real app, this would delete from database
    console.log('Delete notification:', id);
  };

  const handleSettingChange = (categoryIndex: number, setting: string, value: boolean) => {
    const newSettings = [...settings];
    newSettings[categoryIndex] = {
      ...newSettings[categoryIndex],
      [setting]: value
    };
    setSettings(newSettings);
  };

  return (
    <div className="admin-content">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Manage your notification preferences and view alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            {unreadCount} unread
          </Badge>
          <Button variant="outline" size="sm">
            <Archive className="w-4 h-4 mr-2" />
            Archive All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="payments">Payments</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-read"
                    checked={showRead}
                    onCheckedChange={setShowRead}
                  />
                  <label htmlFor="show-read" className="text-sm">
                    Show read notifications
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-4 p-4 rounded-lg border ${
                      notification.read ? 'bg-muted/30' : 'bg-background'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-sm font-medium ${
                            notification.read ? 'text-muted-foreground' : 'text-foreground'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                          {getPriorityBadge(notification.priority)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${
                        notification.read ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose how you want to receive notifications for different events
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {settings.map((setting, index) => (
                  <div key={setting.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{setting.category}</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for {setting.category.toLowerCase()} events
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`email-${index}`}
                          checked={setting.email}
                          onCheckedChange={(value) => handleSettingChange(index, 'email', value)}
                        />
                        <label htmlFor={`email-${index}`} className="text-sm">Email</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`push-${index}`}
                          checked={setting.push}
                          onCheckedChange={(value) => handleSettingChange(index, 'push', value)}
                        />
                        <label htmlFor={`push-${index}`} className="text-sm">Push</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`sms-${index}`}
                          checked={setting.sms}
                          onCheckedChange={(value) => handleSettingChange(index, 'sms', value)}
                        />
                        <label htmlFor={`sms-${index}`} className="text-sm">SMS</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Quiet Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      Don't send notifications between 10 PM and 8 AM
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Weekly Digest</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive a summary of all notifications every Sunday
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
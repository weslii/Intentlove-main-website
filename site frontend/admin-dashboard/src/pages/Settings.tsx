import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Shield, 
  Store, 
  Settings as SettingsIcon,
  Camera,
  Key,
  Globe,
  CreditCard,
  Bell,
  Palette,
  Database,
  Download,
  Upload,
  Trash2
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@intentlove.com',
    phone: '+234 801 234 5678',
    avatar: ''
  });

  const [storeSettings, setStoreSettings] = useState({
    storeName: 'IntentLove Shop',
    storeDescription: 'Premium romantic gifts and custom cards',
    currency: 'NGN',
    timezone: 'Africa/Lagos',
    language: 'en',
    maintenanceMode: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    emailNotifications: true,
    sessionTimeout: '24',
    passwordExpiry: '90'
  });

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStoreUpdate = (field: string, value: string | boolean) => {
    setStoreSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityUpdate = (field: string, value: string | boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="admin-content">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and store preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update your personal information and contact details
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-lg">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure your store settings and preferences
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => handleStoreUpdate('storeName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={storeSettings.currency} onValueChange={(value) => handleStoreUpdate('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={storeSettings.timezone} onValueChange={(value) => handleStoreUpdate('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Lagos">Africa/Lagos</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={storeSettings.language} onValueChange={(value) => handleStoreUpdate('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Store Description</Label>
                <Textarea
                  id="description"
                  value={storeSettings.storeDescription}
                  onChange={(e) => handleStoreUpdate('storeDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Maintenance Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable the store for maintenance
                  </p>
                </div>
                <Switch
                  checked={storeSettings.maintenanceMode}
                  onCheckedChange={(value) => handleStoreUpdate('maintenanceMode', value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your account security and authentication preferences
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(value) => handleSecurityUpdate('twoFactorAuth', value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive security alerts via email
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.emailNotifications}
                    onCheckedChange={(value) => handleSecurityUpdate('emailNotifications', value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Select value={securitySettings.sessionTimeout} onValueChange={(value) => handleSecurityUpdate('sessionTimeout', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="168">1 week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Select value={securitySettings.passwordExpiry} onValueChange={(value) => handleSecurityUpdate('passwordExpiry', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline">
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Security Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Customize the look and feel of your admin dashboard
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">Light</Button>
                    <Button variant="outline" className="flex-1">Dark</Button>
                    <Button variant="outline" className="flex-1">Auto</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full cursor-pointer"></div>
                    <div className="w-8 h-8 bg-green-600 rounded-full cursor-pointer"></div>
                    <div className="w-8 h-8 bg-purple-600 rounded-full cursor-pointer"></div>
                    <div className="w-8 h-8 bg-orange-600 rounded-full cursor-pointer"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Compact Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Reduce spacing for a more compact layout
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Show Animations</h4>
                  <p className="text-sm text-muted-foreground">
                    Enable smooth animations and transitions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Advanced configuration options for power users
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Debug Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging and debugging information
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Auto Backup</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically backup data daily
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Performance Monitoring</h4>
                    <p className="text-sm text-muted-foreground">
                      Track system performance and usage
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Data Management</h4>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                  <Button variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
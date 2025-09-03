import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Plus,
  Edit,
  Trash2,
  Calculator,
  Save,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { findShippingZone, calculateShippingRate as calculateShippingRateUtil, findZoneByAddressFallback } from '@/lib/shippingUtils';

// Shipping Zone Types
interface ShippingZone {
  id: string;
  name: string;
  description: string;
  center_coordinates: { lat: number; lng: number };
  radius_km: number;
  rates: {
    standard: number;
    express: number;
  };
  delivery_times: {
    standard: string;
    express: string;
  };
  active: boolean;
  created_at: string;
}

interface ShippingRate {
  zone_id: string;
  zone_name: string;
  weight_range: string;
  standard: number;
  express: number;
  overnight: number;
}



// Default shipping zones for Nigeria
const defaultZones: ShippingZone[] = [
  {
    id: "zone-1",
    name: "Lagos Metro",
    description: "Lagos and surrounding areas",
    center_coordinates: { lat: 6.5244, lng: 3.3792 },
    radius_km: 50,
    rates: {
    standard: 1500,
    express: 2500,
    },
    delivery_times: {
      standard: "3-5 business days",
      express: "1-2 business days",
    },
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "zone-2",
    name: "Abuja Capital",
    description: "Abuja and surrounding areas",
    center_coordinates: { lat: 9.0820, lng: 7.3986 },
    radius_km: 40,
    rates: {
    standard: 2000,
    express: 3000,
    },
    delivery_times: {
      standard: "4-6 business days",
      express: "2-3 business days",
    },
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "zone-3",
    name: "Port Harcourt",
    description: "Port Harcourt and surrounding areas",
    center_coordinates: { lat: 4.8156, lng: 7.0498 },
    radius_km: 35,
    rates: {
    standard: 1800,
    express: 2800,
    },
    delivery_times: {
      standard: "4-6 business days",
      express: "2-3 business days",
    },
    active: true,
    created_at: new Date().toISOString(),
  },
];

export const Shipping: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(defaultZones || []);
  const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null);
  const [isEditingZone, setIsEditingZone] = useState(false);
  const [newZone, setNewZone] = useState<Partial<ShippingZone>>({
    name: '',
    description: '',
    center_coordinates: { lat: 0, lng: 0 },
    radius_km: 50,
    rates: { standard: 0, express: 0 },
    delivery_times: { standard: '', express: '' },
    active: true,
  });

  // Rate Calculator State
  const [rateCalculator, setRateCalculator] = useState({
    location: '',
    service: 'standard' as 'standard' | 'express',
  });

  const [calculatedRate, setCalculatedRate] = useState<number | null>(null);

  // Load shipping zones from database
  useEffect(() => {
    loadShippingZones();
  }, []);

  // Debug zone editor state
  useEffect(() => {
    console.log('Zone editor state changed:', { isEditingZone, selectedZone });
  }, [isEditingZone, selectedZone]);

  const loadShippingZones = async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_zones')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setShippingZones(data);
      }
    } catch (error) {
      console.error('Error loading shipping zones:', error);
      // Keep using default zones if database is not set up
    }
  };

  const saveShippingZone = async (zone: ShippingZone) => {
    try {
      const { error } = await supabase
        .from('shipping_zones')
        .upsert([zone]);

      if (error) throw error;

      toast.success('Shipping zone saved successfully!');
      loadShippingZones();
      setIsEditingZone(false);
      setSelectedZone(null);
    } catch (error) {
      console.error('Error saving shipping zone:', error);
      toast.error('Failed to save shipping zone');
    }
  };

  const deleteShippingZone = async (zoneId: string) => {
    if (!confirm('Are you sure you want to delete this shipping zone?')) return;

    try {
      const { error } = await supabase
        .from('shipping_zones')
        .delete()
        .eq('id', zoneId);

      if (error) throw error;

      toast.success('Shipping zone deleted successfully!');
      loadShippingZones();
    } catch (error) {
      console.error('Error deleting shipping zone:', error);
      toast.error('Failed to delete shipping zone');
    }
  };

  const calculateShippingRate = async () => {
    const { location, service } = rateCalculator;
    
    if (!location.trim()) {
      toast.error('Please enter a valid address');
      return;
    }

    try {
      // Try Google Maps API first
      const result = await calculateShippingRateUtil(location, shippingZones, service);
      
      if (result) {
        setCalculatedRate(result.rate);
        toast.success(`Shipping rate calculated: ₦${result.rate.toLocaleString()} (${result.zone.name})`);
        return;
      }

      // Fallback to simple keyword matching
      const fallbackZone = findZoneByAddressFallback(location, shippingZones);
      if (fallbackZone) {
        const rate = fallbackZone.rates[service];
        setCalculatedRate(rate);
        toast.success(`Shipping rate calculated: ₦${rate.toLocaleString()} (${fallbackZone.name})`);
        return;
      }

      setCalculatedRate(null);
      toast.error('No shipping zone found for this address. Please check the address or contact support.');
    } catch (error) {
      console.error('Error calculating shipping rate:', error);
      toast.error('Error calculating shipping rate. Please try again.');
    }
  };



  return (
    <div className="admin-content">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Shipping Management</h1>
          <p className="text-muted-foreground">Manage shipping zones, rates, and track orders</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => {
            console.log('Add Zone button clicked');
            setIsEditingZone(true);
            setSelectedZone(null);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Zone
          </Button>
        </div>
      </div>

      <Tabs defaultValue="zones" className="space-y-6">
        <TabsList>
          <TabsTrigger value="zones">Shipping Zones</TabsTrigger>
          <TabsTrigger value="calculator">Rate Calculator</TabsTrigger>
        </TabsList>

        {/* Shipping Zones Management */}
        <TabsContent value="zones" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Zones List */}
            <div className="lg:col-span-2">
          <Card>
                <CardHeader>
                  <CardTitle>Shipping Zones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(shippingZones || []).map((zone) => (
                      <Card key={zone.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{zone.name}</h3>
                              <Badge variant={zone.active ? "default" : "secondary"}>
                                {zone.active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{zone.description}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {zone.center_coordinates?.lat?.toFixed(4) || '0.0000'}, {zone.center_coordinates?.lng?.toFixed(4) || '0.0000'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {zone.radius_km || 0}km radius
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Standard:</span>
                                <p className="font-medium">₦{zone.rates.standard.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Express:</span>
                                <p className="font-medium">₦{zone.rates.express.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                console.log('Edit button clicked for zone:', zone);
                                setSelectedZone(zone);
                                setIsEditingZone(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteShippingZone(zone.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                </div>
                      </Card>
                    ))}
              </div>
            </CardContent>
          </Card>
            </div>

            {/* Zone Editor */}
            <div className="lg:col-span-1">
              {(isEditingZone || selectedZone) && (
          <Card>
            <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{selectedZone ? 'Edit Zone' : 'New Zone'}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditingZone(false);
                          setSelectedZone(null);
                          setNewZone({
                            name: '',
                            description: '',
                            center_coordinates: { lat: 0, lng: 0 },
                            radius_km: 50,
                            rates: { standard: 0, express: 0 },
                            delivery_times: { standard: '', express: '' },
                            active: true,
                          });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
            </CardHeader>
            <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="zone-name">Zone Name</Label>
                        <Input
                          id="zone-name"
                          value={selectedZone?.name || newZone.name}
                          onChange={(e) => {
                            if (selectedZone) {
                              setSelectedZone({ ...selectedZone, name: e.target.value });
                            } else {
                              setNewZone({ ...newZone, name: e.target.value });
                            }
                          }}
                          placeholder="e.g., Lagos Metro"
                        />
                      </div>

                      <div>
                        <Label htmlFor="zone-description">Description</Label>
                        <Textarea
                          id="zone-description"
                          value={selectedZone?.description || newZone.description}
                          onChange={(e) => {
                            if (selectedZone) {
                              setSelectedZone({ ...selectedZone, description: e.target.value });
                            } else {
                              setNewZone({ ...newZone, description: e.target.value });
                            }
                          }}
                          placeholder="Brief description of the zone"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="zone-lat">Latitude</Label>
                          <Input
                            id="zone-lat"
                            type="number"
                            step="0.0001"
                            value={selectedZone?.center_coordinates?.lat || newZone.center_coordinates?.lat || 0}
                            onChange={(e) => {
                              const lat = parseFloat(e.target.value) || 0;
                              if (selectedZone) {
                                setSelectedZone({
                                  ...selectedZone,
                                  center_coordinates: { 
                                    lat, 
                                    lng: selectedZone.center_coordinates?.lng || 0 
                                  }
                                });
                              } else {
                                setNewZone({
                                  ...newZone,
                                  center_coordinates: { 
                                    lat, 
                                    lng: newZone.center_coordinates?.lng || 0 
                                  }
                                });
                              }
                            }}
                            placeholder="6.5244"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zone-lng">Longitude</Label>
                          <Input
                            id="zone-lng"
                            type="number"
                            step="0.0001"
                            value={selectedZone?.center_coordinates?.lng || newZone.center_coordinates?.lng || 0}
                            onChange={(e) => {
                              const lng = parseFloat(e.target.value) || 0;
                              if (selectedZone) {
                                setSelectedZone({
                                  ...selectedZone,
                                  center_coordinates: { 
                                    lat: selectedZone.center_coordinates?.lat || 0, 
                                    lng 
                                  }
                                });
                              } else {
                                setNewZone({
                                  ...newZone,
                                  center_coordinates: { 
                                    lat: newZone.center_coordinates?.lat || 0, 
                                    lng 
                                  }
                                });
                              }
                            }}
                            placeholder="3.3792"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="zone-radius">Radius (kilometers)</Label>
                        <Input
                          id="zone-radius"
                          type="number"
                          min="1"
                          step="0.1"
                          value={selectedZone?.radius_km || newZone.radius_km || 50}
                          onChange={(e) => {
                            const radius = parseFloat(e.target.value) || 50;
                            if (selectedZone) {
                              setSelectedZone({ ...selectedZone, radius_km: radius });
                            } else {
                              setNewZone({ ...newZone, radius_km: radius });
                            }
                          }}
                          placeholder="50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="standard-rate">Standard (₦)</Label>
                          <Input
                            id="standard-rate"
                            type="number"
                            value={selectedZone?.rates.standard || newZone.rates?.standard}
                            onChange={(e) => {
                              const rate = parseInt(e.target.value) || 0;
                              if (selectedZone) {
                                setSelectedZone({
                                  ...selectedZone,
                                  rates: { ...selectedZone.rates, standard: rate }
                                });
                              } else {
                                setNewZone({
                                  ...newZone,
                                  rates: { ...newZone.rates!, standard: rate }
                                });
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="express-rate">Express (₦)</Label>
                          <Input
                            id="express-rate"
                            type="number"
                            value={selectedZone?.rates.express || newZone.rates?.express}
                            onChange={(e) => {
                              const rate = parseInt(e.target.value) || 0;
                              if (selectedZone) {
                                setSelectedZone({
                                  ...selectedZone,
                                  rates: { ...selectedZone.rates, express: rate }
                                });
                              } else {
                                setNewZone({
                                  ...newZone,
                                  rates: { ...newZone.rates!, express: rate }
                                });
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedZone?.active ?? newZone.active}
                          onCheckedChange={(checked) => {
                            if (selectedZone) {
                              setSelectedZone({ ...selectedZone, active: checked });
                            } else {
                              setNewZone({ ...newZone, active: checked });
                            }
                          }}
                        />
                        <Label>Active Zone</Label>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => {
                          const zoneToSave = selectedZone || {
                            ...newZone,
                            id: `zone-${Date.now()}`,
                            created_at: new Date().toISOString(),
                          } as ShippingZone;
                          
                          saveShippingZone(zoneToSave);
                        }}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {selectedZone ? 'Update Zone' : 'Create Zone'}
                      </Button>
                    </div>
            </CardContent>
          </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Rate Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Rate Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Destination Location</Label>
                    <Input
                      id="location"
                      value={rateCalculator.location}
                      onChange={(e) => setRateCalculator({ ...rateCalculator, location: e.target.value })}
                      placeholder="Enter city or location"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service">Shipping Service</Label>
                    <Select
                      value={rateCalculator.service}
                      onValueChange={(value: 'standard' | 'express') => 
                        setRateCalculator({ ...rateCalculator, service: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Delivery</SelectItem>
                        <SelectItem value="express">Express Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={calculateShippingRate} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Rate
                        </Button>
                </div>

                <div className="space-y-4">
          <Card>
            <CardHeader>
                      <CardTitle>Rate Result</CardTitle>
            </CardHeader>
            <CardContent>
                      {calculatedRate !== null ? (
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            ₦{calculatedRate.toLocaleString()}
                          </div>
                          <p className="text-muted-foreground">
                            {rateCalculator.service.charAt(0).toUpperCase() + rateCalculator.service.slice(1)} delivery to {rateCalculator.location}
                          </p>
                    </div>
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <Calculator className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Enter location and package details to calculate shipping rate</p>
                    </div>
                      )}
                  </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                      <CardTitle>Available Zones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {(shippingZones || []).filter(zone => zone.active).map((zone) => (
                          <div key={zone.id} className="flex justify-between items-center p-2 bg-muted rounded">
                            <div>
                              <p className="font-medium">{zone.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {zone.center_coordinates?.lat?.toFixed(4) || '0.0000'}, {zone.center_coordinates?.lng?.toFixed(4) || '0.0000'} • {zone.radius_km || 0}km radius
                              </p>
                            </div>
                            <Badge variant="outline">
                              ₦{zone.rates.standard.toLocaleString()}
                            </Badge>
                    </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                    </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}; 
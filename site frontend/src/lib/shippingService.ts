import { supabase } from './supabaseClient';

export interface ShippingZone {
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
}

export interface ShippingRate {
  rate: number;
  zone: ShippingZone;
  service: 'standard' | 'express';
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Geocode address using Google Maps API
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn('Google Maps API key not found. Using fallback method.');
      return null;
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

// Find shipping zone for an address
async function findShippingZone(address: string, zones: ShippingZone[]): Promise<ShippingZone | null> {
  try {
    // Try Google Maps geocoding first
    const coordinates = await geocodeAddress(address);
    
    if (coordinates) {
      // Find the zone with the smallest distance within radius
      let closestZone: ShippingZone | null = null;
      let minDistance = Infinity;

      for (const zone of zones) {
        if (!zone.active) continue;

        const distance = calculateDistance(coordinates, zone.center_coordinates);
        
        // Check if address is within zone radius
        if (distance <= zone.radius_km && distance < minDistance) {
          closestZone = zone;
          minDistance = distance;
        }
      }

      return closestZone;
    }

    // Fallback to simple keyword matching
    const addressLower = address.toLowerCase();
    for (const zone of zones) {
      if (!zone.active) continue;
      
      // Check if address contains zone name keywords
      if (addressLower.includes(zone.name.toLowerCase().split(' ')[0])) {
        return zone;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding shipping zone:', error);
    return null;
  }
}

// Get all active shipping zones from the database
export async function getShippingZones(): Promise<ShippingZone[]> {
  try {
    const { data, error } = await supabase
      .from('shipping_zones')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching shipping zones:', error);
    return [];
  }
}

// Calculate shipping rate for an address
export async function calculateShippingRate(
  address: string, 
  service: 'standard' | 'express' = 'standard'
): Promise<ShippingRate | null> {
  try {
    const zones = await getShippingZones();
    if (zones.length === 0) {
      console.warn('No shipping zones found');
      return null;
    }

    const zone = await findShippingZone(address, zones);
    if (!zone) {
      console.warn(`No shipping zone found for address: ${address}`);
      return null;
    }

    return {
      rate: zone.rates[service],
      zone,
      service
    };
  } catch (error) {
    console.error('Error calculating shipping rate:', error);
    return null;
  }
}

// Get shipping rates for both standard and express services
export async function getShippingRates(address: string): Promise<{
  standard: ShippingRate | null;
  express: ShippingRate | null;
}> {
  const [standardRate, expressRate] = await Promise.all([
    calculateShippingRate(address, 'standard'),
    calculateShippingRate(address, 'express')
  ]);

  return {
    standard: standardRate,
    express: expressRate
  };
}

// Validate if an address is within any shipping zone
export async function isAddressShippable(address: string): Promise<boolean> {
  const rate = await calculateShippingRate(address);
  return rate !== null;
}

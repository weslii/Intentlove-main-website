// Shipping zone utilities using Google Maps API

interface Coordinates {
  lat: number;
  lng: number;
}

interface ShippingZone {
  id: string;
  name: string;
  description: string;
  center_coordinates: Coordinates;
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

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
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

// Find which zone an address belongs to
export async function findShippingZone(address: string, zones: ShippingZone[]): Promise<ShippingZone | null> {
  try {
    // Geocode the address using Google Maps API
    const coordinates = await geocodeAddress(address);
    if (!coordinates) return null;

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
  } catch (error) {
    console.error('Error finding shipping zone:', error);
    return null;
  }
}

// Geocode address using Google Maps API
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  try {
    // You'll need to add your Google Maps API key to environment variables
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn('Google Maps API key not found. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.');
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

// Calculate shipping rate for an address
export async function calculateShippingRate(
  address: string, 
  zones: ShippingZone[], 
  service: 'standard' | 'express'
): Promise<{ rate: number; zone: ShippingZone } | null> {
  const zone = await findShippingZone(address, zones);
  if (!zone) return null;

  return {
    rate: zone.rates[service],
    zone
  };
}

// Fallback function for when Google Maps API is not available
export function findZoneByAddressFallback(address: string, zones: ShippingZone[]): ShippingZone | null {
  const addressLower = address.toLowerCase();
  
  // Simple keyword matching as fallback
  for (const zone of zones) {
    if (!zone.active) continue;
    
    // Check if address contains zone name keywords
    if (addressLower.includes(zone.name.toLowerCase().split(' ')[0])) {
      return zone;
    }
  }
  
  return null;
}

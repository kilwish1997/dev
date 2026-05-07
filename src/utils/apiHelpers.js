/**
 * API Helper utilities for OpenStreetMap API calls
 * Handles retries, rate limiting, and error handling
 */

/**
 * Fetch with retry logic
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} retries - Number of retries (default: 3)
 * @param {number} delay - Delay between retries in ms (default: 1000)
 */
export async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      // If rate limited (429) or server error (5xx), retry
      if (response.status === 429 || response.status >= 500) {
        if (i < retries - 1) {
          console.warn(`Request failed with status ${response.status}, retrying in ${delay}ms...`);
          await sleep(delay * (i + 1)); // Exponential backoff
          continue;
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`Request failed: ${error.message}, retrying in ${delay}ms...`);
        await sleep(delay * (i + 1));
      } else {
        throw error;
      }
    }
  }
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch city name from coordinates using Nominatim API
 */
export async function getCityFromCoordinates(lat, lng) {
  try {
    const response = await fetchWithRetry(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'LocalShopsFinder/1.0 (Contact: your-email@example.com)',
          'Accept': 'application/json'
        }
      },
      2, // Only 2 retries for city name
      1000
    );
    
    const data = await response.json();
    return data.address?.city || data.address?.town || data.address?.village || 'your area';
  } catch (error) {
    console.error('Error fetching city name:', error);
    return 'your area';
  }
}

/**
 * Fetch nearby shops using Overpass API
 */
export async function fetchNearbyShopsFromOSM(lat, lng, radiusInMeters, osmTag) {
  const query = `
    [out:json][timeout:25];
    (
      node["${osmTag.split('=')[0]}"](around:${radiusInMeters},${lat},${lng});
      way["${osmTag.split('=')[0]}"](around:${radiusInMeters},${lat},${lng});
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    const response = await fetchWithRetry(
      'https://overpass-api.de/api/interpreter',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: query
      },
      3,
      2000 // 2 second delay between retries
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from Overpass API:', error);
    throw new Error(`Failed to fetch nearby shops: ${error.message}`);
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(loc1, loc2) {
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Parse shop data from OSM element
 */
export function parseShopFromOSMElement(element, userLocation) {
  const shopLat = element.lat || (element.center ? element.center.lat : null);
  const shopLng = element.lon || (element.center ? element.center.lon : null);
  
  if (!shopLat || !shopLng || !element.tags?.name) {
    return null;
  }

  const dist = calculateDistance(userLocation, { lat: shopLat, lng: shopLng });
  
  return {
    id: element.id,
    name: element.tags.name,
    address: element.tags['addr:street'] 
      ? `${element.tags['addr:street']}${element.tags['addr:housenumber'] ? ' ' + element.tags['addr:housenumber'] : ''}`
      : 'Address not available',
    location: { lat: shopLat, lng: shopLng },
    openingHours: element.tags.opening_hours || 'Not available',
    phone: element.tags.phone || 'N/A',
    website: element.tags.website || null,
    shopType: element.tags.shop || element.tags.amenity || 'shop',
    distance: dist,
    // Extra description fields from OSM
    cuisine: element.tags.cuisine || null,
    brand: element.tags.brand || null,
    operator: element.tags.operator || null,
    email: element.tags.email || null,
    wheelchair: element.tags.wheelchair || null,
    delivery: element.tags.delivery || null,
    takeaway: element.tags.takeaway || null,
    outdoor_seating: element.tags.outdoor_seating || null,
    internet_access: element.tags.internet_access || null,
    level: element.tags.level || null,
  };
}

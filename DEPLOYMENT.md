# Deployment Guide for Local Shops Finder

## Issue: OpenStreetMap Location Search Not Working After Deployment

### Root Causes
1. **Geolocation API requires HTTPS** - Browsers block geolocation on non-HTTPS sites
2. **API Rate Limiting** - Nominatim and Overpass APIs have strict rate limits
3. **CORS Issues** - Cross-origin requests may be blocked in production
4. **Missing Headers** - OpenStreetMap APIs require proper User-Agent headers

### Fixes Applied

#### 1. Added Proper Headers to API Calls
- Added `User-Agent` header to Nominatim API calls
- Added `Content-Type` and `Accept` headers to Overpass API calls
- These headers are required by OpenStreetMap's usage policy

#### 2. Enhanced Error Handling
- Added detailed error messages for geolocation failures
- Added HTTP status code checking
- Added console logging for debugging
- Added proper error propagation

#### 3. Improved Geolocation Options
- Added `enableHighAccuracy: true` for better location precision
- Added timeout of 10 seconds
- Added `maximumAge: 0` to prevent cached locations

#### 4. Created vercel.json Configuration
- Added proper routing for SPA
- Added security headers
- Ensures HTTPS is enforced

### Deployment Steps for Vercel

1. **Push to GitHub**
   ```bash
   cd new
   git add .
   git commit -m "Fix OpenStreetMap API calls for production"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a React app
   - Click "Deploy"

3. **Verify HTTPS**
   - Vercel automatically provides HTTPS
   - Your app will be accessible at `https://your-app.vercel.app`
   - Geolocation will work on HTTPS

### Important Notes

#### OpenStreetMap API Usage Policy
- **Nominatim API**: Maximum 1 request per second
- **Overpass API**: Be respectful with query frequency
- **User-Agent Required**: Always include a descriptive User-Agent header

#### Rate Limiting Solutions
If you experience rate limiting issues:

1. **Add Caching**
   - Cache API responses in localStorage
   - Implement request debouncing

2. **Use Alternative APIs** (if needed)
   - Consider using Mapbox API
   - Consider using Google Places API
   - Set up your own Nominatim instance

3. **Implement Request Throttling**
   ```javascript
   // Add delay between requests
   await new Promise(resolve => setTimeout(resolve, 1000));
   ```

### Testing After Deployment

1. **Test Geolocation**
   - Open browser console (F12)
   - Check for any geolocation errors
   - Verify location permission prompt appears

2. **Test API Calls**
   - Open Network tab in browser DevTools
   - Check Nominatim and Overpass API responses
   - Verify proper headers are sent

3. **Test Shop Search**
   - Try different categories
   - Try different distance ranges
   - Verify shops appear on map

### Troubleshooting

#### "Location permission denied"
- User needs to allow location access in browser
- Check browser settings → Site permissions

#### "Failed to fetch nearby shops"
- Check browser console for specific error
- Verify API endpoints are accessible
- Check for CORS errors

#### "No shops found"
- Try increasing distance range
- Try different categories
- Verify location is correct

#### Rate Limiting Errors
- Wait 1-2 minutes before retrying
- Implement caching to reduce API calls
- Consider using alternative APIs

### Environment Variables (Optional)

If you want to use alternative APIs, add these to Vercel:

```env
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
REACT_APP_GOOGLE_MAPS_KEY=your_google_key
```

### Monitoring

After deployment, monitor:
- API response times
- Error rates in browser console
- User feedback on location accuracy
- Rate limiting issues

### Support

For issues with:
- **Vercel Deployment**: [Vercel Documentation](https://vercel.com/docs)
- **OpenStreetMap APIs**: [OSM Wiki](https://wiki.openstreetmap.org/)
- **React Leaflet**: [React Leaflet Docs](https://react-leaflet.js.org/)

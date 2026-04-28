# Local Shops Finder

A React-based web application that helps users discover local shops and businesses near their current location using Leaflet maps and OpenStreetMap data.

## Features

- **Automatic Location Detection**: Uses browser geolocation to detect user's current location
- **Leaflet Maps Integration**: Powered by OpenStreetMap - completely free, no API key required!
- **Location-Specific Results**: Shows shops only in your current city/area
- **Smart Filtering**: Filter by category (grocery, apparel, restaurant, pharmacy, etc.) and distance
- **Detailed Shop Information**: 
  - Shop name and type
  - Address and phone number
  - Opening hours
  - Distance from your location
  - Website links (when available)
- **Dual View Modes**: Switch between table view and interactive map view
- **Admin Dashboard**: Manage user actions, approve/decline shop requests
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **100% Free**: No API keys, no usage limits, completely open-source

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- React and React Router
- Leaflet (open-source map library)
- React Leaflet (React wrapper for Leaflet)

### 2. Run the Application

```bash
npm start
```

The application will open at `http://localhost:3000`

### 3. Allow Location Access

When prompted by your browser, click "Allow" to enable location detection.

That's it! No API keys needed. 🎉

## Project Structure

```
local-shops-finder/
├── public/
│   └── index.html          # HTML template with Google Maps script
├── src/
│   ├── pages/
│   │   ├── Home.js         # Main shop finder page
│   │   ├── Home.css        # Home page styles
│   │   ├── About.js        # About page
│   │   ├── About.css       # About page styles
│   │   ├── Admin.js        # Admin dashboard
│   │   └── Admin.css       # Admin page styles
│   ├── App.js              # Main app component with routing
│   ├── App.css             # App-level styles
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies
└── README.md              # This file
```

## How It Works

1. **Location Detection**: Browser geolocation API detects user's GPS coordinates
2. **City Identification**: Nominatim (OpenStreetMap) converts coordinates to city name
3. **Shop Discovery**: Overpass API searches OpenStreetMap database for nearby shops based on:
   - User's location
   - Selected category
   - Distance radius
4. **Data Display**: Results shown in table or map view with detailed information
5. **Real-time Filtering**: Client-side filtering for instant results

## Data Sources

- **Maps**: OpenStreetMap via Leaflet
- **Shop Data**: OpenStreetMap via Overpass API
- **Geocoding**: Nominatim (OpenStreetMap)

All services are free and open-source! 🌍

## Available Categories

- All Categories
- Grocery/Supermarket
- Apparel/Clothing
- Restaurants
- Pharmacy
- Electronics
- Books

## Distance Options

- Within 5 km
- Within 10 km
- Within 15 km

## Admin Features

- View all user actions and requests
- Approve or decline shop-related requests
- Filter by status (pending, approved, declined)
- Delete processed actions
- Dashboard statistics

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Privacy

- Location data is only used for finding nearby shops
- No data is stored or transmitted to external servers
- All processing happens in the browser

## Troubleshooting

**Location not detected:**
- Ensure location services are enabled in your browser
- Check that you've allowed location access when prompted
- Try using HTTPS (required for geolocation on some browsers)

**No shops appearing:**
- Some areas may have limited OpenStreetMap data
- Try increasing the distance radius
- Different categories may have different availability

**Map not loading:**
- Check your internet connection
- Ensure Leaflet CSS is loading properly
- Clear browser cache and reload

## Technologies Used

- React 18
- React Router 6
- Leaflet (open-source map library)
- React Leaflet
- OpenStreetMap (map tiles)
- Overpass API (shop data from OpenStreetMap)
- Nominatim (geocoding)
- Browser Geolocation API
- CSS3 (Responsive Design)

## License

This project is open source and available for personal and commercial use.

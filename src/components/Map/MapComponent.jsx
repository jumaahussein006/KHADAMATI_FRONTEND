import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Baalbek-Hermel region coordinates (Lebanon)
const BAALBEK_HERMEL_CENTER = [34.0058, 36.2181];
const BAALBEK_HERMEL_BOUNDS = [
  [33.8, 35.9],
  [34.3, 36.5]
];

// Important locations in Baalbek-Hermel
const IMPORTANT_LOCATIONS = [
  { name: 'Baalbek', position: [34.0058, 36.2181], description: 'Ancient Roman ruins' },
  { name: 'Hermel', position: [34.3942, 36.3847], description: 'Hermel city center' },
  { name: 'Qaa', position: [34.2778, 36.4889], description: 'Qaa village' },
  { name: 'Labweh', position: [34.1989, 36.3403], description: 'Labweh town' }
];

// LocationMarker component (must be inside MapContainer)
function LocationMarker({ onLocationDetected }) {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.locate().on('locationfound', (e) => {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        if (onLocationDetected) {
          onLocationDetected(e.latlng);
        }
      });
    }
  }, [map, onLocationDetected]);

  if (position === null) return null;
  
  return (
    <Marker position={position}>
      <Popup>Your Location</Popup>
    </Marker>
  );
}

const MapComponent = ({ onShowServicesNearMe, userLocation }) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);

  const handleLocationDetected = (latlng) => {
    setLocation(latlng);
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 relative">
      <MapContainer
        center={BAALBEK_HERMEL_CENTER}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        bounds={BAALBEK_HERMEL_BOUNDS}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Important locations */}
        {IMPORTANT_LOCATIONS.map((loc, index) => (
          <Marker key={index} position={loc.position}>
            <Popup>
              <strong>{loc.name}</strong>
              <br />
              {loc.description}
            </Popup>
          </Marker>
        ))}

        {/* User location */}
        <LocationMarker onLocationDetected={handleLocationDetected} />
      </MapContainer>

      {/* Show Services Near Me Button */}
      {location && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
          <button
            onClick={() => onShowServicesNearMe && onShowServicesNearMe(location)}
            className="bg-[#0BA5EC] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0BA5EC]/90 shadow-lg"
          >
            {t('common.showServicesNearMe')}
          </button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;

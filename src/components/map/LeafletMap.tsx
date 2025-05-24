import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  lat: number;
  lng: number;
  address?: string;
  timestamp?: string;
}

export function LeafletMap({ lat, lng, address, timestamp }: LeafletMapProps) {
  useEffect(() => {
    // Ensure Leaflet is properly initialized
    console.log('LeafletMap mounted with coordinates:', { lat, lng });
  }, [lat, lng]);

  return (
    <MapContainer 
      center={[lat, lng]} 
      zoom={15} 
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Delivery Location</h3>
            <p className="text-sm text-gray-600">
              Lat: {lat.toFixed(6)}<br />
              Lng: {lng.toFixed(6)}
            </p>
            {address && (
              <p className="text-sm mt-2">{address}</p>
            )}
            {timestamp && (
              <p className="text-xs text-gray-500 mt-1">
                Recorded: {timestamp}
              </p>
            )}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

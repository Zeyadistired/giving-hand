import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/ui/back-button';

// Simple GPS display component (no external dependencies)
const GpsDisplay = ({ lat, lng, address, timestamp }: { lat: number; lng: number; address?: string; timestamp?: string }) => {
  return (
    <div className="w-full h-[500px] bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
      <div className="text-center p-8 max-w-md">
        <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <MapPin className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">GPS Location Tracked</h3>

        <div className="space-y-3 text-left bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Latitude:</span>
            <span className="font-mono text-sm text-gray-900 dark:text-white">{lat.toFixed(6)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Longitude:</span>
            <span className="font-mono text-sm text-gray-900 dark:text-white">{lng.toFixed(6)}</span>
          </div>
          {address && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Address:</span>
              <p className="text-sm text-gray-900 dark:text-white mt-1">{address}</p>
            </div>
          )}
          {timestamp && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Recorded:</span>
              <p className="text-sm text-gray-900 dark:text-white mt-1">{timestamp}</p>
            </div>
          )}
        </div>

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            📍 GPS coordinates successfully captured and ready for delivery tracking
          </p>
        </div>
      </div>
    </div>
  );
};

interface LocationState {
  lat: number;
  lng: number;
  address?: string;
  timestamp?: string;
}

export default function GpsMap() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState | null };

  // Default to Cairo coordinates if no state is provided
  const { lat, lng, address, timestamp } = state || {
    lat: 30.0444,
    lng: 31.2357,
    address: 'Cairo, Egypt',
    timestamp: new Date().toLocaleString()
  };

  console.log('GpsMap - Received state:', state);
  console.log('GpsMap - Using coordinates:', { lat, lng, address, timestamp });

  const handleBackToTracking = () => {
    navigate('/charity/meal-tracking');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <BackButton />
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-emerald-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                GPS Location
              </h1>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleBackToTracking}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tracking
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        {/* Location Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-emerald-600" />
              Current Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Latitude:</span>
                <p className="text-gray-900 dark:text-white font-mono">{lat.toFixed(6)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Longitude:</span>
                <p className="text-gray-900 dark:text-white font-mono">{lng.toFixed(6)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Timestamp:</span>
                <p className="text-gray-900 dark:text-white">{timestamp}</p>
              </div>
              {address && (
                <div className="md:col-span-3">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Address:</span>
                  <p className="text-gray-900 dark:text-white">{address}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* GPS Display Container */}
        <Card>
          <CardContent className="p-0">
            <div className="w-full h-[500px] rounded-lg overflow-hidden">
              <GpsDisplay lat={lat} lng={lng} address={address} timestamp={timestamp} />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={handleBackToTracking}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Continue Tracking
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')}
            className="flex-1 flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open in Google Maps
          </Button>
        </div>
      </div>
    </div>
  );
}

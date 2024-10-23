'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

function GoogleMapView({ jobsData }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Add your API key
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 1.3876, lng: 103.7454 }); // Default center
  const [zoom, setZoom] = useState(12); // Set a reasonable default zoom level

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation); // Update center with user location
          setZoom(12); // Reset zoom to a comfortable level
        },
        () => {
          console.log("Unable to retrieve your location");
        }
      );
    }
  }, []);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom} // Use the zoom level state
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Add markers for each job */}
      {jobsData?.map((job) => (
        job.coordinates && (
          <Marker
            key={job.id}
            position={job.coordinates} // Marker position using lat/lng
            title={`${job.name}'s Request`}
          />
        )
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(GoogleMapView);

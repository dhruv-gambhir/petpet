'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '430px',
};

function GoogleMapView({ jobsData, hoveredJobId, setHoveredJobId }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 1.3483, lng: 103.6831 }); // Default center in NTU
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation); // Update center with user location
          setZoom(15);
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
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} onLoad={onLoad} onUnmount={onUnmount}>
      {jobsData?.map((job) => (
        job.coordinates && (
          <Marker
            key={job.id}
            position={job.coordinates}
            title={`${job.name}'s Request`}

            icon={{
              url: hoveredJobId === job.id
                ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Highlight marker
                : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // Default marker
            }}
            onMouseOver={() => setHoveredJobId(job.id)} // Set hovered job ID when marker is hovered
            onMouseOut={() => setHoveredJobId(null)} // Reset hover state when marker is not hovered
          />
        )
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(GoogleMapView);

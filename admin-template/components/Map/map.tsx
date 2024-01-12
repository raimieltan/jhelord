import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Unit } from '@/app/types/unit';

interface MapProps {
  units: Unit[];
}

const Map = ({ 
  units 
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'weekly',
      });

      await loader.importLibrary('maps');

      const initialCenter = units[0].location || { lat: 0, lng: 0 };
      const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
        center: initialCenter,
        zoom: 12
      });

      // URL of the taxi car image
      const taxiIcon = {
        url: '/taxi-icon.png',
        size: new google.maps.Size(40, 40), // Width and height in pixels
        scaledSize: new google.maps.Size(25, 25) // Optional: if you want to scale the icon

      }

      units.forEach(unit => {
        new google.maps.Marker({
          position: unit.location,
          map: map,
          title: `Unit ${unit.number}` || '',
          icon: taxiIcon,  // Setting the custom icon
        });
      });
    };

    if (units.length > 0) {
      initMap();
    }
  }, [units]);

  return <div className='w-full rounded-xl' ref={mapRef} />;
};

export default Map;

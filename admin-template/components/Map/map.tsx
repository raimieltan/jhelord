import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Unit } from '@/app/types/unit';
import Modal from './markerModal';

interface MapProps {
  units: Unit[];
}

const Map = ({
  units
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const showModal = (unit: Unit) => {
    setModalVisible(true);
    setSelectedUnit(unit);
  }

  const hideModal = () => {
    setModalVisible(false);
    setSelectedUnit(null);
  };

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
          version: 'weekly',
        });

        await loader.importLibrary('maps');
        const initialCenter = {
          lat: Number(units[0].location.latitude),
          lng: Number(units[0].location.longitude),
        };
        const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
          center: initialCenter,
          zoom: 13
        });

        // URL of the taxi car image
        const taxiIcon = {
          url: '/taxi-icon.png',
          size: new google.maps.Size(40, 40), // Width and height in pixels
          scaledSize: new google.maps.Size(25, 25) // Optional: if you want to scale the icon

        }

        units.forEach(unit => {
          const unitLocation = {
            lat: Number(unit.location.latitude),
            lng: Number(unit.location.longitude),
          }
          const marker = new google.maps.Marker({
            position: unitLocation,
            map: map,
            title: `Unit ${unit.number}` || '',
            icon: taxiIcon,  // Setting the custom icon
          });

          marker.addListener('click', () => showModal(unit))
        });
      } catch (error: any) {
        console.log(error.message);
      }
    };

    if (units.length > 0) {
      console.log(units)
      initMap();
    }
  }, [units]);

  return (
    <>
      <div className='w-full h-full rounded-xl' ref={mapRef} />
      {modalVisible && (
        <Modal 
          unit={selectedUnit} 
          onClose={hideModal} 
        />
      )}
    </>
  );
};

export default Map;
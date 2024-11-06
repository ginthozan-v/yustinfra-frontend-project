import { MapPinIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import InputGroup from '../InputGroup';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const LocationCapture = ({
  name,
  label,
  error,
  hint,
  placeholder,
  disabled,
}) => {
  const [location, setLocation] = useState(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <InputGroup name={name} label={label} error={error} hint={hint}>
      <div className="flex w-full mt-2 rounded-md shadow-sm">
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <input
            type="text"
            name={name}
            id={name}
            className="block w-full rounded-none rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-100"
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
        <button
          onClick={handleGetLocation}
          disabled={disabled}
          type="button"
          className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <MapPinIcon
            className="-ml-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Capture GPS
        </button>
      </div>

      {location && (
        <div className="w-full h-40 mt-4 border">
          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
            }}
            defaultCenter={location}
            defaultZoom={11}
          >
            {/* <AnyReactComponent
              lat={location.latitude}
              lng={location.longitude}
              text="My Marker"
            /> */}
          </GoogleMapReact>
        </div>
      )}
    </InputGroup>
  );
};

export default LocationCapture;

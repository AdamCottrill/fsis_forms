import React, { useState, useRef, useEffect } from "react";

import {
  MapContainer,
  TileLayer,

    useMapEvent,
    Marker,
    Popup
} from "react-leaflet";


export const ClickableMap = ({ bounds, point, createPoint }) => {
  const mapRef = useRef();

  useEffect(() => {
    const mymap = mapRef.current;
    if (mymap) {
      mymap.setMaxBounds(bounds);
      mymap.fitBounds(bounds);
    }
  }, [mapRef, bounds]);

  function MyComponent() {
      const map = useMapEvent("click", (event) => {
          const { lat, lng: lon } = event.latlng;
          createPoint([lat, lon ]);
      });
      return null;
  }

  return (
        <>
            <MapContainer
                h="500"
                bounds={bounds}
                scrollWheelZoom={true}
                zoomSnap={0.25}
                maxBoundsViscosity={1}
                maxBounds={bounds}
            >
                <MyComponent />

                {point.length &&
                    <Marker position={point}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
          }

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </>
    );
};

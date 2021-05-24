import React, { useEffect, useRef } from "react";
import "./Map.css";
import { Map, TileLayer } from "react-leaflet";
import { showDataOnMap } from "./util";

function MapLeft({ countries, casesType, center, zoom }) {
  const mapRef = useRef();

  useEffect(() => {
    function handleFly() {
      const { current = {} } = mapRef;
      const { leafletElement: map } = current;
      map.flyTo(center, 4, {
        duration: 2,
      });
      // showDataOnMap(countries, casesType);
    }
    handleFly();
  }, [center, casesType, countries]);

  // function handleFly() {
  //   const { current = {} } = mapRef;
  //   const { leafletElement: map } = current;
  //   map.flyTo(center, 6, {
  //     duration: 2,
  //   });
  // }

  return (
    <div className="map">
      <Map ref={mapRef} center={{ lat: 34.80746, lng: -40.4796 }} zoom={4}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* lopp through countries and draw circles on the screen*/}
        {showDataOnMap(countries, casesType)}
      </Map>
      {/* <button onClick={handleFly}>cfffffffffffffffffffffffffff</button> */}
    </div>
  );
}

export default MapLeft;

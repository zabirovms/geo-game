import React from 'react';
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import AmChart from './AmChart';

const RotatingGlobe = () => {
  const config = {
    geodata: am4geodata_worldLow,
    projection: am4maps.projections.Orthographic,
    panBehavior: "rotateLongLat",
    deltaLatitude: -20,
    padding: [20,20,20,20],
    background: {
      fill: "#454a58",
      fillOpacity: 1,
    },
    graticule: {
      stroke: "#ffffff",
      strokeOpacity: 0.08,
      fitExtent: false,
    },
    homeButton: true,
  };

  return (
    <AmChart config={config} />
  );
};

export default RotatingGlobe;
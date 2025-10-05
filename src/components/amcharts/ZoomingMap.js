import React from 'react';
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import AmChart from './AmChart';

const ZoomingMap = () => {
  const config = {
    geodata: am4geodata_worldLow,
    projection: am4maps.projections.Miller,
  };

  return (
    <AmChart config={config} />
  );
};

export default ZoomingMap;
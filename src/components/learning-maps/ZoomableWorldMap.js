import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

class ZoomableWorldMap extends Component {
  componentDidMount() {
    let chart = am4core.create("zoomable-chartdiv", am4maps.MapChart);
    
    chart.projection = new am4maps.projections.Miller();
    
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.geodata = am4geodata_worldLow;
    polygonSeries.exclude = ["AQ"];
    
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#74B266");
    
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#297373");
    
    chart.logo.disabled = true;
    
    this.chart = chart;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div>
        <h4 className="text-center mb-3">Interactive World Map - Click to Zoom</h4>
        <div 
          id="zoomable-chartdiv"
          style={{ width: "100%", height: "500px" }}
        />
      </div>
    );
  }
}

export default ZoomableWorldMap;

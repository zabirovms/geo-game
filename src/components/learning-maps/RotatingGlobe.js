import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

class RotatingGlobe extends Component {
  componentDidMount() {
    let chart = am4core.create("globe-chartdiv", am4maps.MapChart);
    
    chart.projection = new am4maps.projections.Orthographic();
    chart.panBehavior = "rotateLongLat";
    chart.deltaLatitude = -20;
    chart.padding(20, 20, 20, 20);
    
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.geodata = am4geodata_worldLow;
    
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#74B266");
    
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0);
    
    let graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
    graticuleSeries.mapLines.template.line.stroke = am4core.color("#ffffff");
    graticuleSeries.mapLines.template.line.strokeOpacity = 0.08;
    graticuleSeries.fitExtent = false;
    
    chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#aadaff");
    chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.1;
    
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
        <h4 className="text-center mb-3">3D Rotating Globe - Click to Center</h4>
        <div 
          id="globe-chartdiv"
          style={{ width: "100%", height: "500px" }}
        />
      </div>
    );
  }
}

export default RotatingGlobe;

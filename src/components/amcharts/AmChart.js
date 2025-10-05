import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";

class AmChart extends Component {
  componentDidMount() {
    let chart = am4core.create(this.chartdiv, am4maps.MapChart);
    const { config } = this.props;
    chart.geodata = config.geodata;
    chart.projection = new config.projection();

    if (config.panBehavior) {
      chart.panBehavior = config.panBehavior;
    }

    if (config.deltaLatitude) {
      chart.deltaLatitude = config.deltaLatitude;
    }

    if (config.padding) {
      chart.padding(config.padding[0], config.padding[1], config.padding[2], config.padding[3]);
    }

    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = chart.colors.getIndex(0).lighten(0.5);

    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0);

    chart.zoomControl = new am4maps.ZoomControl();

    polygonTemplate.events.on("hit", function(ev) {
      ev.target.series.chart.zoomToMapObject(ev.target);
    });

    if (config.background) {
      chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color(config.background.fill);
      chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = config.background.fillOpacity;
    }

    if (config.graticule) {
      let graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
      graticuleSeries.mapLines.template.line.stroke = am4core.color(config.graticule.stroke);
      graticuleSeries.mapLines.template.line.strokeOpacity = config.graticule.strokeOpacity;
      graticuleSeries.fitExtent = config.graticule.fitExtent;
    }

    if (config.homeButton) {
      let homeButton = new am4core.Button();
      homeButton.events.on("hit", function(){
        chart.goHome();
      });

      homeButton.icon = new am4core.Sprite();
      homeButton.padding(7, 5, 7, 5);
      homeButton.width = 30;
      homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
      homeButton.marginBottom = 10;
      homeButton.parent = chart.zoomControl;
      homeButton.insertBefore(chart.zoomControl.plusButton);
    }

    this.chart = chart;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div ref={(el) => { this.chartdiv = el; }} style={{ width: "100%", height: "500px" }}></div>
    );
  }
}

export default AmChart;
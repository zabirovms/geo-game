import React, { Component } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

class ZoomableWorldMap extends Component {
  componentDidMount() {
    let root = am5.Root.new(this.chartDiv);

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: "translateX",
      panY: "translateY",
      projection: am5map.geoMercator()
    }));

    let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"]
    }));

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      toggleKey: "active",
      interactive: true
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x297373)
    });

    polygonSeries.mapPolygons.template.states.create("active", {
      fill: am5.color(0x297373)
    });

    let previousPolygon;

    polygonSeries.mapPolygons.template.on("active", function (active, target) {
      if (previousPolygon && previousPolygon !== target) {
        previousPolygon.set("active", false);
      }
      if (target.get("active")) {
        let dataItem = target.dataItem;
        let dataContext = dataItem.dataContext;
        chart.zoomToDataItem(dataItem);
      } else {
        chart.goHome();
      }
      previousPolygon = target;
    });

    chart.chartContainer.get("background").events.on("click", function () {
      chart.goHome();
      if (previousPolygon) {
        previousPolygon.set("active", false);
      }
    });

    chart.appear(1000, 100);

    this.root = root;
  }

  componentWillUnmount() {
    if (this.root) {
      this.root.dispose();
    }
  }

  render() {
    return (
      <div>
        <h4 className="text-center mb-3">Interactive World Map - Click to Zoom</h4>
        <div 
          ref={el => this.chartDiv = el} 
          style={{ width: "100%", height: "500px" }}
        />
      </div>
    );
  }
}

export default ZoomableWorldMap;

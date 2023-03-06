import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import { Circle } from "ol/geom";
import Projection from "ol/proj/Projection";
import { OSM, Vector as VectorSource } from "ol/source";
import { Style } from "ol/style";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { transform, addProjection, fromLonLat } from "ol/proj";

// Define the EPSG:5187 projection
addProjection(
    new Projection({
      code: "EPSG:5187",
      // extent: [-415909.65, -442561.51, 716844.45, 865410.62],
      units: "m",
      axisOrientation: "neu",
      global: false
      // You can add additional properties here if necessary
    })
);

// Use the new projection
const lonLatCoord = [128.624043, 36.805679];
const epsg5187Coord = transform(fromLonLat(lonLatCoord), "EPSG:4326", "EPSG:5187");

const circleFeature = new Feature({
  geometry: new Circle(epsg5187Coord, 1e2)
});
circleFeature.setStyle(
    new Style({
      renderer(coordinates, state) {
        const [[x, y], [x1, y1]] = coordinates;
        const ctx = state.context;
        const dx = x1 - x;
        const dy = y1 - y;
        const radius = Math.sqrt(dx * dx + dy * dy);

        const innerRadius = 0;
        const outerRadius = radius * 1.4;

        const gradient = ctx.createRadialGradient(
            x,
            y,
            innerRadius,
            x,
            y,
            outerRadius
        );
        gradient.addColorStop(0, "rgba(255,0,0,0)");
        gradient.addColorStop(0.6, "rgba(255,0,0,0.2)");
        gradient.addColorStop(1, "rgba(255,0,0,0.8)");
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        ctx.strokeStyle = "rgba(255,0,0,1)";
        ctx.stroke();
      }
    })
);

new Map({
  layers: [
    new VectorLayer({
      source: new VectorSource({
        features: [circleFeature]
      })
    })
  ],
  target: "olMap",
  view: new View({
    center: epsg5187Coord,
    zoom: 18,
    projection: "EPSG:5187"
  })
});
// olMap.js

export default class OpenLayersMap {
  constructor(target) {
    this.target = target;
    this.init();
  }

  init() {
    const olViewCenter = olProj.fromLonLat([128.624043, 36.805679]);

    this.map = new olMap({
      target: this.target,
      view: new olView({
        center: olViewCenter,
        zoom: 13,
      }),
    });

    // OpenLayers 지도 이동 이벤트 핸들러 등록
    this.map.on('moveend', (evt) => {
      const olMapCenter = evt.target.getView().getCenter();
      const [lon, lat] = olProj.toLonLat(olMapCenter);

      // Custom 이벤트 발생
      const event = new CustomEvent('mapMoveEnd', {
        detail: {
          center: { lon, lat },
        },
      });

      // document에 이벤트 발생
      document.dispatchEvent(event);
    });
  }
}
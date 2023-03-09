import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import {Circle} from "ol/geom";
import {Vector as VectorSource} from "ol/source";
import {Stroke, Style} from "ol/style";
import {Vector as VectorLayer} from "ol/layer";
import {fromLonLat, toLonLat} from "ol/proj";
import {default as epsg5187} from './projection';
import {kakaoMap} from "./kakao";
import {default as defaultInteractions} from './Interaction';
import {GeoJSON} from "ol/format";

// Define the EPSG:5187 projection
// addProjection(epsg5187);
// Use the new projection
const lonLatCoord = [128.624043, 36.805679];
const epsg5187Coord = fromLonLat(lonLatCoord, "EPSG:5187"); // [128.624043, 36.805679] > 5187 로 바뀐 좌표
//fromLonLat은 첫번째 인자로 들어온좌표(경도와 위도 순으로 들어와야됨) 를 두번째 인자로 지정한 좌표로 바꿔준다.

//Feature에서 지오메트리 값을 받아와서 원을 생성
const circleFeature = new Feature({
  geometry: new Circle(epsg5187Coord, 1e3)
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
        ctx.stroke();new Style({
          stroke: new Stroke({
            color: '#0033ff',
            width: 2
          })
        })
      }
    })
);

//olMap을 지도옵션으로 생성
const olMap = new Map({
  interactions: defaultInteractions,
  layers: [
    new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: "http://djgis.iptime.org:8000/geoserver/yeongju_a/wfs?typename=yeongju_a%3Aviw_wtl_pipe_lm&service=WFS&version=2.0.0&request=GetFeature&outputFormat=application%2Fjson&propertyName=geom"
      }),
      style: new Style({
        stroke: new Stroke({
          color: '#0033ff',
          width: 1.5
        })
      })
    })
  ],
  target: "olMap",
  view: new View({
    center: epsg5187Coord,
    zoom: 12.3,
    constrainResolution: false,
    constrainRotation: false,
    minZoom: 5.3,
    maxZoom: 14.3,
    projection: epsg5187,
    rotation: -0.02307, //맵을 회전시킴
  })
});

//모든 로드를 마치고 마지막에 현재지도의 줌level을 보여주는 이벤트
olMap.on('loadend', function (event) {
  const zoom = olMap.getView().getZoom();
  const level = kakaoMap.getLevel();
  console.log(`ol: ${zoom} 카카오: ${level}`);
})

let currentZoom = olMap.getView().getZoom(); // 11.3 현재 정보, 유지되어야 하는 값, 프로그래밍 용어: 상태 state = 지금 현재 정보
//olMap에서 뷰값을 가져와서 센터값을 가져와서 카카오맵 센터 좌표를 따라 가게 만듬
olMap.getView().on('change:center', (event) => {
  const center = event.target.getCenter();
  const epsg4326center = toLonLat( center, "EPSG:5187");// toLonLat은 첫번째로 들어온 인자(경도와 위도 순으로 들어와야됨) 가들어오고 두번째 인자에는 첫번째 인자좌표가 어떤 좌표인지 알려줘야함)
  console.log(epsg4326center);
  var moveLatLon = new kakao.maps.LatLng(epsg4326center[1], epsg4326center[0]); //setCenter api를 사용하기위해 필요한 좌표로 변환하기 위해서 필요한 작업
  console.log(moveLatLon)
  kakaoMap.setCenter(moveLatLon);
  if(olMap.getView().getZoom() !== currentZoom){//줌 레벨 변경시에만 실행되도록 하기위해 필요한 if
    const level = olMap.getView().getZoom()//olMap의 줌레벨을 가져옴 현재 기본 12.3
    console.log(level)
    const kakaolevel = kakaoMap.getLevel()//KakaoMap의 줌레벨을 가져옴 현재 기본 3
    console.log(kakaolevel)
    kakaoMap.setLevel(15.3 - level)
    console.log(`ol: ${olMap.getView().getZoom()} 카카오1: ${kakaolevel}`);
    currentZoom = level;
  }
});
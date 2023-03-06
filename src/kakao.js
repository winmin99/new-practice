import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { transform, addProjection, fromLonLat } from "ol/proj";
import Projection from "ol/proj/Projection";

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
const epsg4326Coord = transform(fromLonLat(lonLatCoord), "EPSG:5187", "EPSG:4326");

  var mapContainer = document.getElementById('kakaoMap'), // 지도를 표시할 div
  mapOption = {
  center: new kakao.maps.LatLng(36.805621, 128.623931), // 지도의 중심좌표
  level: 3 // 지도의 확대 레벨
};

  // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
  var map = new kakao.maps.Map(mapContainer, mapOption);

  // 마커가 표시될 위치입니다
  var markerPosition = new kakao.maps.LatLng(36.805621, 128.623931);

  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
  position: markerPosition
});

  // 마커가 지도 위에 표시되도록 설정합니다
  marker.setMap(map);

  var iwContent = '<div style="padding:5px;">Yeongju City Hall <br><a href="https://map.kakao.com/link/map/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">큰지도보기</a> <a href="https://map.kakao.com/link/to/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">길찾기</a></div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
  iwPosition = new kakao.maps.LatLng(36.805621, 128.623931), //인포윈도우 표시 위치입니다
  iwRemoveable = true;

  // 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow({
  position: iwPosition,
  content: iwContent,
  removable: iwRemoveable
});

  // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
  infowindow.open(map, marker);

  var circle = new kakao.maps.Circle({
  center: markerPosition,
  radius: 50,
  strokeWeight: 2,
  strokeColor: '#004c80',
  strokeOpacity: 0.8,
  strokeStyle: 'solid',
  fillColor: '#fff',
  fillOpacity: 0.2
});
  circle.setMap(map);

// document.addEventListener('mapMoveEnd', (evt) => {
//   const { lon, lat } = evt.detail.center;
//   const center = new kakao.maps.LatLng(lat, lon);
//   map.setCenter(center);
// });

export default map;

  // OpenLayersMap class

// kakaoMap.js

class KakaoMap {
  constructor(appKey) {
    this.appKey = appKey;
    this.init();
  }

  init() {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${this.appKey}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        this.map = new kakao.maps.Map(document.getElementById('kakaoMap'), {
          center: new kakao.maps.LatLng(37.566826, 126.9786567),
          level: 13,
        });

        // 이벤트 리스너 등록
        document.addEventListener('mapMoveEnd', (evt) => {
          const { lon, lat } = evt.detail.center;
          const center = new kakao.maps.LatLng(lat, lon);
          this.map.setCenter(center);
        });
      });
    };
  }
}

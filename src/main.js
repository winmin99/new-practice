import Map from "ol/Map";
import {onChangeCenter, onLoadEnd, view} from "./view"
import {layers} from "./layers";
import interaction, {default as defaultInteractions, SelectInteraction} from './Interaction';
import {Fill, Stroke, Style} from 'ol/style';
import ol, {Overlay} from "ol";
import * as layer from "ol/source";
import {Modify, Select} from "ol/interaction";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";

const raster = new TileLayer({
  source: new OSM()
})

const select = new Select({
  wrapX: false,
});

const modify = new Modify({
  features: select.getFeatures(),
});

//olMap을 지도옵션으로 생성
const olMap = new Map({
  interactions: defaultInteractions.extend([select, modify]),
  layers: [
    layers
  ],
  target: "olMap",
  view: view
});

//
const selectInteraction = new SelectInteraction({ map: olMap });

// olMap.addInteraction(selectInteraction);

//모든 로드를 마치고 마지막에 현재지도의 줌level을 보여주는 이벤트
view.on('loadend', onLoadEnd);

//olMap에서 뷰값을 가져와서 센터값을 가져와서 카카오맵 센터 좌표를 따라 가게 만듬
view.on('change:center', onChangeCenter);


const selected = [];
let overlay;
olMap.on('singleclick', function(evt) {
  const clickedFeatures = olMap.getFeaturesAtPixel(evt.pixel,{hitTolerance:10});
  // console.log("뭔지확인:",clickedFeatures)
  selected.forEach(feature => {
    feature.setStyle(undefined);
  })
  selected.length = 0;
  if(clickedFeatures.length === 0){
    return
  }else if (clickedFeatures) {
    clickedFeatures.forEach(feature => {
      selected.push(feature);
    });
  }

  let coordinate = evt.coordinate; // clicked map coordinates

  if (overlay && overlay.getElement().parentNode) {
    // If the overlay already exists and is attached to the DOM, remove it
    overlay.getElement().parentNode.removeChild(overlay.getElement());
  }

  let container = document.createElement('div');
  container.classList.add('ol-popup-custom');

  let form = document.createElement('form');
  form.classList.add('popup-form');

  let label = document.createElement('label');
  label.textContent = '선택 옵션';

  let selectedList = selected.map(f => {
    const id = f.getId()
    const value= ` ${f.get('레이어')} ${f.get('관라벨')}`
    console.log("값:", `${f.get('레이어')}(${f.get('관리번호')}): ${f.get('관라벨')}`)
    return {value, id};
  })

  selectedList.forEach((value, index) => {
    let input = document.createElement('input');
    input.type = 'radio';
    input.name = 'option';
    input.value = `option ${index + 1}`;
    // Add event listener to handle radio button selection
    input.addEventListener('change', () => {
      if (input.checked) {
        const selectedFeature = selectedList.find(item => item.value === input.value);
        console.log('Selected option:', value.id);
        if (selectedFeature) {
          console.log('Selected feature:', selectedFeature.feature.getProperties());
          // Programmatically select the feature
          selected.forEach(feature => {
            if (feature.getId() === selectedFeature.id) {
              feature.setStyle(selectedStyle); // Set the desired style for the selected feature
            } else {
              feature.setStyle(undefined); // Remove style from other features
            }
          });
        }
      }
    });

  let optionLabel = document.createElement('label');
    optionLabel.textContent = value.value

    let optionContainer = document.createElement('div');
    optionContainer.classList.add('option-container');
    optionContainer.appendChild(input);
    optionContainer.appendChild(optionLabel);


    form.appendChild(optionContainer);
  });

  container.appendChild(form);

  overlay = new Overlay({
    element: container,
    position: coordinate,
    positioning: 'top-right',
    stopEvent: true // Allow events to propagate to the map
  });
  if (selected.length > 1 && view.getZoom() >= 14.3) {
    olMap.addOverlay(overlay);
  }

  console.log("좌표, 오레:",coordinate, overlay.getPosition())
});

export {olMap, selectInteraction}

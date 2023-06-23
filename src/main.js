import Map from "ol/Map";
import {onChangeCenter, onLoadEnd, view} from "./view"
import {layers} from "./layers";
import {default as defaultInteractions, SelectInteraction} from './Interaction';
import {Fill, Stroke, Style} from 'ol/style';
import ol, {Overlay} from "ol";
import * as layer from "ol/source";



//olMap을 지도옵션으로 생성
const olMap = new Map({
  interactions: defaultInteractions,
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
    const value= ` ${f.get('레이어')} ${f.get('관리번호')}`
    console.log("값:", `${f.get('레이어')}(${f.get('관리번호')}): ${f.get('관라벨')}`)
    return value;
  })
  // option1.innerHTML = `<span> ${selectedList} (총${selectedList.length}개)</span>`;

  selectedList.forEach((value, index) => {
    let input = document.createElement('input');
    input.type = 'radio';
    input.name = 'option';
    input.value = `option ${index + 1}`;
    // Add event listener to handle radio button selection
    input.addEventListener('change', () => {
      if (input.checked) {
        const selectedFeature = selectedList.find(item => item.value === input.value);
        console.log('Selected option:', input.value);
        if(selectedFeature){
          console.log('Selected feature:', selectedFeature.feature.getProperties())
        }
      }
    });

    let optionLabel = document.createElement('label');
    optionLabel.textContent = value

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
    positioning: 'bottom-center',
    stopEvent: false // Allow events to propagate to the map
  });

  olMap.addOverlay(overlay);
  console.log("좌표, 오레:",coordinate, overlay)
});









export {olMap, selectInteraction}
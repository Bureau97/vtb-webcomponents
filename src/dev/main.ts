import '../vtb-webcomponents';
import '../components/media';
import '../components/flightschedule';
import '../components/map';
import '../components/calculator';
import '../components/text';

import {Vtb} from '../vtb-webcomponents';
import {VtbFilterConfig} from '../utils/interfaces';
import {VtbFlightScheduleElement} from '../components/flightschedule';
import {VtbMediaElement} from '../components/media';
import {VtbMapElement, VtbMapOptions} from '../components/map';
import {VtbCalculatorElement} from '../components/calculator';
import {VtbTextElement} from '../components/text';

// const travelplan_source_url = '/optionals.json';
const travelplan_source_url = '/travelplan.json';

class SegmentTypes {
  readonly ADDITIONEEL: Array<number> = [3];
  readonly ARRANGEMENT: Array<number> = [1];
  readonly CARRENTAL: Array<number> = [7];
  readonly HIDE: Array<number> = [8];
  readonly FLIGHT: Array<number> = [2];
  readonly FLIGHT_ADDITIONAL: Array<number> = [6];

  readonly INTRO: Array<number> = [12];
  readonly PRAKTISCH: Array<number> = [13];
  readonly REISBESCHEIDEN: Array<number> = [19];
  readonly AANVULLINGEN: Array<number> = [14];
}
const segment_types = new SegmentTypes();

// class SegmentTypesOptional {
//   readonly ADDITIONEEL: Array<number> = [3];
//   readonly ARRANGEMENT: Array<number> = [13];
//   readonly CARRENTAL: Array<number> = [15];
//   readonly HIDE: Array<number> = [9];
//   readonly FLIGHT: Array<number> = [14, 2];
//   readonly FLIGHT_ADDITIONAL: Array<number> = [6, 18];
//   readonly NATIONAL_FLIGHT: Array<number> = [14];
//   readonly AREA: Array<number> = [13];
//   readonly INCLUSIVE: Array<number> = [7];

//   readonly INTRO: Array<number> = [12];
//   readonly PRAKTISCH: Array<number> = [13];
//   readonly REISBESCHEIDEN: Array<number> = [19];
//   readonly AANVULLINGEN: Array<number> = [14, 16];
// }
// const segment_types = new SegmentTypesOptional();

class UnitTypes {
  readonly FLIGHT: Array<number> = [6, 18];
  readonly CARRENTAL: Array<number> = [5];
  readonly MAAL: Array<number> = [3];
  readonly NACHTEN: Array<number> = [2];
  readonly INTRO_TEXT: Array<number> = [19];
  readonly TEXT: Array<number> = [13];
  readonly VRIJE_DAGEN_TEXT: Array<number> = [11];
}
const unit_types = new UnitTypes();

// class UnitTypesOptional {
//   readonly FLIGHT: Array<number> = [12];
//   readonly FLIGHT_ADDITIONAL: Array<number> = [18];
//   readonly CARRENTAL: Array<number> = [10];
//   readonly MAAL: Array<number> = [3];
//   readonly ACCO: Array<number> = [2];
//   readonly EXCURSION: Array<number> = [17];
//   readonly INTRO_TEXT: Array<number> = [19];
//   readonly TEXT: Array<number> = [7];
//   readonly VRIJE_DAGEN_TEXT: Array<number> = [11];
// }
// const unit_types = new UnitTypesOptional();

function vtbDataLoaded(vtb: Vtb) {
  console.info('vtbDataLoaded');

  // render hero content
  const h1 = document.createElement('h1');
  h1.innerHTML = vtb.title;
  const h2 = document.createElement('h2');
  h2.innerHTML = vtb.subtitle;

  const heroContentContainer = document.getElementsByClassName(
    'hero-content'
  )[0] as HTMLElement;

  heroContentContainer.innerHTML = '';
  heroContentContainer.appendChild(h1);
  heroContentContainer.appendChild(h2);

  // get info
  console.info(vtb.title + ' ' + vtb.subtitle);
  console.info(vtb.startdate?.format('D MMM'));
  console.info(vtb.duration + ' nachten');
  console.info(vtb.enddate?.format('D MMM'));
  console.info(vtb.participants);
  console.info(vtb.parties);

  // render hero using the first cover
  const hero = document.getElementById('hero') as VtbMediaElement;
  hero.src = vtb.covers[0].src;

  // add flightschedule
  const flightschedule = document.getElementById(
    'flightschedule'
  ) as VtbFlightScheduleElement;
  flightschedule.flightinfo = vtb.flightinfo;

  // accos on map
  const acco_search: VtbFilterConfig = {
    segments: [segment_types.ARRANGEMENT],
    units: [unit_types.NACHTEN],
  };

  const marker_group_accos = vtb.filter_mapmarkers(acco_search);
  marker_group_accos.connectMarkers = true;
  marker_group_accos.connectMode = 'drive';
  console.info('acco group: ', marker_group_accos);

  const map = document.getElementById('dynamic-map') as VtbMapElement;
  console.info(map);
  if (map) {
    map.markergroups = [marker_group_accos];
  }

  const map_options: VtbMapOptions = {
    connect_markers: true,
    connect_mode: 'drive',
    api_key: 'AIzaSyDQGyQupI1curGPjvcZTGvWYlvCUpFajOQ',
  };

  console.info(map_options);

  // vtb.map('complete-map', acco_search, map_options);

  // // flight on map
  // const flight_search = new VtbFilterConfig();
  // flight_search.segments = [segment_types.FLIGHT];
  // flight_search.units = [unit_types.MAAL];

  // const marker_group_flights = vtb.filter_mapmarkers(flight_search);
  // marker_group_flights.connectMarkers = true;
  // marker_group_flights.connectMode = 'flight';
  // console.info('flight group: ', marker_group_flights);

  // // add map
  // const map2 = document.getElementById('dynamic-map-flight1') as VtbMapElement;
  // console.info(map2);

  const additions_elements = vtb.filter_elements({
    segments: [segment_types.ADDITIONEEL],
    // units: [unit_types.additions],
    // optional: false,
    // participants: ['1211769']
  });
  const additions_total = vtb.calculate_price(additions_elements);

  const additionsTable = document.getElementById(
    'calc-dynamic-additions'
  ) as VtbCalculatorElement;
  additionsTable.renderElementDescription = function (element) {
    return `${element.title}`;
  };
  additionsTable.displayTotals = false;
  additionsTable.priceData = additions_elements;
  additionsTable.totalPrice = additions_total;

  // accommodations

  const all_acco_elements = vtb.filter_elements({
    segments: [segment_types.ARRANGEMENT],
    units: [unit_types.NACHTEN],
    // optional: false,
  });

  const acco_elements = vtb.filter_elements({
    segments: [segment_types.ARRANGEMENT],
    units: [unit_types.NACHTEN],
    optional: false,
  });

  const acco_total = vtb.calculate_price(acco_elements);

  const accoTable = document.getElementById(
    'calc-dynamic-accos'
  ) as VtbCalculatorElement;
  accoTable.renderElementDescription = function (element) {
    // console.info(element);
    return `Dag: ${element.day} __${element.startdate?.format('D MMM')}__ (${
      element.nights
    } ${element.nights == 1 ? 'nacht' : 'nachten'}) - ${
      element.title
    } (kamertype: ${element.subtitle}) ${
      element.optional ? '[optioneel]' : ''
    } (${element.price})`;
  };
  accoTable.getElementPrice = function (element) {
    return `${element.optional ? element.price_diff : element.price}`;
  };
  accoTable.displayTotals = true;
  accoTable.priceData = all_acco_elements;
  accoTable.totalPrice = acco_total;

  // autohuur

  const all_carrental_elements = vtb.filter_elements({
    segments: [segment_types.CARRENTAL],
    // units: [unit_types.NACHTEN],
    optional: true,
  });

  const carrental_elements = vtb.filter_elements({
    segments: [segment_types.CARRENTAL],
    // units: [unit_types.NACHTEN],
    optional: false,
  });
  const carrental_total = vtb.calculate_price(carrental_elements);

  const carrentalTable = document.getElementById(
    'calc-dynamic-carrental'
  ) as VtbCalculatorElement;
  carrentalTable.renderElementDescription = (element) =>
    `${element.nights + 1} dgn. ${element.subtitle?.replace('Type', '')} ${
      element.optional ? '[optioneel]' : ''
    } (${element.price})`;
  carrentalTable.getElementPrice = function (element) {
    return `${element.optional ? element.price_diff : element.price}`;
  };
  carrentalTable.displayTotals = true;
  carrentalTable.priceData = all_carrental_elements;
  carrentalTable.totalPrice = carrental_total;

  const flight_elements = vtb.filter_elements({
    segments: [segment_types.FLIGHT],
    // units: [unit_types.NACHTEN]
  });
  const flight_total = vtb.calculate_price(flight_elements);

  const flightTable = document.getElementById(
    'calc-dynamic-flight'
  ) as VtbCalculatorElement;
  flightTable.renderElementDescription = function (element) {
    if (element.subtitle) {
      return `${element.subtitle} ${element.optional ? '[optioneel]' : ''}`;
    }
    return `${element.grouptitle} ${element.optional ? '[optioneel]' : ''}`;
  };
  flightTable.displayTotals = false;
  flightTable.priceData = flight_elements;
  flightTable.totalPrice = flight_total;

  const flightAdditional_elements = vtb.filter_elements({
    segments: [segment_types.FLIGHT_ADDITIONAL],
    // units: [unit_types.NACHTEN]
  });
  const flightAdditional_total = vtb.calculate_price(flightAdditional_elements);

  const flightAdditionalTable = document.getElementById(
    'calc-dynamic-flightadditional'
  ) as VtbCalculatorElement;
  flightAdditionalTable.renderElementDescription = function (element) {
    if (element.subtitle) {
      return `${element.subtitle}`;
    }

    return `${element.title}`;
  };
  flightAdditionalTable.displayTotals = false;
  flightAdditionalTable.priceData = flightAdditional_elements;
  flightAdditionalTable.totalPrice = flightAdditional_total;

  // const flightTotal_elements = [...flight_elements, ...flightAdditional_elements];
  // const flightTotal_total = vtb.calculate_price(flightTotal_elements);

  // const flightTotalTable = document.getElementById('calc-dynamic-flighttotal') as VtbCalculatorElement;
  // flightTotalTable.renderElementDescription = function (element) {
  //   if (element.subtitle) {
  //     return `${element.subtitle}`;
  //   }

  //   return `${element.title}`;
  // }
  // flightTotalTable.displayTotals = true;
  // flightTotalTable.priceData = [];
  // flightTotalTable.totalPrice = flightTotal_total;

  const test_elements = vtb.filter_elements({
    segments: [segment_types.ARRANGEMENT],
    units: [unit_types.MAAL],
    participants: ['1211769'],
  });

  const test_total = vtb.calculate_price(
    vtb.filter_elements({
      optional: false,
    })
  );

  const testTable = document.getElementById(
    'calc-dynamic-test'
  ) as VtbCalculatorElement;
  testTable.renderElementDescription = function (element) {
    if (element.subtitle) {
      return `${element.subtitle}`;
    }

    return `${element.title}`;
  };
  testTable.displayTotals = true;
  testTable.priceData = test_elements;
  testTable.totalPrice = test_total;

  const vtbTextTravelplan = document.querySelector('vtb-text#travelplan');
  if (vtbTextTravelplan) {
    console.info(vtbTextTravelplan);
    const _p = document.createElement('p');
    _p.innerText = 'hello';
    vtbTextTravelplan.appendChild(_p);
  }

  const itenerary_elements = vtb.filter_groups({
    segments: [1, 2],
    units: [null], // explicitly set null!
  });
  console.info(itenerary_elements);

  const itenerary = document.getElementById('itenerary');
  if (itenerary) {
    console.info(itenerary);

    for (const itenerary_element of itenerary_elements) {
      const _h = document.createElement('h3');
      _h.innerHTML =
        'Dag ' + itenerary_element.day + ': ' + itenerary_element.title ||
        'not set';
      itenerary.appendChild(_h);

      if (itenerary_element.subtitle) {
        const _h2 = document.createElement('h4');
        _h2.innerHTML = itenerary_element.subtitle;
        itenerary.appendChild(_h2);
      }

      const _t = new VtbTextElement();

      _t.addEventListener('vtbTextChanged', (e?: Event) => {
        console.info('vtbTextChanged: ', e);
      });

      // _t.editable = true;
      _t.innerHTML = itenerary_element.description || 'not set';
      _t.id = String(itenerary_element.id);
      itenerary.appendChild(_t);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.info('DOMContentLoaded');
  new Vtb().load(travelplan_source_url).then(vtbDataLoaded);
});

import '../vtb';
import '../components/media';
import '../components/flightschedule';
import '../components/map';
import '../components/calculator';
import '../components/text';

import {Vtb} from '../vtb';
import {VtbFilterConfig} from '../utils/interfaces';
import {VtbFlightScheduleElement} from '../components/flightschedule';
import {VtbMediaElement} from '../components/media';
// import {VtbMapElement, VtbMapOptions} from '../components/map';
// import {VtbCalculatorElement} from '../components/calculator';
// import {VtbTextElement} from '../components/text';

// const travelplan_source_url = '/optionals.json';
const travelplan_source_url = '/travelplan.json';

enum SegmentTypes {
  DEFAULT = 1,
  FLIGHT = 2,
  TOESLAGEN = 3,
  REISSOM = 4,
  HIDDEN = 5,
}

enum UnitTypes {
  ACCO = 2,
  FLIGHT = 3,
  FLIGHTNIGHT = 4,
  TRANSFER = 5,
  CARRENTAL = 6,
  ACTIVITY = 10,
  EXTRA = 11,
}

document.addEventListener('DOMContentLoaded', () => {
  console.info('DOMContentLoaded');
  new Vtb().load(travelplan_source_url).then(vtbDataLoaded);
});

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

  if (!heroContentContainer) {
    console.error('heroContentContainer not found');
    return;
  }

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
  console.info(vtb.carrental);

  for (const p of vtb.participants) {
    console.info(p.fullname);
  }

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
    group_type_ids: [SegmentTypes.DEFAULT],
    element_unit_ids: [UnitTypes.ACCO, UnitTypes.ACTIVITY],
  };
  console.info('acco search: ', acco_search);

  const acco_elements = vtb.filter_elements(acco_search);
  console.info('acco elements: ', acco_elements);

  const acco_price = vtb.calculate_price({
    group_type_ids: [SegmentTypes.DEFAULT],
    element_unit_ids: [UnitTypes.ACCO, UnitTypes.ACTIVITY],
    optional: false,
  });
  console.info('acco price: ', acco_price);

  const carrrental = vtb.carrental;
  console.info('carrrental: ', carrrental);

  const carrental_price = vtb.calculate_price({
    group_type_ids: [SegmentTypes.DEFAULT],
    element_unit_ids: [UnitTypes.CARRENTAL],
    optional: false,
  });
  console.info('carrental price: ', carrental_price);

  // const marker_group_accos = vtb.filter_mapmarkers(acco_search);
  // marker_group_accos.connectMarkers = true;
  // marker_group_accos.connectMode = 'drive';
  // console.info('acco group: ', marker_group_accos);

  // const map = document.getElementById('dynamic-map') as VtbMapElement;
  // console.info(map);
  // if (map) {
  //   map.markergroups = [marker_group_accos];
  // }

  // const map_options: VtbMapOptions = {
  //   connect_markers: true,
  //   connect_mode: 'drive',
  //   api_key: 'AIzaSyDQGyQupI1curGPjvcZTGvWYlvCUpFajOQ',
  // };

  // console.info(map_options);

  // // vtb.map('complete-map', acco_search, map_options);

  // // // flight on map
  // // const flight_search = new VtbFilterConfig();
  // // flight_search.segments = [segment_types.FLIGHT];
  // // flight_search.units = [unit_types.MAAL];

  // // const marker_group_flights = vtb.filter_mapmarkers(flight_search);
  // // marker_group_flights.connectMarkers = true;
  // // marker_group_flights.connectMode = 'flight';
  // // console.info('flight group: ', marker_group_flights);

  // // // add map
  // // const map2 = document.getElementById('dynamic-map-flight1') as VtbMapElement;
  // // console.info(map2);

  // const additions_elements = vtb.filter_elements({
  //   group_type_ids: [segment_types.ADDITIONEEL],
  //   // element_unit_ids: [unit_types.additions],
  //   // optional: false,
  //   // participants: ['1211769']
  // });
  // const additions_total = vtb.calculate_price(undefined, additions_elements);

  // const additionsTable = document.getElementById(
  //   'calc-dynamic-additions'
  // ) as VtbCalculatorElement;
  // additionsTable.renderElementDescription = function (element) {
  //   return `${element.title}`;
  // };
  // additionsTable.displayTotals = false;
  // additionsTable.priceData = additions_elements;
  // additionsTable.totalPrice = additions_total;

  // // accommodations

  // const all_acco_elements = vtb.filter_elements({
  //   group_type_ids: [segment_types.ARRANGEMENT],
  //   element_unit_ids: [unit_types.NACHTEN],
  //   // optional: false,
  // });

  // const acco_elements = vtb.filter_elements({
  //   group_type_ids: [segment_types.ARRANGEMENT],
  //   element_unit_ids: [unit_types.NACHTEN],
  //   optional: false,
  // });

  // const acco_total = vtb.calculate_price(undefined, acco_elements);

  // const accoTable = document.getElementById(
  //   'calc-dynamic-accos'
  // ) as VtbCalculatorElement;
  // accoTable.renderElementDescription = function (element) {
  //   // console.info(element);
  //   return `Dag: ${element.day} __${element.startdate?.format('D MMM')}__ (${
  //     element.nights
  //   } ${element.nights == 1 ? 'nacht' : 'nachten'}) - ${
  //     element.title
  //   } (kamertype: ${element.subtitle}) ${
  //     element.optional ? '[optioneel]' : ''
  //   } (${element.price})`;
  // };
  // accoTable.getElementPrice = function (element) {
  //   return `${element.optional ? element.price_diff : element.price}`;
  // };
  // accoTable.displayTotals = true;
  // accoTable.priceData = all_acco_elements;
  // accoTable.totalPrice = acco_total;

  // // autohuur

  // const all_carrental_elements = vtb.filter_elements({
  //   group_type_ids: [segment_types.CARRENTAL],
  //   // element_unit_ids: [unit_types.NACHTEN],
  // });

  // const carrental_elements = vtb.filter_elements({
  //   group_type_ids: [segment_types.CARRENTAL],
  //   // element_unit_ids: [unit_types.NACHTEN],
  //   optional: false,
  // });
  // const carrental_total = vtb.calculate_price(undefined, carrental_elements);

  // const carrentalTable = document.getElementById(
  //   'calc-dynamic-carrental'
  // ) as VtbCalculatorElement;
  // carrentalTable.renderElementDescription = (element) =>
  //   `${element.nights + 1} dgn. ${element.subtitle?.replace('Type', '')} ${
  //     element.optional ? '[optioneel]' : ''
  //   } (${element.price})`;
  // carrentalTable.getElementPrice = function (element) {
  //   return `${element.optional ? element.price_diff : element.price}`;
  // };
  // carrentalTable.displayTotals = true;
  // carrentalTable.priceData = all_carrental_elements;
  // carrentalTable.totalPrice = carrental_total;

  // const flight_elements = vtb.filter_elements({
  //   group_type_ids: [segment_types.FLIGHT],
  //   // element_unit_ids: [unit_types.NACHTEN]
  // });
  // const flight_total = vtb.calculate_price(undefined, flight_elements);

  // const flightTable = document.getElementById(
  //   'calc-dynamic-flight'
  // ) as VtbCalculatorElement;
  // flightTable.renderElementDescription = function (element) {
  //   if (element.subtitle) {
  //     return `${element.subtitle} ${element.optional ? '[optioneel]' : ''}`;
  //   }
  //   return `${element.grouptitle} ${element.optional ? '[optioneel]' : ''}`;
  // };
  // flightTable.displayTotals = false;
  // flightTable.priceData = flight_elements;
  // flightTable.totalPrice = flight_total;

  // const flightAdditional_elements = vtb.filter_elements({
  //   group_type_ids: [segment_types.FLIGHT_ADDITIONAL],
  //   // element_unit_ids: [unit_types.NACHTEN]
  // });
  // const flightAdditional_total = vtb.calculate_price(
  //   undefined,
  //   flightAdditional_elements
  // );

  // const flightAdditionalTable = document.getElementById(
  //   'calc-dynamic-flightadditional'
  // ) as VtbCalculatorElement;
  // flightAdditionalTable.renderElementDescription = function (element) {
  //   if (element.subtitle) {
  //     return `${element.subtitle}`;
  //   }

  //   return `${element.title}`;
  // };
  // flightAdditionalTable.displayTotals = false;
  // flightAdditionalTable.priceData = flightAdditional_elements;
  // flightAdditionalTable.totalPrice = flightAdditional_total;

  // // const flightTotal_elements = [...flight_elements, ...flightAdditional_elements];
  // // const flightTotal_total = vtb.calculate_price(flightTotal_elements);

  // // const flightTotalTable = document.getElementById('calc-dynamic-flighttotal') as VtbCalculatorElement;
  // // flightTotalTable.renderElementDescription = function (element) {
  // //   if (element.subtitle) {
  // //     return `${element.subtitle}`;
  // //   }

  // //   return `${element.title}`;
  // // }
  // // flightTotalTable.displayTotals = true;
  // // flightTotalTable.priceData = [];
  // // flightTotalTable.totalPrice = flightTotal_total;

  // const test_elements = vtb.filter_elements({
  //   group_type_ids: [segment_types.ARRANGEMENT],
  //   element_unit_ids: [unit_types.MAAL],
  //   participant_ids: ['1211769'],
  // });

  // const test_total = vtb.calculate_price({
  //   optional: false,
  // });

  // const testTable = document.getElementById(
  //   'calc-dynamic-test'
  // ) as VtbCalculatorElement;
  // testTable.renderElementDescription = function (element) {
  //   if (element.subtitle) {
  //     return `${element.subtitle}`;
  //   }

  //   return `${element.title}`;
  // };
  // testTable.displayTotals = true;
  // testTable.priceData = test_elements;
  // testTable.totalPrice = test_total;

  // const vtbTextTravelplan = document.querySelector('vtb-text#travelplan');
  // if (vtbTextTravelplan) {
  //   console.info(vtbTextTravelplan);
  //   const _p = document.createElement('p');
  //   _p.innerText = 'hello';
  //   vtbTextTravelplan.appendChild(_p);
  // }

  // const itenerary_elements = vtb.filter_groups({
  //   group_type_ids: [1, 2],
  //   // element_unit_ids: [null], // explicitly set null!
  // });
  // console.info(itenerary_elements);

  // const itenerary = document.getElementById('itenerary');
  // if (itenerary) {
  //   console.info(itenerary);

  //   for (const itenerary_element of itenerary_elements) {
  //     const _h = document.createElement('h3');
  //     _h.innerHTML =
  //       'Dag ' +
  //         itenerary_element.day +
  //         (itenerary_element.nights > 1
  //           ? '-' + (itenerary_element.day + itenerary_element.nights)
  //           : '') +
  //         ': ' +
  //         itenerary_element.title || 'not set';
  //     itenerary.appendChild(_h);

  //     if (itenerary_element.subtitle) {
  //       const _h2 = document.createElement('h4');
  //       _h2.innerHTML = itenerary_element.subtitle;
  //       itenerary.appendChild(_h2);
  //     }

  //     const _t = new VtbTextElement();

  //     _t.addEventListener('vtbTextChanged', (e?: Event) => {
  //       console.info('vtbTextChanged: ', e);
  //     });

  //     // _t.editable = true;
  //     _t.innerHTML = itenerary_element.description || 'not set';
  //     _t.id = String(itenerary_element.id);
  //     itenerary.appendChild(_t);

  //     for (const element of itenerary_element.filter_elements({
  //       element_unit_ids: [2, 10],
  //     })) {
  //       const _h5 = document.createElement('h5');
  //       let title = element.title;
  //       if (element.subtitle) {
  //         title += element.subtitle;
  //       }

  //       if (element.optional) {
  //         title += ' [optioneel]';
  //       }
  //       _h5.innerHTML = element.title;

  //       itenerary.appendChild(_h5);

  //       const _p = document.createElement('p');
  //       _p.innerHTML = element.description ?? 'not set';
  //       itenerary.appendChild(_p);
  //     }
  //   }
  // }
}

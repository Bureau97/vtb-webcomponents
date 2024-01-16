import '../vtb';
import '../components/media';
import '../components/flightschedule';
import '../components/map';
import '../components/calculator';
import '../components/text';

import {Vtb} from '../vtb';
import {VtbElement} from '../models';
import {VtbFilterConfig} from '../utils/interfaces';
import {VtbFlightScheduleElement} from '../components/flightschedule';
import {VtbMediaElement} from '../components/media';
import {VtbMapOptions} from '../components/map';
import {VtbCalculatorElement, VtbCalculatorPriceElement} from '../components/calculator';
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

  // render hero content
  const heroContentContainer = document.getElementsByClassName(
    'hero-content'
  )[0] as HTMLElement;

  if (heroContentContainer) {
    const h1 = document.createElement('h1');
    h1.innerHTML = vtb.title;
    const h2 = document.createElement('h2');
    h2.innerHTML = vtb.subtitle;

    heroContentContainer.innerHTML = '';
    heroContentContainer.appendChild(h1);
    heroContentContainer.appendChild(h2);

    // render hero using the first cover
    const hero = document.getElementById('hero') as VtbMediaElement;
    hero.src = vtb.covers[0].src;
  }


  // add flightschedule
  const flightschedule = document.getElementById(
    'flightschedule'
  ) as VtbFlightScheduleElement;

  if (flightschedule) {
    console.info('flightschedule', vtb.flightinfo);
    flightschedule.flightinfo = vtb.flightinfo;
  }

  const map = document.getElementById('complete-map');
  if (map) {
    const map_options: VtbMapOptions = {
      connect_markers: true,
      connect_mode: 'flight',
      api_key: 'AIzaSyDQGyQupI1curGPjvcZTGvWYlvCUpFajOQ',
    };

    const map_search: VtbFilterConfig = {
      group_type_ids: [SegmentTypes.DEFAULT],
      element_unit_ids: [UnitTypes.ACCO],
      optional: false,
    };

    vtb.map('complete-map', map_search, map_options);
  }

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

  const acco_calculator = document.getElementById('calc-dynamic-accos') as VtbCalculatorElement;
  if (acco_calculator) {

    // accommodations
    const acco_elements = vtb.filter_elements({
      group_type_ids: [SegmentTypes.DEFAULT],
      element_unit_ids: [UnitTypes.ACCO],
      optional: false
    });

    const accoTable = document.getElementById(
      'calc-dynamic-accos'
    ) as VtbCalculatorElement;

    if (accoTable && acco_elements.length >= 1) {
      accoTable.render_element_description = function (element: VtbElement) {
        return `Dag: ${element.day}-${element.last_day} | ${element.nights
          } ${element.nights == 1 ? 'nacht' : 'nachten'} ${element.title
          } - ${element.subtitle} voor ${element.participants.length} personen ${element.optional ? '[optioneel]' : ''
          }`;
      };
      accoTable.elements = acco_elements;
    }


    // activities
    const activity_elements = vtb.filter_elements({
      group_type_ids: [SegmentTypes.DEFAULT],
      element_unit_ids: [UnitTypes.ACTIVITY],
      optional: false
    });

    const activityTable = document.getElementById(
      'calc-dynamic-activities'
    ) as VtbCalculatorElement;

    if (activityTable && activity_elements.length >= 1) {
      activityTable.render_element_description = function (element: VtbElement) {
        return `Dag: ${element.day} | ${element.title} ${element.optional ? '[optioneel]' : ''}`;
      };

      activityTable.elements = activity_elements;
    }


    // package price
    const package_total_price_element = document.getElementById('calc-dynamic-total-package') as VtbCalculatorPriceElement;
    console.info('package_total_price_element', package_total_price_element);

    if (package_total_price_element) {
      package_total_price_element.price = vtb.calculate_price({
        group_type_ids: [SegmentTypes.DEFAULT, SegmentTypes.HIDDEN],
        optional: false
      });
    }


    // flights
    const flights_elements = vtb.filter_elements({
      group_type_ids: [SegmentTypes.FLIGHT],
      element_unit_ids: [UnitTypes.FLIGHT, UnitTypes.FLIGHTNIGHT],
      optional: false
    });

    const flightsTable = document.getElementById(
      'calc-dynamic-flights'
    ) as VtbCalculatorElement;

    if (flightsTable && flights_elements.length >= 1) {
      flightsTable.render_element_description = function (element: VtbElement) {
        if (element.nights >= 1) {
          return `
            Dag: ${element.day}-${element.last_day} | ${element.title}
          `;
        }

        return `
          Dag: ${element.day} | ${element.title}
        `;
      };

      flightsTable.elements = flights_elements;
      // flightsTable.display_totals = true;
      flightsTable.total_price = vtb.calculate_price(undefined, flights_elements);
    }

    // package price
    const flights_total_price_element = document.getElementById('calc-dynamic-total-flights') as VtbCalculatorPriceElement;
    console.info('flights_total_price_element', flights_total_price_element);

    if (flights_total_price_element) {
      flights_total_price_element.price = vtb.calculate_price(undefined, flights_elements);
    }


    // car rental
    const carrental_elements = vtb.filter_elements({
      group_type_ids: [SegmentTypes.DEFAULT],
      element_unit_ids: [UnitTypes.CARRENTAL],
      optional: false,
    });

    const carrentalTable = document.getElementById(
      'calc-dynamic-carrental'
    ) as VtbCalculatorElement;


    if (carrentalTable && carrental_elements.length >= 1) {
      carrentalTable.render_element_description = (element) =>
        `${element.days} dgn. ${element.subtitle?.replace('Type', '')} ${element.optional ? '[optioneel]' : ''
        } (${element.price})`;

      carrentalTable.elements = carrental_elements;
    }


    const carrental_total_price_element = document.getElementById('calc-dynamic-total-carrental') as VtbCalculatorPriceElement;
    console.info('carrental_total_price_element', carrental_total_price_element);

    if (carrental_total_price_element) {
      carrental_total_price_element.price = vtb.calculate_price(undefined, carrental_elements);
    }

    // additions
    const additions_elements = vtb.filter_elements({
      group_type_ids: [SegmentTypes.TOESLAGEN],
    });

    const additionsTable = document.getElementById(
      'calc-dynamic-additions'
    ) as VtbCalculatorElement;

    if (additionsTable && additions_elements.length >= 1) {
      additionsTable.render_element_description = function (element) {
        return `${element.title}`;
      };

      additionsTable.elements = additions_elements;
    }


    // total price
    const totalTable = document.getElementById(
      'calc-dynamic-total'
    ) as VtbCalculatorElement;

    if (totalTable) {
      const total_price = vtb.calculate_price({
        optional: false,
      });

      totalTable.total_price = total_price;
    }

    // acco upgrades
    const upgrade_acco_elements = vtb.filter_elements({
      group_type_ids: [SegmentTypes.DEFAULT],
      element_unit_ids: [UnitTypes.ACCO],
      optional: true,
    });

    const upgradeAccoTable = document.getElementById(
      'calc-dynamic-acco-upgrades'
    ) as VtbCalculatorElement;

    if (upgradeAccoTable && upgrade_acco_elements.length >= 1) {
      upgradeAccoTable.elements = upgrade_acco_elements;
    }


    // optional activities
    const optional_activity_elements = vtb.filter_elements({
      group_type_ids: [SegmentTypes.DEFAULT],
      element_unit_ids: [UnitTypes.ACTIVITY],
      optional: true,
    });

    const optional_activity_table = document.getElementById(
      'calc-dynamic-optional-activities'
    ) as VtbCalculatorElement;

    if (optional_activity_table && optional_activity_elements.length >= 1) {
      optional_activity_table.elements = optional_activity_elements;
    }
  }







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

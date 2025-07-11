import '../vtb';
import '../components/media';
import '../components/flightschedule';
import '../components/map';
import '../components/calculator';
import '../components/text';

import {Vtb} from '../vtb';
import {VtbElement} from '../models';
import {VtbConfig, VtbFilterConfig} from '../utils/interfaces';
// import {VtbConfig} from '../utils/interfaces';
import {VtbFlightScheduleElement} from '../components/flightschedule';
import {VtbMediaElement} from '../components/media';
import {VtbMapOptions} from '../components/map';
import {
  VtbCalculatorElement,
  VtbCalculatorPriceElement
} from '../components/calculator';
import {VtbTextElement} from '../components/text';
import {currency} from '../utils/currency';
import {strip_tags} from '../utils/string';

// const travelplan_source_url = '/optionals.json';
const travelplan_source_url = '/travelplan.json';

const TEXT_EDIT_MODE_ENABLED = false;
const GOOGLE_MAPS_KEY = '***SyDQGyQupI1curGPjvcZTGvWYlvCUpFajOQ';

enum SegmentTypes {
  DEFAULT = 1,
  FLIGHT = 2,
  TOESLAGEN = 3,
  REISSOM = 4,
  HIDDEN = 5
}

enum UnitTypes {
  DAYS = 1,
  ACCO = 2,
  FLIGHT = 3,
  FLIGHTNIGHT = 4,
  TRANSFER = 5,
  TRANSFERNIGHT = 12,
  CARRENTAL = 6,
  CAMPER_RENTAL = 7,
  ACTIVITY = 10,
  ACTIVITYNIGHT = 13,
  EXTRA = 11,
  DRIVER = 14
}

const currency_transformer = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR'
});

function currency(value: number | null): string {
  if (value) {
    return currency_transformer.format(value);
  }
  return String(value);
}

function vtbTextChanged(e?: Event) {
  console.info('vtbTextChanged: ', e);
}

document.addEventListener('DOMContentLoaded', () => {
  console.info('DOMContentLoaded');

  const config: VtbConfig = {
    calculate_flight_duration: true
  };

  const vtb = new Vtb(config);

  if (vtb.is_live_preview) {
    console.info('initialize live preview');
    vtb.load().then(vtbDataLoaded);
  } else {
    console.info('initialize static preview');
    vtb.load(travelplan_source_url).then(vtbDataLoaded);
  }

  // new Vtb(config).load(travelplan_source_url).then(vtbDataLoaded);
});

// function vtbDataLoaded(vtb: Vtb) {
//   console.info('vtbDataLoaded');
//   console.debug(vtb);
// }

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
    if (vtb.covers.length > 0) {
      const hero = document.getElementById('hero') as VtbMediaElement;
      if (hero && vtb.covers[0].src) {
        hero.src = vtb.covers[0].src;
      }
    }
  }

  const strip_tags__test_string =
    '<strong>Uitgebreide map met reisbescheiden</strong><ul><li><strong><span style="color:#ff0000;">Ophalen in kantoor Haarlem&nbsp;</span></strong></li><li><strong><span style="color:#ff0000;">Per post verstuurd&nbsp;</span></strong></li><li><strong><span style="color:#ff0000;">Per post verstuurd buiten Nederland</span></strong></li><li>incl. kofferlabels</li><li>een geplastificeerde kaart van Suriname</li><li><a href="https://t.sidekickopen45.com/s3t/c/5/f18dQhb0S7kF8bNRfbW5gJqVg2zGCwVW8Jbw_88pTtbdVngXKT1p1Fc4W16gGz047cl5k101?te=W3R5hFj4cm2zwW4mKLS-4fGBq9W4cQhc81JD4TGW3ZSz5q3K72cXW4hLygg3zdxsh0&amp;si=7000000002374076&amp;pi=f1bf3d7a-1ed4-4f24-9c6f-d56416978b17" target="_blank">Te Gast in Suriname</a>&nbsp;boekje</li><li>&euro; 5,00 wordt gedoneerd&nbsp;aan <a href="https://treesforall.nl/">Trees for All</a> voor CO2 compensatie</li></ul>';

  const strip_tags__test1 = document.getElementById('strip_tags__test1');
  if (strip_tags__test1) {
    strip_tags__test1.innerHTML =
      '<h1>Original:</h1>' + strip_tags__test_string;
  }
  const strip_tags__test2 = document.getElementById('strip_tags__test2');
  if (strip_tags__test2) {
    strip_tags__test2.innerHTML =
      '<h1>w/o excludes: </h1>' + strip_tags(strip_tags__test_string);
  }

  const strip_tags__test3 = document.getElementById('strip_tags__test3');
  if (strip_tags__test3) {
    strip_tags__test3.innerHTML =
      '<h1>with excludes:</h1> ' +
      strip_tags(strip_tags__test_string, ['a', 'strong']);
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
      api_key: GOOGLE_MAPS_KEY,
      default_labels: false
    };

    const map_search: VtbFilterConfig = {
      group_type_ids: [SegmentTypes.DEFAULT],
      element_unit_ids: [UnitTypes.ACCO],
      optional: false
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

  const acco_calculator = document.getElementById(
    'calc-dynamic-accos'
  ) as VtbCalculatorElement;
  if (acco_calculator) {
    // accommodations
    const acco_elements = vtb.filter_elements({
      group_type_ids: [SegmentTypes.DEFAULT],
      element_unit_ids: [UnitTypes.ACCO, UnitTypes.DAYS],
      optional: false
    });

    const accoTable = document.getElementById(
      'calc-dynamic-accos'
    ) as VtbCalculatorElement;

    if (accoTable && acco_elements.length >= 1) {
      accoTable.render_element_description = function (element: VtbElement) {
        return `Dag: ${element.day}-${element.last_day} |
        ${element.nights} ${element.nights == 1 ? 'nacht' : 'nachten'}
        ${element.title}
        `;
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
      activityTable.render_element_description = function (
        element: VtbElement
      ) {
        return `Dag: ${element.day} | ${element.title} ${
          element.optional ? '[optioneel]' : ''
        }`;
      };

      activityTable.elements = activity_elements;
    }

    // package price
    const package_total_price_element = document.getElementById(
      'calc-dynamic-total-package'
    ) as VtbCalculatorPriceElement;
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
      flightsTable.total_price = vtb.calculate_price(
        undefined,
        flights_elements
      );
    }

    // package price
    const flights_total_price_element = document.getElementById(
      'calc-dynamic-total-flights'
    ) as VtbCalculatorPriceElement;
    console.info('flights_total_price_element', flights_total_price_element);

    if (flights_total_price_element) {
      flights_total_price_element.price = vtb.calculate_price(
        undefined,
        flights_elements
      );
    }

    // car rental
    const carrental_elements = vtb.filter_elements({
      group_type_ids: [SegmentTypes.DEFAULT],
      element_unit_ids: [UnitTypes.CARRENTAL, UnitTypes.CAMPER_RENTAL]
      // optional: false
    });

    console.info('carrental_elements', carrental_elements);

    const carrentalTable = document.getElementById(
      'calc-dynamic-carrental'
    ) as VtbCalculatorElement;

    if (carrentalTable && carrental_elements.length >= 1) {
      carrentalTable.render_element_description = (element) =>
        `${element.days} dgn. ${element.subtitle?.replace('Type', '')} ${
          element.optional ? '[optioneel]' : ''
        } (${element.price})`;

      carrentalTable.elements = carrental_elements;
    }

    const carrental_total_price_element = document.getElementById(
      'calc-dynamic-total-carrental'
    ) as VtbCalculatorPriceElement;
    console.info(
      'carrental_total_price_element',
      carrental_total_price_element
    );

    if (carrental_total_price_element) {
      carrental_total_price_element.price = vtb.calculate_price(
        undefined,
        carrental_elements
      );
    }

    // additions
    const additions_elements = vtb.filter_elements({
      group_type_ids: [SegmentTypes.TOESLAGEN]
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
        optional: false
      });

      totalTable.total_price = total_price;
    }

    // acco upgrades
    const upgrade_acco_elements = vtb.filter_elements({
      group_type_ids: [SegmentTypes.DEFAULT],
      element_unit_ids: [UnitTypes.ACCO],
      optional: true
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
      optional: true
    });

    const optional_activity_table = document.getElementById(
      'calc-dynamic-optional-activities'
    ) as VtbCalculatorElement;

    if (optional_activity_table && optional_activity_elements.length >= 1) {
      optional_activity_table.elements = optional_activity_elements;
    }
  }

  // itinerary
  const itinerary_groups = vtb.filter_groups({
    // group_type_ids: [SegmentTypes.DEFAULT, SegmentTypes.FLIGHT]
  });

  const itinerary = document.getElementById('itinerary');
  if (itinerary) {
    // walk over all element groups

    const h1 = document.createElement('h1');
    h1.innerHTML = vtb.title;
    const h2 = document.createElement('h2');
    h2.innerHTML = `voor ${vtb.subtitle}`;

    itinerary.appendChild(h1);
    itinerary.appendChild(h2);

    const _hrtitle = document.createElement('hr');
    itinerary.appendChild(_hrtitle);

    for (const itinerary_group of itinerary_groups) {
      const _h = document.createElement('h2');
      _h.innerHTML =
        'Dag ' +
          itinerary_group.day +
          (itinerary_group.nights >= 1 ? '-' + itinerary_group.last_day : '') +
          ': ' +
          itinerary_group.title || 'not set';
      itinerary.appendChild(_h);

      if (itinerary_group.subtitle) {
        const _h2 = document.createElement('h3');
        _h2.innerHTML = itinerary_group.subtitle;
        itinerary.appendChild(_h2);
      }

      // add VTB Text element to be able to edit the description
      const _t = new VtbTextElement();
      _t.addEventListener('vtbTextChanged', vtbTextChanged);
      _t.editable = TEXT_EDIT_MODE_ENABLED;
      _t.innerHTML = itinerary_group.description || 'not set';
      _t.id = String(itinerary_group.id);
      itinerary.appendChild(_t);

      // show accos
      for (const element of itinerary_group.filter_elements({})) {
        const _h3 = document.createElement('h4');

        let title = element.title;
        if (element.subtitle) {
          title += ` [${element.subtitle}]`;
        }

        if (element.optional) {
          title += ' (optioneel)';
        }
        _h3.innerHTML = title;
        itinerary.appendChild(_h3);

        const _p = new VtbTextElement();
        _p.id = String(element.id);
        _p.addEventListener('vtbTextChanged', vtbTextChanged);
        _p.editable = TEXT_EDIT_MODE_ENABLED;
        _p.innerHTML = element.description ?? 'not set';
        itinerary.appendChild(_p);

        // show all units for this acco
        const units_list = document.createElement('ul');
        for (const unit of element.units) {
          const _u = document.createElement('li');
          _u.id = unit.id;

          let content = '';

          if (unit.quantity > 1) {
            content += unit.quantity + 'x ' + unit.title;
          } else {
            content += unit.title;
          }

          content += ` (voor ${unit.participant_prices.length} ${
            unit.participant_prices.length === 1 ? 'persoon' : 'personen'
          })`;

          if (unit.optional) {
            content += ' (optioneel)';
          }

          if (unit.price) {
            content += ` (${currency(unit.price)})`;
          }

          if (unit.price_diff != 0) {
            content += ` (${
              unit.price_diff > 0 ? 'meerprijs' : 'korting'
            }: ${currency(unit.price_diff)})`;
          }

          _u.innerHTML = content;
          units_list.appendChild(_u);
        }

        itinerary.appendChild(units_list);
      }

      const _hr = document.createElement('hr');
      itinerary.appendChild(_hr);
    }

    // const _debug = document.getElementById('debug');
    // if (_debug) {
    //   _debug.innerHTML = JSON.stringify(vtb, null, 2);
    // }

    console.warn('--- debug non optional ---');

    const debug_non_optional = document.getElementById('debug-non-optional');
    if (debug_non_optional) {
      const non_optional_elements = vtb.filter_elements({
        optional: false
      });

      let non_optional_content = '';
      for (const element of non_optional_elements) {
        non_optional_content += `* ${element.title} \n`;

        for (const unit of element.units) {
          non_optional_content += `   ${unit.quantity}x  ${unit.title} ${unit.optional ? '[optioneel]' : ''} ${currency(unit.price_diff || unit.price)}\n`;
        }
      }

      non_optional_content += `Totaal: {${currency(
        vtb.calculate_price({
          optional: false
        })
      )}}\n`;

      debug_non_optional.innerHTML = non_optional_content;
    }

    console.warn('--- debug only optional ---');

    const debug_only_optional = document.getElementById('debug-only-optional');
    if (debug_only_optional) {
      const non_optional_elements = vtb.filter_elements({
        optional: true
      });

      let non_optional_content = '';
      for (const element of non_optional_elements) {
        non_optional_content += `* ${element.title} \n`;

        for (const unit of element.units) {
          non_optional_content += `   ${unit.quantity}x  ${unit.title} ${unit.optional ? '[optioneel]' : ''} ${currency(unit.price_diff || unit.price)}\n`;
        }
      }

      debug_only_optional.innerHTML = non_optional_content;
    }
  }
}

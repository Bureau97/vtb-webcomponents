import '../vtb-webcomponents';
import '../components/media';
import '../components/flightschedule';

// import '../components/map';

import {Vtb} from '../vtb-webcomponents';
import {VtbFlightScheduleElement} from '../components/flightschedule';
import { VtbMapElement } from '../components/map';
import { VtbMediaElement } from '../components/media';

// const travelplan_source_url = '/optionals.json';
const travelplan_source_url = '/travelplan.json';

// // class SegmentTypes {
// //   readonly ADDITIONEEL: Array<number> = [3];
// //   readonly ARRANGEMENT: Array<number> = [1];
// //   readonly CARRENTAL: Array<number> = [7];
// //   readonly HIDE: Array<number> = [8];
// //   readonly FLIGHT: Array<number> = [4];
// //   readonly FLIGHT_ADDITIONAL: Array<number> = [6];

// //   readonly INTRO: Array<number> = [12];
// //   readonly PRAKTISCH: Array<number> = [13];
// //   readonly REISBESCHEIDEN: Array<number> = [19];
// //   readonly AANVULLINGEN: Array<number> = [14];
// // }

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

// const segmentTypes = new SegmentTypesOptional();

// // class UnitTypes {
// //   readonly FLIGHT: Array<number> = [6, 18];
// //   readonly CARRENTAL: Array<number> = [5];
// //   readonly MAAL: Array<number> = [3];
// //   readonly NACHTEN: Array<number> = [2];
// //   readonly INTRO_TEXT: Array<number> = [19];
// //   readonly TEXT: Array<number> = [13];
// //   readonly VRIJE_DAGEN_TEXT: Array<number> = [11];
// // }

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

// const unitTypes = new UnitTypesOptional();

function vtbDataLoaded(vtb: Vtb) {
  console.info('vtbDataLoaded');

  console.info(vtb.title + ' ' + vtb.subtitle);
  console.info(vtb.startdate?.format('D MMM'));
  console.info(vtb.duration + ' nachten');
  console.info(vtb.enddate?.format('D MMM'));
  console.info(vtb.participants);
  console.info(vtb.parties);

  // console.info(vtb.extra_fields);
  // console.info(vtb.carRentalElements);
  // for (const element of vtb.car_rental_elements) {
  //   console.info(
  //     element.day,
  //     element.title,
  //     element.subtitle,
  //     element.price_diff
  //   );
  // }

  // console.info(segmentTypes);

  // const flights_search = new VtbFilterConfig();
  // flights_search.segments = [segmentTypes.FLIGHT];

  // const flight_elements = vtb.filter(flights_search);

  console.info(vtb.flightinfo);

  const flightschedule = document.getElementById(
    'flightschedule'
  ) as VtbFlightScheduleElement;
  flightschedule.flightinfo = vtb.flightinfo;

  const map = document.getElementById('map') as VtbMapElement;
  console.info(map);
  // map.markergroups = vtb.markergroups;

  console.info(vtb.covers);
  const hero = document.getElementById('hero') as VtbMediaElement;
  console.info(hero);
  console.info(vtb.covers);
  hero.src = vtb.covers[0].src;
}

document.addEventListener('DOMContentLoaded', () => {
  console.info('DOMContentLoaded');
  new Vtb().load(travelplan_source_url).then(vtbDataLoaded);
});

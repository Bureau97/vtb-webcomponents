import '../vtb-webcomponents';
import '../components/media';
import '../components/flightschedule';
import '../components/map';

import {Vtb, VtbFilterConfig} from '../vtb-webcomponents';
import {VtbFlightScheduleElement} from '../components/flightschedule';
import {VtbMediaElement} from '../components/media';
import {VtbMapElement, VtbMapOptions} from '../components/map';

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
}

document.addEventListener('DOMContentLoaded', () => {
  console.info('DOMContentLoaded');
  new Vtb().load(travelplan_source_url).then(vtbDataLoaded);
});

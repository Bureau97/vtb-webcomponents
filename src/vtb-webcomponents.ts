import {VtbFilterConfig} from './utils/interfaces';

import {
  VtbTravelPlanData,
  VtbElement,
  VtbElementGroup,
  VtbMapMarkerGroup,
  VtbMapMarkerConnectMode,
} from './models';
import {VtbDataTransformer} from './utils/transformer';
import {VtbMapElement, VtbMapOptions} from './components/map';
import {
  VtbFlightScheduleElement,
  VtbFlightScheduleOptions,
} from './components/flightschedule';

export class Vtb {
  private _data: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(vtb_parsed_data?: VtbTravelPlanData) {
    if (vtb_parsed_data) {
      this._data = vtb_parsed_data;
    }
  }

  get title() {
    return this._data.title;
  }

  get subtitle() {
    return this._data.subtitle;
  }

  get startdate() {
    return this._data.start_date;
  }

  get enddate() {
    return this._data.end_date;
  }

  get duration() {
    return this._data.duration;
  }

  get sales_price() {
    return this._data.sales_price;
  }

  get flight_info() {
    return this._data.flight_elements;
  }

  get participants() {
    return this._data.participants;
  }

  get parties() {
    return this._data.parties;
  }

  get flightinfo() {
    return this._data.flight_elements;
  }

  get carrental() {
    return this._data.car_rental_elements;
  }

  get extra_fields() {
    return this._data.extra_fields;
  }

  get days() {
    return this._data.days;
  }

  get covers() {
    return this._data.covers;
  }

  async load(travelplan_source_url: string) {
    // async load of travelplan json
    console.info('Loading', travelplan_source_url);
    const response = await fetch(travelplan_source_url);
    const vtbSrcData = await response.json();
    this._data = new VtbDataTransformer().parse_vtb_data(vtbSrcData);
    // console.info(this._data);
    return this;
  }

  filter_elements(config?: VtbFilterConfig) {
    const vtb_elements: Array<VtbElement> = [];

    const _segment_ids =
      config?.segments || Object.keys(this._data.element_groups);
    const segment_ids = _segment_ids.flat(Infinity);

    const _unit_ids = config?.units || [];
    const unit_ids = _unit_ids.flat(Infinity);

    const _participant_ids = config?.participants || [];
    const participant_ids = _participant_ids.flat(Infinity);

    let check_unit_ids = false;
    if (unit_ids.length >= 1) {
      check_unit_ids = true;
    }

    let check_participant_ids = false;
    if (participant_ids.length >= 1) {
      check_participant_ids = true;
    }

    let skip_optional = false;
    if (config?.optional === false) {
      skip_optional = true;
    }

    let only_optional = false;
    if (config?.optional === true) {
      only_optional = true;
    }

    for (const segment_id of segment_ids) {
      const segments = this._data.element_groups[Number(segment_id)];

      if (!segments || !segments.length) {
        continue;
      }

      for (const segment of segments) {
        for (const unit_id of Object.keys(segment.elements)) {
          if (
            !check_unit_ids ||
            (check_unit_ids && unit_ids.includes(Number(unit_id)))
          ) {
            if (!skip_optional && !check_participant_ids && !only_optional) {
              vtb_elements.push(...segment.elements[unit_id]);
              continue;
            }

            // additional checks
            const units: Array<VtbElement> = [];
            for (const u of segment.elements[unit_id]) {
              // check on optional
              if (
                (skip_optional && u.optional) ||
                (only_optional && !u.optional)
              ) {
                continue;
              }

              // if no check for participants is required
              if (!check_participant_ids) {
                units.push(u);
                continue;
              }

              // check participants
              if (check_participant_ids && u.participants) {
                // make a shallow copy so we're not messing with the original price element
                const u_copy = {...u};

                let participants_unit_price = 0.0;
                for (const p of u.participants) {
                  if (participant_ids.includes(p.participant_id.toString())) {
                    participants_unit_price += p.price;
                  }
                }
                u_copy.price = participants_unit_price;
                units.push(u);
              }
            }
            vtb_elements.push(...units);
          }
        }
      }
    }

    return vtb_elements;
  }

  filter_groups(config: VtbFilterConfig): Array<VtbElementGroup> {
    const _segment_ids =
      config?.segments || Object.keys(this._data.element_groups);
    const segment_ids = _segment_ids.flat(Infinity);

    const _unit_ids = config?.units || [];
    const unit_ids = _unit_ids.flat(Infinity);

    // const _participant_ids = config?.participants || [];
    // const participant_ids = _participant_ids.flat(Infinity);

    const vtb_element_groups: Array<VtbElementGroup> = [];

    for (const segment_id of segment_ids) {
      const segments = this._data.element_groups[Number(segment_id)];

      if (unit_ids.length) {
        for (const segment of segments) {
          if (segment.unit_id == undefined && unit_ids.includes(null)) {
            vtb_element_groups.push(segment);
          }
        }
      } else {
        vtb_element_groups.push(...segments);
      }
    }
    return vtb_element_groups;
  }

  filter_mapmarkers(config: VtbFilterConfig): VtbMapMarkerGroup {
    const vtb_marker_elements: Array<VtbElement> = this.filter_elements(config);

    const group = new VtbMapMarkerGroup();
    for (const element of vtb_marker_elements) {
      if (element.location) {
        group.markers.push(element.location);
      }
    }

    return group;
  }

  calculate_price(elements: Array<VtbElement>) {
    let total = 0.0;
    // console.info(elements)

    for (const element of elements) {
      if (element && !element.optional) {
        total += element.price;
      }
    }

    return total;
  }

  map(
    container_id: string,
    filter_config: VtbFilterConfig,
    map_options: VtbMapOptions
  ): VtbMapElement {
    const marker_group = this.filter_mapmarkers(filter_config);
    marker_group.connectMarkers = map_options.connect_markers;
    marker_group.connectMode =
      map_options.connect_mode as VtbMapMarkerConnectMode;

    const map = new VtbMapElement();
    map.apiKey = map_options.api_key;
    map.height = map_options.height || 500;
    map.width = map_options.width;
    map.zoom = map_options.zoom;
    map.markergroups = [marker_group];

    const container = document.getElementById(container_id);
    container?.appendChild(map);

    return map;
  }

  flightschedule(
    container_id: string,
    filter_config?: VtbFilterConfig,
    flightschedule_options?: VtbFlightScheduleOptions
  ) {
    // to do
    console.debug(
      'flightschedule',
      container_id,
      filter_config,
      flightschedule_options
    );

    const flightschedule = new VtbFlightScheduleElement();
    flightschedule.flightinfo = this.flightinfo;
    if (flightschedule_options?.dateformat) {
      flightschedule.dateformat = flightschedule_options.dateformat;
    }

    const container = document.getElementById(container_id);
    container?.appendChild(flightschedule);

    return flightschedule;
  }
}

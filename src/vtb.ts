import {VtbFilterConfig} from './utils/interfaces.js';

import {
  VtbTravelPlanData,
  VtbElement,
  VtbElementGroup,
  VtbMapMarkerGroup,
  VtbExtraField,
  VtbParticipant,
} from './models.js';
import {VtbMapMarkerConnectMode} from './utils/types.js';
import {VtbDataTransformer} from './utils/transformer.js';
import {VtbMapElement, VtbMapOptions} from './components/map.js';
import {
  VtbFlightScheduleElement,
  VtbFlightScheduleOptions,
} from './components/flightschedule.js';

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

  get covers() {
    return this._data.covers;
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

  get days() {
    return this.duration;
  }

  get nights() {
    return this.duration - 1;
  }

  get sales_price() {
    return this._data.sales_price;
  }

  get has_flightinfo(): boolean {
    return this.flightinfo.length > 0;
  }

  get flight_info() {
    return this.flightinfo;
  }

  get participants(): Array<VtbParticipant> {
    return Object.values(this._data.participants);
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

  public extra_field(name: string): VtbExtraField | null {
    return this._data.extra_fields[name] || null;
  }

  public extraField(name: string) {
    return this.extra_field(name);
  }

  public async load(travelplan_source_url: string): Promise<Vtb> {
    // async load of travelplan json
    console.info('Loading', travelplan_source_url);
    const response = await fetch(travelplan_source_url);
    const vtbSrcData = await response.json();
    this.parse_vtb_data(vtbSrcData);
    // console.info(this._data);
    return this;
  }

  public parse_vtb_data(
    vtbSrcData: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ): void {
    this._data = new VtbDataTransformer().parse_vtb_data(vtbSrcData);
  }

  get element_groups(): Array<VtbElementGroup> {
    return this._data.element_groups;
  }

  public filter_groups(config: VtbFilterConfig): Array<VtbElementGroup> {
    return this._data.filter_element_groups(config);
  }

  public filter_elements(config?: VtbFilterConfig): Array<VtbElement> {
    return this._data.filter_elements(config);
  }

  public calculate_price(
    config?: VtbFilterConfig,
    elements?: Array<VtbElement>
  ): number {
    // console.info('calculate_price: ', config, elements);
    if (!elements) {
      elements = this.filter_elements(config ?? {});
    }
    // console.info('calculate_price: ', elements);

    let total = 0.0;
    for (const element of elements) {
      if (element && !element.optional) {
        total += element.price;
      }
    }

    // console.info('calculate_price: ', total);

    return total;
  }

  public map(
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

  public filter_mapmarkers(config: VtbFilterConfig): VtbMapMarkerGroup {
    const vtb_marker_elements: Array<VtbElement> = this.filter_elements(config);

    const group = new VtbMapMarkerGroup();
    for (const element of vtb_marker_elements) {
      if (element.location) {
        group.markers.push(element.location);
      }
    }

    return group;
  }

  public flightschedule(
    container_id: string,
    filter_config?: VtbFilterConfig,
    flightschedule_options?: VtbFlightScheduleOptions
  ): VtbFlightScheduleElement {
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

  // public pricetable(
  //   container_id: string,
  //   filter_config?: VtbFilterConfig,
  //   flightschedule_options?: VtbFlightScheduleOptions
  // ) {
  //   // to do
  // }
}

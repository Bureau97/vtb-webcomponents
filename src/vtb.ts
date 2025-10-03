/**
 *
 * Copyright 2024 Huub Segers - B97
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import {type Dayjs} from 'dayjs';

import {VtbConfig, VtbFilterConfig} from './utils/interfaces.js';

import {
  VtbTravelPlanData,
  VtbElement,
  VtbElementGroup,
  VtbMapMarkerGroup,
  VtbExtraField,
  VtbParticipant,
  VtbParty,
  VtbMedia,
  VtbFlightData
} from './models.js';
import {VtbMapMarkerConnectMode} from './utils/types.js';
import {VtbDataTransformer} from './utils/transformer.js';
import {VtbMapElement, VtbMapOptions} from './components/map.js';
import {
  VtbFlightScheduleElement,
  VtbFlightScheduleOptions
} from './components/flightschedule.js';

import {PreviewDataLoader} from './utils/preview.js';

export class Vtb {
  private _data: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  private _config?: VtbConfig;
  private _dataLoader?: PreviewDataLoader;

  /**
   * @constructor
   *
   * @param vtb_config_options VtbConfig
   */
  constructor(vtb_config_options?: VtbConfig) {
    if (vtb_config_options) {
      this._config = vtb_config_options;
    }
  }

  /**
   * @property
   *
   * @returns {boolean}
   */
  get is_live_preview(): boolean {
    const current = new URL(window.location.href);

    if (
      current.searchParams.get('key') &&
      current.searchParams.get('key') !== ''
    ) {
      return true;
    }
    return false;
  }

  private get _is_initialized(): boolean {
    const initialized = !!this._data;

    if (!initialized) {
      console.error('Vtb data not initialized!');
    }

    return initialized;
  }

  get title(): string {
    return this._is_initialized ? this._data.title : '';
  }

  get subtitle(): string {
    return this._is_initialized ? this._data.subtitle : '';
  }

  get covers(): Array<VtbMedia> {
    return this._is_initialized ? this._data.covers : [];
  }

  get startdate(): Dayjs | undefined {
    return this._data.start_date;
  }

  get enddate(): Dayjs | undefined {
    return this._data.end_date;
  }

  get duration(): number | undefined {
    return this._data.duration;
  }

  get days(): number | undefined {
    return this.duration;
  }

  get nights(): number | undefined {
    return this.duration ? this.duration - 1 : undefined;
  }

  get sales_price(): number | undefined {
    return this._data.sales_price;
  }

  get has_flightinfo(): boolean {
    return this.flightinfo.length > 0;
  }

  get flight_info() {
    /** Alias for flightinfo */
    return this.flightinfo;
  }

  get participants(): Array<VtbParticipant> {
    if (!this._data.participants) {
      return [];
    }
    return Object.values(this._data.participants);
  }

  get parties(): Array<VtbParty> {
    return this._data.parties;
  }

  get flightinfo(): Array<VtbFlightData> {
    return this._data.flight_elements;
  }

  get has_carrental(): boolean {
    return this.carrental.length > 0;
  }

  get carrental(): Array<VtbElement> {
    return this._data.car_rental_elements;
  }

  get extra_fields() {
    return this._data.extra_fields;
  }

  public extra_field(name: string): VtbExtraField | null {
    console.warn('deprecated call, use extra_fields getter instead');
    return this._data.extra_fields[name] || null;
  }

  public extraField(name: string) {
    console.warn('deprecated call, use extra_fields getter instead');
    return this.extra_field(name);
  }

  public async load_preview(
    key?: string,
    token?: string
  ): Promise<VtbTravelPlanData> {
    if (!key && !token) {
      const url = new URL(window.location.href);
      const _key = url.searchParams.get('key');
      if (_key) {
        key = _key;
      }

      const _token = url.searchParams.get('token');
      if (_token) {
        token = _token;
      }
    }

    console.info(['Loading preview', key, token]);

    if (!key) {
      throw new Error('Missing key..');
    }

    if (!this._dataLoader) {
      this._dataLoader = new PreviewDataLoader(key, token);
    }

    return this._dataLoader.requestTravelplan();
  }

  public async load(travelplan_source_url?: string): Promise<Vtb> {
    if (travelplan_source_url && !this.is_live_preview) {
      console.info('Loading static...', travelplan_source_url);

      const response = await fetch(travelplan_source_url);
      const vtbSrcData = await response.json();
      this.parse_vtb_data(vtbSrcData);
      return this;
    }

    if (this.is_live_preview) {
      console.info('Loading preview..');

      const travelplan_data = await this.load_preview();

      console.info('VTB::Load (preview)');
      console.info(travelplan_data);

      this.parse_vtb_data(travelplan_data);
      return this;
    }

    if (!travelplan_source_url && !this.is_live_preview) {
      console.error('No travelplan source url provided');
    }

    // public async load(travelplan_source_url: string): Promise<Vtb> {
    //   // async load of travelplan json
    //   console.debug('Loading', travelplan_source_url);
    //   const response = await fetch(travelplan_source_url);
    //   const vtbSrcData = await response.json();
    //   this.parse_vtb_data(vtbSrcData);
    return this;
  }

  public parse_vtb_data(
    vtbSrcData: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ): void {
    const vtb_config = this._config;
    this._data = new VtbDataTransformer(vtb_config).parse_vtb_data(vtbSrcData);
  }

  set data(data: VtbTravelPlanData) {
    this._data = data;
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
    // marker_group.markers.sort((x: VtbElement, y: VtbElement) => {
    //   return x.day - y.day
    // });
    // marker_group.connectMarkers = map_options.connect_markers;
    marker_group.connectMode =
      map_options.connect_mode as VtbMapMarkerConnectMode;

    const map = new VtbMapElement();
    map.apiKey = map_options.api_key;
    map.height = map_options.height || 500;
    map.width = map_options.width;
    map.zoom = map_options.zoom;
    map.markergroups = [marker_group];
    map.default_labels = map_options.default_labels || false;

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
    // console.debug(
    //   'flightschedule',
    //   container_id,
    //   filter_config,
    //   flightschedule_options
    // );

    const flightschedule = new VtbFlightScheduleElement();
    if (!filter_config) {
      flightschedule.flightinfo = this.flightinfo;
    } else {
      // TODO:
      console.debug(
        'using filter config on flight element is not implemented yet'
      );
      // flightschedule.flightinfo = this.filter_flightinfo(filter_config);
    }

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

  /**
   * merge element groups of possibly different types
   * into one with all elements, media en concatted description
   * of those groups
   *
   * @param element_groups
   * @returns
   */
  public merge_groups_by_day(
    element_groups: Array<VtbElementGroup>
  ): Array<VtbElementGroup> {
    const ret: Array<VtbElementGroup> = [];

    let last_group: VtbElementGroup | null = null;

    for (const group of element_groups) {
      // skip carrental groups ??
      // if (group.is_carrental) {
      //   continue;
      // }

      const current_group: VtbElementGroup = group.clone();

      // if (group.elements.length <= 0) {
      //   continue;
      // }

      if (!last_group) {
        // console.info('set last group from current group', current_group);
        last_group = current_group;
        continue;
      }

      if (current_group.day == last_group.day) {
        // console.info(
        //   'current group day == last group day: ',
        //   current_group.day
        // );
        // if the next group has the same day
        // we add it its elements to the current group
        const elements: Array<VtbElement> = current_group.elements;
        for (const element of elements) {
          last_group?.add_element(element);
        }

        // set title if no title was set
        if (!last_group.title && current_group.title) {
          last_group.title = current_group.title;
        }

        // concat description
        if (current_group.description) {
          last_group.description += current_group.description;
        }

        // set the nights as the highest number of nights
        if (last_group.nights < current_group.nights) {
          last_group.nights = current_group.nights;
          last_group.enddate = current_group.enddate;
        }

        // merge all media
        if (current_group.media.length > 0) {
          last_group.media.push(...current_group.media);
        }
      } else {
        ret.push(last_group);
        last_group = current_group;
      }
    }

    if (last_group && ret[ret.length - 1] !== last_group) {
      ret.push(last_group);
    }

    return ret;
  }
}

import { VtbMapMarkerGroup, } from './models.js';
import { VtbDataTransformer } from './utils/transformer.js';
import { VtbMapElement } from './components/map.js';
import { VtbFlightScheduleElement, } from './components/flightschedule.js';
export class Vtb {
    constructor(vtb_parsed_data) {
        this._data = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
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
    get has_flightinfo() {
        return this.flightinfo.length > 0;
    }
    get flight_info() {
        return this.flightinfo;
    }
    get participants() {
        return Object.values(this._data.participants);
    }
    get parties() {
        return this._data.parties;
    }
    get flightinfo() {
        return this._data.flight_elements;
    }
    get has_carrental() {
        return this.carrental.length > 0;
    }
    get carrental() {
        return this._data.car_rental_elements;
    }
    get extra_fields() {
        return this._data.extra_fields;
    }
    extra_field(name) {
        console.warn('deprecated call, use extra_fields getter instead');
        return this._data.extra_fields[name] || null;
    }
    extraField(name) {
        console.warn('deprecated call, use extra_fields getter instead');
        return this.extra_field(name);
    }
    async load(travelplan_source_url) {
        // async load of travelplan json
        console.info('Loading', travelplan_source_url);
        const response = await fetch(travelplan_source_url);
        const vtbSrcData = await response.json();
        this.parse_vtb_data(vtbSrcData);
        return this;
    }
    parse_vtb_data(vtbSrcData // eslint-disable-line @typescript-eslint/no-explicit-any
    ) {
        this._data = new VtbDataTransformer().parse_vtb_data(vtbSrcData);
    }
    get element_groups() {
        return this._data.element_groups;
    }
    filter_groups(config) {
        return this._data.filter_element_groups(config);
    }
    filter_elements(config) {
        return this._data.filter_elements(config);
    }
    calculate_price(config, elements) {
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
    map(container_id, filter_config, map_options) {
        const marker_group = this.filter_mapmarkers(filter_config);
        marker_group.connectMarkers = map_options.connect_markers;
        marker_group.connectMode =
            map_options.connect_mode;
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
    filter_mapmarkers(config) {
        const vtb_marker_elements = this.filter_elements(config);
        const group = new VtbMapMarkerGroup();
        for (const element of vtb_marker_elements) {
            if (element.location) {
                group.markers.push(element.location);
            }
        }
        return group;
    }
    flightschedule(container_id, filter_config, flightschedule_options) {
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
        }
        else {
            // TODO:
            console.debug('using filter config on flight element is not implemented yet');
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
    merge_groups_by_day(element_groups) {
        const ret = [];
        let last_group = null;
        for (const group of element_groups) {
            // skip carrental groups ??
            // if (group.is_carrental) {
            //   continue;
            // }
            const current_group = group.clone();
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
                const elements = current_group.elements;
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
            }
            else {
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
//# sourceMappingURL=vtb.js.map
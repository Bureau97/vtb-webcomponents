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
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import duration from 'dayjs/plugin/duration.js';
import murmurhash from 'murmurhash';
dayjs.locale('nl');
dayjs.extend(utc);
dayjs.extend(duration);
export class VtbParticipant {
    constructor() {
        this.id = 0;
        this.prefix = '';
    }
    get age() {
        if (!this.birthdate) {
            return null;
        }
        return dayjs().diff(this.birthdate, 'year');
    }
    get fullname() {
        return `${this.name} ${this.prefix ? this.prefix + ' ' : ''}${this.surname}`;
    }
}
export class VtbParticipantPrice {
    constructor() {
        this.participant_id = 0;
        this.price = 0.0;
        this.price_diff = 0.0;
    }
}
export class VtbParty {
    constructor() {
        this.id = '';
        this.participants = [];
    }
}
export class VtbMedia {
    constructor() {
        this.tags = [];
    }
}
export class VtbExtraField {
    constructor() {
        this.name = '';
    }
    get content() {
        return this.value ?? null;
    }
    toString() {
        return this.value ?? '';
    }
}
export class VtbFlight {
    constructor() {
        this.dateformat = 'DD MMM';
        this.timezone = 'UTC+01:00';
    }
}
export class VtbFlightCarrier {
}
export class VtbFlightData {
    constructor() {
        this.nights = 0;
    }
}
export class VtbElementUnit {
    constructor() {
        // id: string = '';  // produced by murmurhash
        this.title = '';
        this.participant_prices = new Map(null);
        this.quantity = 1;
        this.optional = false;
        // price: number = 0.0;
        // price_diff: number = 0.0;
        this.description = '';
        this.additional_description = '';
        this.media = [];
        this.extra_fields = {};
        this._element_id = 0;
        this._ts_product_id = 0;
        this._hash = 0;
        this._setup_participant_prices();
    }
    _setup_participant_prices() {
        this.participant_prices = new Map(null);
        // add length property for backwards compatibility
        Object.defineProperty(this.participant_prices, 'length', {
            get: () => this.participant_prices.size
        });
    }
    get id() {
        if (!this._hash || this._hash == 0) {
            const to_hash = [
                this.title,
                this.optional.toString(),
                new String(this.participant_prices.size)
            ].join(':');
            this._hash = murmurhash.v3(to_hash, 0x9747b28c);
        }
        return this._hash.toString(16); // cast to string
    }
    get participants() {
        return [...this.participant_prices.keys()];
    }
    get price() {
        let _price = Number(0.0);
        for (const _p of this.participant_prices.values()) {
            _price += _p.price;
        }
        return _price;
    }
    get price_diff() {
        let _price_diff = Number(0.0);
        for (const _p of this.participant_prices.values()) {
            _price_diff += _p.price_diff;
        }
        return _price_diff;
    }
    clone(deep = false) {
        const _clone = Object.assign(new VtbElementUnit(), structuredClone(this));
        _clone.media = [];
        for (const _m of this.media) {
            _clone.media.push(Object.assign(new VtbMedia(), structuredClone(_m)));
        }
        // reset participant_prices
        _clone.participant_prices = new Map(null);
        Object.defineProperty(_clone.participant_prices, 'length', {
            get: () => this.participant_prices.size
        });
        if (deep) {
            for (const [key, value] of this.participant_prices) {
                _clone.participant_prices.set(key, Object.assign(new VtbParticipantPrice(), structuredClone(value)));
            }
        }
        return _clone;
    }
}
export class VtbElement {
    constructor() {
        this.id = '';
        this.ts_product_id = 0;
        this.title = '';
        this.subtitle = '';
        // description: string = '';
        // additional_description: string = '';
        // price = 0.0;
        // price_diff = 0.0;
        // optional = false;
        this.nights = 0;
        this.hidden = false;
        this.day = 0;
        this.startdate = dayjs();
        this.enddate = dayjs();
        this.unit_id = 0;
        this.participant_prices = [];
        // media: Array<VtbMedia> = [];
        // location?: VtbMapMarker;
        this._units = [];
        this._grouped = [];
    }
    // extra_fields: Dictionary<VtbExtraField> = {};
    get optional() {
        return this._units.length > 0 ? this._units[0].optional : false;
    }
    get price() {
        let _price = Number(0.0);
        for (const _u of this._units) {
            if (_u.optional && _u.price_diff != 0) {
                continue;
            }
            _price += _u.price;
        }
        return _price;
        // return this._units.length > 0 ? this._units[0].price : 0.0;
    }
    get price_diff() {
        let _price_diff = Number(0.0);
        for (const _u of this._units) {
            if (!_u.optional) {
                continue;
            }
            _price_diff += _u.price_diff != 0 ? _u.price_diff : _u.price;
        }
        return _price_diff;
        // return this._units.length > 0 ? this._units[0].price_diff : 0.0;
    }
    get units() {
        if (this._grouped.length <= 0 && this._units.length > 1) {
            const grouped = {};
            for (const _u of this._units) {
                const _existing_keys = Object.keys(grouped);
                if (!_existing_keys.includes(_u.id)) {
                    grouped[_u.id] = _u.clone(true);
                    // grouped[_u.id].participant_prices = _u.participant_prices;
                }
                else {
                    // grouped[_u.id].participant_prices.push(..._u.participant_prices);  // TODO: merge participant_prices??
                    grouped[_u.id].quantity++;
                    _u.participant_prices.forEach((value, key) => {
                        grouped[_u.id].participant_prices.set(key, value);
                    });
                }
            }
            this._grouped = Object.values(grouped);
        }
        // console.info('[vtbElement.units] return:');
        // console.log('[vtbElement.units] units: ', this._units);
        // console.log('[vtbElement.units] grouped: ', this._grouped);
        return this._grouped.length ? this._grouped : this._units;
    }
    get participants() {
        const _participants = [];
        for (const _u of this._units) {
            _participants.push(..._u.participants);
        }
        return _participants;
        // return this.participant_prices.map((participant_price) => {
        //   return participant_price.participant_id;
        // });
    }
    get last_day() {
        return this.day + this.nights;
    }
    get days() {
        return this.nights + 1;
    }
    get description() {
        return this._units.length > 0 ? this._units[0].description : '';
    }
    get additional_description() {
        return this._units.length > 0 ? this._units[0].additional_description : '';
    }
    get extra_fields() {
        return this._units.length > 0 ? this._units[0].extra_fields : {};
    }
    get media() {
        // const _media = [];
        // for (const _u of this._units) {
        //   _media.push(..._u.media);
        // }
        // return _media;
        return this._units.length > 0 ? this._units[0].media : [];
    }
    get location() {
        return this._units.length > 0 ? this._units[0].location : undefined;
    }
    get locations() {
        const _locations = [];
        for (const _u of this._units) {
            if (!_u.location)
                continue;
            _locations.push(_u.location);
        }
        return _locations;
    }
    clone() {
        const _clone = Object.assign(new VtbElement(), structuredClone(this));
        _clone.startdate = dayjs(this.startdate.format());
        _clone.enddate = dayjs(this.enddate.format());
        // _clone.media = [];
        // for (const _m of this.media) {
        //   _clone.media.push(Object.assign(new VtbMedia(), structuredClone(_m)));
        // }
        // reset units and grouped
        _clone._units = [];
        _clone._grouped = [];
        // for (const _u of this._units) {
        //   _clone._units.push(
        //     Object.assign(new VtbElementUnit(), structuredClone(_u))
        //   );
        // }
        return _clone;
    }
}
export class VtbElementGroup {
    constructor() {
        this.id = '';
        this.nights = 0;
        this.hidden = false;
        this.day = 0;
        this.startdate = dayjs();
        this.enddate = dayjs();
        this.media = [];
        this.is_flight = false;
        this.is_carrental = false;
        this.mapped_elements_by_id = {};
        this.elements_order = [];
        this.mapped_elements_by_type = {};
        this.mapped_elements_by_day = {};
        this._elements = [];
    }
    get last_day() {
        return this.day + this.nights;
    }
    get days() {
        return this.nights + 1;
    }
    add_element(element) {
        this.mapped_elements_by_id[element.id] = element;
        this.elements_order.push(element.id);
        this._elements.push(element);
        if (element.unit_id) {
            if (!this.mapped_elements_by_type[element.unit_id]) {
                this.mapped_elements_by_type[element.unit_id] = [];
            }
            this.mapped_elements_by_type[element.unit_id].push(element.id);
        }
        if (element.day) {
            if (!this.mapped_elements_by_day[element.day]) {
                this.mapped_elements_by_day[element.day] = [];
            }
            this.mapped_elements_by_day[element.day].push(element.id);
        }
    }
    get elements() {
        // const ret: Array<VtbElement> = [];
        // for (const id of this.elements_order) {
        //   ret.push(this.mapped_elements_by_id[id]);
        // }
        // return ret;
        return this._elements;
    }
    set elements(elements) {
        this._elements = elements;
    }
    filter_elements(config) {
        // const _element_ids = config.element_ids || [];
        // const element_ids = _element_ids.flat(Infinity);
        // console.info('filter_elements: ', config);
        const _element_unit_ids = config.element_unit_ids || [];
        const element_unit_ids = _element_unit_ids.flat(Infinity);
        const _participant_ids = config?.participant_ids || [];
        const participant_ids = _participant_ids.flat(Infinity);
        let check_element_unit_ids = false;
        if (element_unit_ids.length >= 1) {
            // console.info('check_element_unit_ids: ', element_unit_ids);
            check_element_unit_ids = true;
        }
        let check_participant_ids = false;
        if (participant_ids.length >= 1) {
            // console.info('check_participant_ids: ', participant_ids);
            check_participant_ids = true;
        }
        let skip_optional = false;
        if (config?.optional === false) {
            // console.info('skip_optional');
            skip_optional = true;
        }
        let only_optional = false;
        if (config?.optional === true) {
            // console.info('only_optional');
            only_optional = true;
        }
        if (!check_element_unit_ids &&
            !check_participant_ids &&
            !skip_optional &&
            !only_optional) {
            // console.info('no filters, return all elements');
            return this._elements;
        }
        const _elements = [];
        for (const _element of this._elements) {
            if (check_element_unit_ids &&
                !element_unit_ids.includes(Number(_element.unit_id))) {
                continue;
            }
            // console.info('[filter elements] working on element: ', _element.title);
            // if (!_elm_ids.includes(id)) {
            //   continue;
            // }
            // const _element = this.mapped_elements_by_id[id];
            const _element_copy = _element.clone();
            // console.info('[filter elements] element: ', _element.title);
            for (const unit of _element._units) {
                // console.info('[filter elements] unit: ', unit.title, unit.optional);
                if (skip_optional && unit.optional) {
                    // console.info('[filter elements] skip optional');
                    continue;
                }
                if (only_optional && !unit.optional) {
                    // console.info('[filter elements] only optional');
                    continue;
                }
                const unit_copy = unit.clone();
                if (!check_participant_ids) {
                    // console.info(
                    //   '[filter elements] no participant ids requested, add participant prices to clone..'
                    // );
                    unit_copy.participant_prices = unit.participant_prices;
                    // console.info(
                    //   '[filter elements] participant prices: ',
                    //   unit_copy.participant_prices,
                    //   typeof unit_copy.participant_prices
                    // );
                    _element_copy._units.push(unit_copy);
                    continue;
                }
                if (check_participant_ids && _element.participants.length > 0) {
                    // console.info('[filter elements] check participant ids', unit.participant_prices, participant_ids);
                    // let unit_participants_price = 0;
                    participant_ids.forEach((participant_id) => {
                        if (unit.participant_prices.has(Number(participant_id))) {
                            const unit_participant_price = unit.participant_prices.get(Number(participant_id));
                            if (!unit_participant_price) {
                                console.info('[filter elements] no unit_participant_price found for participant_id: ', participant_id);
                                return;
                            }
                            unit_copy.participant_prices.set(Number(participant_id), unit_participant_price);
                        }
                    });
                    // for (const participant_price of unit.participant_prices) {
                    //   // console.info('[filter elements] participant_price: ', participant_price);
                    //   if (
                    //     participant_ids.includes(Number(participant_price.participant_id))
                    //   ) {
                    //     // unit_copy.participant_prices.push(participant_price);
                    //     unit_participants_price += participant_price.price;
                    //   }
                    // }
                    // unit_copy.price = unit_participants_price;
                    if (unit_copy.participant_prices.size === 0) {
                        // if no participant prices left, skip unit because this unit
                        // does not contain the requested participants
                        continue;
                    }
                    // we can now add the unit to the element
                    _element_copy._units.push(unit_copy);
                }
            }
            if (_element_copy._units.length === 0) {
                // console.info('[filter elements] no units left, skip element');
                continue;
            }
            // console.info('[filter elements] add element_copy: ', _element_copy);
            _elements.push(_element_copy);
        }
        return _elements;
    }
    clone() {
        const _clone = Object.assign(new VtbElementGroup(), structuredClone(this));
        _clone.startdate = dayjs(this.startdate.format());
        _clone.enddate = dayjs(this.enddate.format());
        _clone.media = [];
        for (const _m of this.media) {
            _clone.media.push(Object.assign(new VtbMedia(), structuredClone(_m)));
        }
        for (const key of Object.keys(this.mapped_elements_by_id)) {
            _clone.mapped_elements_by_id[key] =
                this.mapped_elements_by_id[key].clone();
        }
        return _clone;
    }
}
export class VtbGeoLocation {
    constructor() {
        this.lat = 0.0;
        this.lng = 0.0;
    }
}
export class VtbMapMarker extends VtbGeoLocation {
}
export class VtbMapMarkerGroup {
    constructor() {
        this.connect_markers = false;
        this.markers = [];
        this.connect_mode = 'flight';
    }
    get connectMode() {
        return this.connect_mode;
    }
    set connectMode(connect_mode) {
        this.connect_mode = connect_mode;
    }
    get connectMarkers() {
        return this.connect_markers;
    }
    set connectMarkers(connect_markers) {
        this.connect_markers = connect_markers;
    }
    get _markers() {
        return this.markers;
    }
}
export class VtbTravelPlanData {
    constructor() {
        this.title = '';
        this.subtitle = '';
        this.covers = [];
        this.extra_fields = {};
        this.duration = 0; // the number of days
        this.parties = {};
        this.mapped_participants = {};
        this.participants_order = [];
        this.sales_price = 0;
        this.flight_elements = [];
        this.car_rental_elements = [];
        // days: Array<VtbElement> = [];
        this.mapped_element_groups = {};
        this.element_groups_order = [];
        this.mapped_element_groups_by_type = {};
        this.mapped_element_groups_by_day = {};
        // private mapped_elements: Dictionary<VtbElement> = {};
        // markergroups: Dictionary<Array<VtbMapMarkerGroup>> = [];
    }
    get extraFields() {
        return this.extra_fields;
    }
    add_participant(participant) {
        this.mapped_participants[participant.id] = participant;
        this.participants_order.push(participant.id);
    }
    get participants() {
        const ret = [];
        for (const id of this.participants_order) {
            ret.push(this.mapped_participants[id]);
        }
        return ret;
    }
    add_flight_element(flight_element) {
        this.flight_elements.push(flight_element);
    }
    add_carrental_element(carrental_element) {
        // console.info('carrental: ', carrental_element);
        this.car_rental_elements.push(carrental_element);
    }
    add_element_group(group) {
        this.mapped_element_groups[group.id] = group;
        this.element_groups_order.push(group.id);
        if (group.type_id) {
            const group_type_id = Number(group.type_id);
            if (!this.mapped_element_groups_by_type[group_type_id]) {
                this.mapped_element_groups_by_type[group_type_id] = [];
            }
            this.mapped_element_groups_by_type[group_type_id].push(group.id);
        }
        if (group.day) {
            if (!this.mapped_element_groups_by_day[group.day]) {
                this.mapped_element_groups_by_day[group.day] = [];
            }
            this.mapped_element_groups_by_day[group.day].push(group.id);
        }
    }
    get element_groups() {
        const ret = [];
        for (const group_id of this.element_groups_order) {
            ret.push(this.mapped_element_groups[group_id]);
        }
        return ret;
    }
    filter_element_groups(config) {
        const ret = [];
        const _group_type_ids = config?.group_type_ids || [];
        // if no group_type_ids are set, then we get and return all groups
        if (_group_type_ids.length == 0) {
            return this.element_groups;
        }
        let _group_ids = [];
        for (const group_type_id of _group_type_ids) {
            _group_ids = _group_ids.concat(this.mapped_element_groups_by_type[Number(group_type_id)]);
        }
        for (const group_id of this.element_groups_order) {
            if (_group_ids.includes(group_id)) {
                ret.push(this.mapped_element_groups[group_id]);
            }
        }
        return ret;
    }
    filter_elements(config) {
        let ret = [];
        const element_groups = this.filter_element_groups(config);
        for (const group of element_groups) {
            // console.info('group: ', group.title);
            ret = ret.concat(group.filter_elements(config));
        }
        return ret;
    }
    get_element_groups_by_day(day) {
        // TODO: refactor
        const _group_ids = this.mapped_element_groups_by_day[day];
        const ret = [];
        for (const group_id of _group_ids) {
            ret.push(this.mapped_element_groups[group_id]);
        }
        return ret;
    }
}
//# sourceMappingURL=models.js.map
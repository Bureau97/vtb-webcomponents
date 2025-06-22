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
        this.id = '';
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
        // subtitle: string = '';
        this.participant_prices = [];
        this.quantity = 1;
        this.optional = false;
        this._price = 0.0;
        this.price_diff = 0.0;
        this.description = '';
        this.additional_description = '';
        this.media = [];
        this.extra_fields = {};
        this._hash = 0;
    }
    get id() {
        if (!this._hash || this._hash == 0) {
            const to_hash = [
                this.title,
                new String(this.participant_prices.length)
            ].join(':');
            this._hash = murmurhash.v3(to_hash, 0x9747b28c);
        }
        return this._hash.toString(16); // cast to string
    }
    get participants() {
        return this.participant_prices.map((participant_price) => {
            return participant_price.participant_id;
        });
    }
    get price() {
        return this.optional && this.price_diff ? this.price_diff : this._price;
    }
    set price(price) {
        this._price = price;
    }
    clone() {
        const _clone = Object.assign(new VtbElementUnit(), structuredClone(this));
        _clone.media = [];
        for (const _m of this.media) {
            _clone.media.push(Object.assign(new VtbMedia(), structuredClone(_m)));
        }
        _clone.extra_fields = {};
        for (const key of Object.keys(this.extra_fields || {})) {
            _clone.extra_fields[key] = Object.assign(new VtbExtraField(), structuredClone(this.extra_fields[key]));
        }
        return _clone;
    }
}
export class VtbElement {
    constructor() {
        this.id = '';
        this.ts_product_id = 0;
        this.title = '';
        // subtitle: string = '';
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
        this.media = [];
        this.locations = [];
        this._units = [];
        this.extra_fields = {};
        this._grouped = [];
    }
    get units() {
        if (this._grouped.length <= 0 && this._units.length > 1) {
            const grouped = {};
            for (const _u of this._units) {
                const _existing_keys = Object.keys(grouped);
                if (!_existing_keys.includes(_u.id)) {
                    grouped[_u.id] = Object.assign(new VtbElementUnit(), structuredClone(_u));
                }
                else {
                    grouped[_u.id].quantity++;
                }
            }
            this._grouped = Object.values(grouped);
        }
        return this._grouped.length ? this._grouped : this._units;
    }
    get location() {
        if (this.locations) {
            return this.locations[0];
        }
        return undefined;
    }
    get participants() {
        let participants = [];
        for (const _u of this._units) {
            participants = participants.concat(_u.participants);
        }
        return participants;
    }
    get last_day() {
        return this.day + this.nights;
    }
    get days() {
        return this.nights + 1;
    }
    get price() {
        if (this.units.length > 1) {
            return this.units.reduce((total, unit) => {
                return total + unit.price;
            }, 0);
        }
        return this.units[0].price;
    }
    get price_diff() {
        if (this.units.length > 1) {
            return this.units.reduce((total, unit) => {
                return total + unit.price_diff;
            }, 0);
        }
        return this.units[0].price_diff;
    }
    get optional() {
        if (this.units.length >= 1) {
            return this.units[0].optional;
        }
        return false;
    }
    // get title(): string {
    //   if (this.units.length >= 1) {
    //     return this.units[0].title;
    //   }
    //   return '';
    // }
    get subtitle() {
        if (this.units.length >= 1) {
            return this.units[0].title;
        }
        return '';
    }
    get description() {
        if (this.units.length >= 1) {
            return this.units[0].description;
        }
        return '';
    }
    set description(text) {
        if (this.units.length >= 1) {
            this.units[0].description = text;
        }
    }
    get additional_description() {
        if (this.units.length >= 1) {
            return this.units[0].additional_description;
        }
        return '';
    }
    reset_units() {
        this._units = [];
        this._grouped = [];
    }
    clone() {
        const _clone = Object.assign(new VtbElement(), structuredClone(this));
        _clone.startdate = dayjs(this.startdate.format());
        _clone.enddate = dayjs(this.enddate.format());
        _clone.media = [];
        for (const _m of this.media) {
            _clone.media.push(Object.assign(new VtbMedia(), structuredClone(_m)));
        }
        _clone.reset_units();
        for (const _u of this._units) {
            _clone._units.push(Object.assign(new VtbElementUnit(), structuredClone(_u)));
        }
        _clone.locations = [];
        for (const _l of this.locations) {
            _clone.locations.push(Object.assign(new VtbMapMarker(), structuredClone(_l)));
        }
        _clone.participant_prices = [];
        for (const _p of this.participant_prices) {
            _clone.participant_prices.push(Object.assign(new VtbParticipantPrice(), structuredClone(_p)));
        }
        _clone.extra_fields = {};
        for (const key of Object.keys(this.extra_fields)) {
            _clone.extra_fields[key] = Object.assign(new VtbExtraField(), structuredClone(this.extra_fields[key]));
        }
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
        this.locations = [];
        this.is_flight = false;
        this.is_carrental = false;
        this.mapped_elements_by_id = {};
        this.elements_order = [];
        this.mapped_elements_by_type = {};
        this.mapped_elements_by_day = {};
    }
    get last_day() {
        return this.day + this.nights;
    }
    get days() {
        return this.nights + 1;
    }
    get location() {
        if (this.locations) {
            return this.locations[0];
        }
        return undefined;
    }
    /**
     * Return an array of elements (VtbElement) sorted by their order
     * @returns {Array<VtbElement>}
     */
    get elements() {
        const ret = [];
        for (const id of this.elements_order) {
            ret.push(this.mapped_elements_by_id[id]);
        }
        return ret;
    }
    /**
     * Adds an element to this element group. The element is added to the mapping
     * by its id. If the element has a unit_id, it is added to the mapping for that
     * unit_id. If the element has a day, it is added to the mapping for that day.
     * @param {VtbElement} element Element to add to the element group.
     */
    add_element(element) {
        this.mapped_elements_by_id[element.id] = element;
        this.elements_order.push(element.id);
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
    /**
     * Filters elements in this element group based on the given configuration.
     *
     * - If `element_unit_ids` is given, only elements with units that have these
     *   ids are returned.
     * - If `participant_ids` is given, only elements with participants that have
     *   these ids are returned.
     * - If `optional` is given, only elements with optional units are returned if
     *   it is set to `true`, or only elements with non-optional units are returned
     *   if it is set to `false`.
     *
     * If participant ids are given, they are checked against the element's participant ids
     * and prices are being filtered as well.
     *
     * @param {VtbFilterConfig} config Configuration for filtering elements.
     * @returns {Array<VtbElement>} Array of filtered elements.
     */
    filter_elements(config) {
        // const _element_ids = config.element_ids || [];
        // const element_ids = _element_ids.flat(Infinity);
        const _element_unit_ids = config.element_unit_ids || [];
        const element_unit_ids = _element_unit_ids.flat(Infinity);
        const _participant_ids = config?.participant_ids || [];
        const participant_ids = _participant_ids.flat(Infinity);
        let check_element_unit_ids = false;
        if (element_unit_ids.length >= 1) {
            check_element_unit_ids = true;
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
        if (!check_element_unit_ids &&
            !check_participant_ids &&
            !skip_optional &&
            !only_optional) {
            // this is eventually the same as the "elements()" getter
            return this.elements;
        }
        let _elm_ids = [];
        if (check_element_unit_ids) {
            for (const unit_id of element_unit_ids) {
                if (!this.mapped_elements_by_type[Number(unit_id)]) {
                    continue;
                }
                _elm_ids = _elm_ids.concat(this.mapped_elements_by_type[Number(unit_id)]);
            }
        }
        else {
            _elm_ids = this.elements_order;
        }
        const _elements = [];
        for (const id of this.elements_order) {
            if (!_elm_ids.includes(id)) {
                continue;
            }
            const _element = this.mapped_elements_by_id[id];
            if (!_element) {
                // element cant be found in this element group
                console.warn('element cant be found in this element group');
                continue;
            }
            // we are checking the units if they are optional or not..
            // instead of the element as we did before
            const _cloned_element = _element.clone(); // clone the element to prevent tampering with the original
            if (only_optional || skip_optional) {
                console.debug('only_optional or skip_optional');
                // if we only want optional elements or if we want to skip optional elements
                _cloned_element.reset_units();
                // loop over the units to check if they are optional or not
                for (const _element_unit of _element.units) {
                    // console.info(
                    //   '  Checking unit',
                    //   _element_unit.title,
                    //   ' is optional?',
                    //   _element_unit.optional
                    // );
                    // only add the unit if it is optional
                    if (only_optional && _element_unit.optional === true) {
                        // console.info(
                        //   '    only_optional, adding unit ',
                        //   _element_unit.title
                        // );
                        _cloned_element._units.push(_element_unit.clone());
                        continue;
                    }
                    // only add the unit if it is not optional
                    if (skip_optional && _element_unit.optional === false) {
                        // console.info(
                        //   '    skip_optional, adding unit ',
                        //   _element_unit.title
                        // );
                        _cloned_element._units.push(_element_unit.clone());
                        continue;
                    }
                    // console.info(
                    //   '    skipping unit',
                    //   _element_unit.title,
                    //   ' is optional?',
                    //   _element_unit.optional
                    // );
                }
            }
            else {
                console.debug('not only_optional or skip_optional, just adding element');
            }
            if (_cloned_element.units.length === 0) {
                console.debug('  not adding element:', _cloned_element.title, ', no units left, going to next element');
                continue;
            }
            if (!check_participant_ids && _cloned_element.units.length >= 0) {
                console.info('  not chekcing participants, adding element', _cloned_element.title, _cloned_element.units.length, 'units');
                _elements.push(_cloned_element);
                continue;
            }
            // if (_cloned_element.units.length === 0) {
            //   console.info(
            //     '  not adding element:',
            //     _cloned_element.title,
            //     'going to next element'
            //   )
            //   continue;
            // }
            if (check_participant_ids && _cloned_element.participants.length >= 1) {
                // console.info('checking participants for element', _element.title);
                for (const _element_unit of _cloned_element.units) {
                    // copy participant prices to local variable
                    const _original_participant_prices = _element_unit.participant_prices;
                    // reset participant prices on element unit
                    _element_unit.participant_prices = [];
                    // loop over all participant prices and add them to element unit
                    // if participant id is in participant ids list
                    for (const _participant_price of _original_participant_prices) {
                        if (participant_ids.includes(_participant_price.participant_id)) {
                            _element_unit.participant_prices.push(_participant_price);
                        }
                    }
                    // if element unit has no participant prices
                    // continue to next element unit
                    if (_element_unit.participant_prices.length === 0) {
                        // console.info('  skipping element unit', _element_unit.title, 'no participant prices');
                        continue;
                    }
                    // calculate element unit price
                    if (_element_unit.price > 0) {
                        _element_unit.price = _element_unit.participant_prices.reduce((total, participant_price) => total + participant_price.price, 0);
                    }
                    // calculate element unit price diff
                    if (_element_unit.price_diff > 0) {
                        _element_unit.price_diff = _element_unit.participant_prices.reduce((total, participant_price) => total + participant_price.price, 0);
                    }
                    // console.info(_element_unit);
                }
                // let participants_unit_price = 0.0;
                // for (const participant_price of _element.participant_prices) {
                //   if (participant_ids.includes(participant_price.participant_id)) {
                //     participants_unit_price += participant_price.price;
                //   }
                // }
                // _cloned_element.price = participants_unit_price;
                _elements.push(_cloned_element);
            }
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
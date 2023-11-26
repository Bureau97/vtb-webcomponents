import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
dayjs.locale('nl');
dayjs.extend(utc);
dayjs.extend(duration);
export class VtbParticipant {
    constructor() {
        this.id = 0;
    }
    get age() {
        if (!this.birthdate) {
            return null;
        }
        return dayjs().diff(this.birthdate, 'year');
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
        var _a;
        return (_a = this.value) !== null && _a !== void 0 ? _a : null;
    }
    toString() {
        var _a;
        return (_a = this.value) !== null && _a !== void 0 ? _a : '';
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
}
export class VtbParticipantPrice {
    constructor() {
        this.participant_id = 0;
        this.price = 0.0;
    }
}
export class VtbElement {
    constructor() {
        this.id = '';
        this.title = '';
        this.price = 0.0;
        this.price_diff = 0.0;
        this.optional = false;
        this.nights = 0;
        this.hidden = false;
        this.day = 0;
        this.startdate = dayjs();
        this.enddate = dayjs();
        this.unit_id = 0;
        this.participant_prices = [];
        this.media = [];
    }
    get participants() {
        return this.participant_prices.map((participant_price) => {
            return participant_price.participant_id;
        });
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
    }
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
    get elements() {
        const ret = [];
        for (const id of this.elements_order) {
            ret.push(this.mapped_elements_by_id[id]);
        }
        return ret;
    }
    filter_elements(config) {
        // const _element_ids = config.element_ids || [];
        // const element_ids = _element_ids.flat(Infinity);
        const _element_unit_ids = config.element_unit_ids || [];
        const element_unit_ids = _element_unit_ids.flat(Infinity);
        const _participant_ids = (config === null || config === void 0 ? void 0 : config.participant_ids) || [];
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
        if ((config === null || config === void 0 ? void 0 : config.optional) === false) {
            skip_optional = true;
        }
        let only_optional = false;
        if ((config === null || config === void 0 ? void 0 : config.optional) === true) {
            only_optional = true;
        }
        if (!check_element_unit_ids &&
            !check_participant_ids &&
            !skip_optional &&
            !only_optional) {
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
            if (skip_optional && _element.optional) {
                continue;
            }
            if (only_optional && !_element.optional) {
                continue;
            }
            if (!check_participant_ids) {
                _elements.push(_element);
                continue;
            }
            if (check_participant_ids && _element.participants) {
                // make a shallow copy so we're not messing with the original price element
                const _element_copy = {
                    ..._element,
                    participants: [],
                };
                let participants_unit_price = 0.0;
                for (const participant_price of _element.participant_prices) {
                    if (participant_ids.includes(participant_price.participant_id)) {
                        participants_unit_price += participant_price.price;
                    }
                }
                _element_copy.price = participants_unit_price;
                _elements.push(_element_copy);
            }
        }
        return _elements;
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
        const _group_type_ids = (config === null || config === void 0 ? void 0 : config.group_type_ids) || [];
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
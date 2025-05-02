import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import duration from 'dayjs/plugin/duration.js';
import 'dayjs/locale/nl.js';
dayjs.extend(utc);
dayjs.extend(duration);
dayjs.locale('nl');
import { VtbTravelPlanData, VtbElement, VtbElementGroup, VtbElementUnit, VtbExtraField, VtbFlight, VtbFlightCarrier, VtbFlightData, VtbGeoLocation, VtbMedia, VtbParticipant, VtbParticipantPrice, VtbParty, VtbMapMarker } from '../models.js';
const re_body = /<body[^>]+>(.*)<\/body>/g;
const re_style = /style="[^"]+"/gi;
/**
 * Parse a participant object from VTB into a VtbParticipant object.
 *
 * @param {Object} participant - participant object from VTB
 * @returns {VtbParticipant} - parsed participant object
 */
export function parse_participant(participant // eslint-disable-line @typescript-eslint/no-explicit-any
) {
    const _participant = new VtbParticipant();
    _participant.id = Number(participant.id);
    _participant.title = participant.title;
    _participant.name = participant.name;
    _participant.prefix = participant.surname_prefix ?? '';
    _participant.surname = participant.surname;
    _participant.calc_type = participant.age_calc_type;
    if (participant.birthdate) {
        _participant.birthdate = dayjs.utc(participant.birthdate);
    }
    return _participant;
}
/**
 * Parse a media object from VTB into a VtbMedia object.
 *
 * @param {Object} media - media object from VTB
 * @returns {VtbMedia} - parsed media object
 *
 * The media object from VTB contains the following properties
 *
 * - url: the URL of the media item
 * - sourceId: the source ID of the media item (unique identifier)
 * - tags: an array of tags for the media item
 *
 * The parsed media object is a VtbMedia object, which contains the same properties as the media object from VTB.
 */
export function parse_media(media // eslint-disable-line @typescript-eslint/no-explicit-any
) {
    const _media = new VtbMedia();
    _media.src = media.url;
    _media.id = media.sourceId;
    for (const tag of media.tags) {
        _media.tags.push(tag.name || tag);
    }
    return _media;
}
/**
 * Parse an extra field object from VTB into a VtbExtraField object.
 *
 * @param {Object} field - extra field object from VTB
 * @returns {VtbExtraField} - parsed extra field object
 */
export function parse_extra_field(field // eslint-disable-line @typescript-eslint/no-explicit-any
) {
    const _field = new VtbExtraField();
    _field.id = field.vtbObjectId;
    _field.name = field.name.toLowerCase().replace(/[\s-]+/g, '_');
    _field.title = field.translated_name || field.translatedName;
    _field.value = field.value;
    _field.type = field.field_type || field.type;
    if (field.options && field.options.length >= 1) {
        _field.options = field.options;
    }
    return _field;
}
/**
 * Parses a VTB element unit from the provided element data and VTB element.
 *
 * @param {Object} element_data - The raw data of the element from VTB.
 * @param {VtbElement} vtb_element - The VTB element containing parsed data.
 * @param {number} vtb_element_price - The price associated with the VTB element.
 * @returns {VtbElementUnit} The parsed VTB element unit with detailed information.
 */
export function parse_element_unit(element_data, // eslint-disable-line @typescript-eslint/no-explicit-any
vtb_element, vtb_element_price) {
    // setup base element
    const vtb_element_unit = new VtbElementUnit();
    // console.debug('element_data: ', element_data);
    vtb_element_unit.title = element_data.subTitle || element_data.title;
    // copy all element data to element unit
    vtb_element_unit.optional = element_data.optional;
    vtb_element_unit.price = vtb_element_price;
    vtb_element_unit.description = vtb_element.description;
    vtb_element_unit.additional_description = vtb_element.additional_description;
    vtb_element_unit.media = vtb_element.media;
    vtb_element_unit.extra_fields = vtb_element.extra_fields;
    vtb_element_unit.day = vtb_element.day;
    for (const participant_id of Object.keys(element_data.olPrices?.participants)) {
        const participant_element_price = new VtbParticipantPrice();
        participant_element_price.participant_id = Number(participant_id);
        participant_element_price.price = parseFloat(element_data.olPrices.participants[participant_id]?.salesPrice || 0);
        // set the prices on the element and element unit
        // vtb_element.participant_prices.push(participant_element_price);
        vtb_element_unit.participant_prices.push(participant_element_price);
    }
    return vtb_element_unit;
}
/**
 * Parses a VTB element from the given element data.
 *
 * @param {Object} element_data - The element data to parse.
 * @param {string} [grouptitle] - The group title of the element.
 * @returns {VtbElement} The parsed VTB element.
 */
export function parse_element(element_data, // eslint-disable-line @typescript-eslint/no-explicit-any
grouptitle) {
    // setup base element
    const vtb_element = new VtbElement();
    // console.debug('element_data: ', element_data);
    // copy data from element_data to vtb_element
    vtb_element.id = element_data.vtbObjectId || element_data.TSOrderline.id;
    vtb_element.object_id = element_data.vtbObjectId || vtb_element.id;
    vtb_element.ts_product_id = element_data.TSProduct.id;
    // set the element title
    // TODO: cleanup "tags" between < and >
    vtb_element.title = element_data.title;
    // console.info('Parse vtb element: ', vtb_element.title);
    // set the element subtitle
    // TODO: cleanup "tags" between < and >
    vtb_element.subtitle = element_data.subTitle;
    // set element description, get all contents from the <body> and remove all style attributes
    vtb_element.description = element_data.additionalText
        ? element_data.additionalText?.replace(re_body, '$1')?.replace(re_style, '')
        : '';
    // set element additional description (get all contents from the <body> and remove all style attributes)
    vtb_element.additional_description = element_data.subAdditionalText
        ? element_data.subAdditionalText
            ?.replace(re_body, '$1')
            ?.replace(re_style, '')
        : '';
    // set element optional
    // vtb_element.optional = element_data.optional;
    // get the element price
    const vtb_element_price = parseFloat(element_data.olPrices?.salesTotal || 0);
    // get the number of nights
    vtb_element.nights = element_data.flexNights || element_data.nights;
    // set the day of the element
    vtb_element.day = element_data.day;
    // set the unit id
    vtb_element.unit_id = element_data.unitId;
    // set the group title
    vtb_element.grouptitle = grouptitle;
    // set and initialize start and end date using dayjs
    if (element_data.date) {
        vtb_element.startdate = dayjs(element_data.date);
    }
    if (element_data.endDate) {
        vtb_element.enddate = dayjs(element_data.endDate);
    }
    // set element media
    if (element_data.media && element_data.media.length >= 1) {
        for (const media_data of element_data.media) {
            const media = parse_media(media_data);
            vtb_element.media.push(media);
        }
    }
    // all elements have at least one unit
    const vtb_element_unit = parse_element_unit(element_data, vtb_element, vtb_element_price);
    // add element unit to element
    vtb_element._units.push(vtb_element_unit);
    // add the element location if it has one and is enabled
    if (element_data.maps &&
        element_data.maps.enabled &&
        element_data.maps.latitude != 0 &&
        element_data.maps.longitude != 0) {
        // console.debug('element_data.maps', element_data);
        const location = parse_marker(element_data.maps, vtb_element.title);
        // add it to the list of locations
        vtb_element.locations?.push(location);
    }
    // search and setup extra fields
    if (element_data.TSOrderline && element_data.TSOrderline.extraFieldValues) {
        for (const extraField of element_data.TSOrderline.extraFieldValues) {
            const vtb_extra_field = parse_extra_field(extraField);
            vtb_element.extra_fields[vtb_extra_field.name] = vtb_extra_field;
        }
    }
    // console.info('parse_vtb_segment::vtb_element result: ', vtb_element);
    return vtb_element;
}
/**
 * Parse a vtb marker data into a VtbMapMarker.
 *
 * This function takes a vtb marker data as input and returns a VtbMapMarker.
 *
 * @param {object} marker_data - The vtb marker data to parse.
 * @returns {VtbMapMarker} - A VtbMapMarker containing the parsed marker data.
 */
export function parse_marker(marker_data, // eslint-disable-line @typescript-eslint/no-explicit-any
title) {
    const marker = new VtbMapMarker();
    marker.lat = marker_data.lat || marker_data.latitude;
    marker.lng = marker_data.lng || marker_data.longitude;
    marker.zoom = marker_data.zoom;
    marker.title = marker_data.title || title || '';
    marker.content = marker_data.content || '';
    return marker;
}
/**
 * Parse a vtb segment data into a VtbElementGroup.
 *
 * This function takes a vtb segment data as input and returns a VtbElementGroup.
 * If the segment data does not have a date, it will use the start date as segment start date.
 * If the segment data does not have an end date, it will calculate the end date from the start date and the number of nights.
 * It will also add all units and prices from the segment data to the VtbElementGroup.
 * If an element is optional and has the same unit id as the previous element, it will add the unit to the previous element.
 * If an element is not optional, it will update the price of the previous element with the unit prices.
 *
 * @param {object} segment_data - The vtb segment data to parse.
 * @param {dayjs.Dayjs} [vtb_start_date] - The start date of the vtb data.
 * @returns {VtbElementGroup} - A VtbElementGroup containing all the elements and units.
 */
export function parse_segment(segment_data, // eslint-disable-line @typescript-eslint/no-explicit-any
vtb_start_date) {
    const element_group = new VtbElementGroup();
    element_group.id = segment_data.vtbObjectId || segment_data.TSBlock.id;
    element_group.title = segment_data.title;
    element_group.subtitle = segment_data.subTitle;
    element_group.description = segment_data.content || '';
    element_group.day = segment_data.day;
    element_group.nights = segment_data.nights;
    element_group.type_id = segment_data.typeId;
    element_group.unit_id = segment_data.unitId;
    if (segment_data.date) {
        element_group.startdate = dayjs(segment_data.date);
    }
    if (segment_data.endDate) {
        element_group.enddate = dayjs(segment_data.endDate);
    }
    if (!segment_data.date && !segment_data.endDate && vtb_start_date) {
        console.debug('no date found for segment, using start date as segment start date');
        element_group.startdate = vtb_start_date
            ?.clone()
            .add(segment_data.day - 1, 'days');
        console.debug(`Date set to ${element_group.startdate.format('dddd D MMM')}`);
    }
    if (segment_data.flightInfo && segment_data.flightInfo.length >= 1) {
        element_group.is_flight = true;
    }
    if (segment_data.carRentalElements &&
        segment_data.carRentalElements.length >= 1) {
        element_group.is_carrental = true;
    }
    for (const media_data of segment_data.media) {
        const media = new VtbMedia();
        media.src = media_data.url;
        media.id = media_data.sourceId;
        media.tags = media_data.tags;
        element_group.media.push(media);
    }
    let last_element = null;
    for (const element_data of segment_data.elements) {
        const vtb_element = parse_element(element_data, segment_data.title);
        if (!vtb_element.day) {
            vtb_element.day = segment_data.day + element_data.offset;
        }
        if (!vtb_element.startdate) {
            vtb_element.startdate = element_group.startdate
                ?.clone()
                .add(vtb_element.day - 1, 'days');
        }
        if (!vtb_element.enddate) {
            vtb_element.enddate = vtb_element.startdate
                .clone()
                .add(vtb_element.nights, 'days');
        }
        if (last_element &&
            vtb_element.units[0].optional &&
            last_element.unit_id == vtb_element.unit_id) {
            // console.debug('Optional element: ', {
            //   title: vtb_element.title,
            //   subtitle: vtb_element.subtitle,
            //   ts_product_id: vtb_element.ts_product_id,
            //   price: vtb_element.price,
            //   last_price: last_element.price,
            //   price_diff: vtb_element.price - last_element.price
            // });
            vtb_element.units[0].price_diff = vtb_element.price - last_element.price; // price difference between non-optional and optional elements
            vtb_element.units[0].price = 0; // reset price, this element is optional
        }
        if (last_element &&
            last_element.ts_product_id == vtb_element.ts_product_id) {
            // console.debug('adding unit to existing element');
            // if (vtb_element.optional && vtb_element._units.length == 1) {
            //   console.debug('adding optional unit to existing element');
            //   vtb_element._units[0].price_diff = vtb_element.price_diff;
            // }
            // copy all units and prices from vtb_element to last_element
            last_element._units = last_element._units.concat(vtb_element._units);
            if (!vtb_element.optional) {
                // if current element is not optional, copy all participant prices
                // last_element.participant_prices =
                //   last_element.participant_prices.concat(
                //     vtb_element.participant_prices
                //   );
                // and update price with the unit prices
                // last_element.price = last_element._units.reduce(
                //   (total, unit) => total + unit.price,
                //   0
                // );
                // and update price_diff
                // last_element.price_diff =
                //   last_element.price_diff * last_element._units.length;
            }
            continue;
        }
        // console.info('adding new element: ', vtb_element);
        element_group.add_element(vtb_element);
        // only reset last elemetn if the current element is not optional
        // and of the same unit type
        // this way, an up- or downgrade doesn't havve to be the same
        // product id! So you can add a different hotel as an up- or downgrade
        // consequence is that an optional up/downgrade must be
        // set in order after the "default" element, there can't be
        // a different unit type or non-optional element between these elements
        if (!vtb_element.optional ||
            (last_element && vtb_element.unit_id != last_element.unit_id)) {
            // console.debug('set last element: ', {
            //   title: vtb_element.title,
            //   subtitle: vtb_element.subtitle,
            //   price: vtb_element.price,
            //   ts_product_id: vtb_element.ts_product_id
            // });
            last_element = vtb_element; // act as default element
        }
    }
    if (segment_data.maps) {
        // console.debug('segment_data.maps', segment_data);
        const location = parse_marker(segment_data.maps, element_group.title);
        element_group.locations.push(location);
    }
    return element_group;
}
export class VtbDataTransformer {
    constructor(vtb_config) {
        this._data = new VtbTravelPlanData();
        if (vtb_config) {
            this._config = vtb_config;
        }
    }
    parse_vtb_data(vtbSrcData // eslint-disable-line @typescript-eslint/no-explicit-any
    ) {
        // search and setup base info
        this._data.title = vtbSrcData.title;
        this._data.subtitle = vtbSrcData.subTitle || '';
        this._data.start_date = dayjs.utc(vtbSrcData.startDate);
        this._data.end_date = dayjs.utc(vtbSrcData.endDate);
        this._data.duration =
            vtbSrcData.totalDays ||
                this._data.end_date.diff(this._data.start_date, 'days');
        this._data.sales_price =
            vtbSrcData.salesPriceAfterRounding ?? vtbSrcData.salesPriceBeforeRounding;
        // search and setup participants and parties
        for (const party_id of Object.keys(vtbSrcData.participants)) {
            const participants = vtbSrcData.participants[party_id];
            const _party = new VtbParty();
            _party.id = party_id;
            for (const pax of participants) {
                const _pax = parse_participant(pax);
                this._data.add_participant(_pax);
                _party.participants?.push(_pax);
            }
            this._data.parties[party_id] = _party;
        }
        // search and setup covers (can be 0 or more!)
        if (vtbSrcData.cover && vtbSrcData.cover.length >= 1) {
            for (const src of vtbSrcData.cover) {
                const _media = parse_media(src);
                this._data.covers.push(_media);
            }
        }
        for (const text_key of Object.keys(vtbSrcData.TSOrder.texts)) {
            const _field = new VtbExtraField();
            _field.name = text_key.toLowerCase().replace(/[\s-]+/g, '_');
            _field.value = vtbSrcData.TSOrder.texts[text_key];
            if (this._data.extra_fields[_field.name]) {
                console.warn('Duplicate text field', _field.name);
            }
            this._data.extra_fields[_field.name] = _field;
        }
        // search and setup extra fields on travelplan
        for (const fieldgroup of vtbSrcData.extraFieldValues) {
            for (const field of fieldgroup.fields) {
                const _field = parse_extra_field(field);
                if (fieldgroup.name) {
                    _field.group_name = fieldgroup.name;
                }
                if (this._data.extra_fields[_field.name]) {
                    console.warn('Duplicate extra field', _field.name, 'overwriting original!');
                }
                this._data.extra_fields[_field.name] = _field;
            }
        }
        for (const segment_data of vtbSrcData.segments) {
            // console.info('Segment', {
            //   typeId: segment_data.typeId,
            //   title: segment_data.title,
            //   day: segment_data.day,
            //   nights: segment_data.nights,
            // });
            // parse flight info elements
            if (segment_data.flightInfo && segment_data.flightInfo.length >= 1) {
                this.parse_flight_info(segment_data);
            }
            // parse car rental info
            if (segment_data.carRentalElements &&
                segment_data.carRentalElements.length >= 1) {
                // console.info('has carRentalElements: ', segment_data.carRentalElements);
                this.parse_carrental_elements(segment_data.carRentalElements, segment_data);
            }
            const vtb_element_group = parse_segment(segment_data, this._data.start_date);
            this._data.add_element_group(vtb_element_group);
        }
        // console.info(this._data);
        return this._data;
    }
    parse_carrental_elements(segment_data, // eslint-disable-line @typescript-eslint/no-explicit-any,
    segment_parent_data // eslint-disable-line @typescript-eslint/no-explicit-any,
    ) {
        // console.info(segment_data, typeof segment_data);
        let last_element = null;
        for (const carElementData of segment_data) {
            const car_element = parse_element(carElementData.element, segment_data.title);
            // todo: check if this is a feature or a bug, or a pebkac?!?
            if (!car_element.description && segment_parent_data.content) {
                console.warn('adding segment content to element description!');
                car_element.description = segment_parent_data.content;
            }
            if (last_element &&
                car_element.optional &&
                last_element.unit_id == car_element.unit_id) {
                // car_element.price_diff = car_element.price - last_element.price; // price difference between non-optional and optional elements
            }
            if (!this._data.car_rental_elements.find((element) => element.object_id == car_element.object_id &&
                element.day == car_element.day)) {
                this._data.car_rental_elements.push(car_element);
                if (!car_element.optional ||
                    (last_element && car_element.unit_id != last_element.unit_id)) {
                    last_element = car_element; // act as default element
                }
            }
        }
        // console.info('carrental: ', this._data.car_rental_elements);
    }
    parse_flight_info(segment_data // eslint-disable-line @typescript-eslint/no-explicit-any
    ) {
        for (const flight of segment_data.flightInfo) {
            const carrier = new VtbFlightCarrier();
            if (flight.airlineObject) {
                carrier.name =
                    flight.airlineObject.name || flight.airlineObject.carrier_name;
                carrier.code =
                    flight.airlineObject.code || flight.airlineObject.carrier_code;
            }
            const departure = new VtbFlight();
            departure.date = dayjs.utc(`${flight.departureDate} ${flight.departureTime}:00`);
            departure.IATA = flight.departureAirport;
            departure.description = flight.departureAirportObject.description;
            departure.country = flight.departureAirportObject.country;
            departure.city = flight.departureAirportObject.city;
            departure.location = new VtbGeoLocation();
            departure.location.lat = flight.departureAirportObject.latitude;
            departure.location.lng = flight.departureAirportObject.longitude;
            const arrival = new VtbFlight();
            arrival.date = dayjs.utc(`${flight.arrivalDate} ${flight.arrivalTime}:00`);
            arrival.IATA = flight.arrivalAirport;
            arrival.description = flight.arrivalAirportObject.description;
            arrival.country = flight.arrivalAirportObject.country;
            arrival.city = flight.arrivalAirportObject.city;
            arrival.location = new VtbGeoLocation();
            arrival.location.lat = flight.arrivalAirportObject.latitude;
            arrival.location.lng = flight.arrivalAirportObject.longitude;
            const flightElement = new VtbFlightData();
            flightElement.carrier = carrier;
            flightElement.departure = departure;
            flightElement.arrival = arrival;
            flightElement.flightnumber = flight.flightNumber;
            flightElement.duration = flight.duration;
            flightElement.day = segment_data.day;
            flightElement.nights = segment_data?.nights || 0;
            if (flight?.operatedBy) {
                flightElement.operated_by = flight.operatedBy;
            }
            if (!flightElement.duration && this._config?.calculate_flight_duration) {
                flightElement.duration = dayjs
                    .duration(arrival.date.diff(departure.date))
                    .format('H:mmu');
            }
            this._data.add_flight_element(flightElement);
        }
    }
}
//# sourceMappingURL=transformer.js.map
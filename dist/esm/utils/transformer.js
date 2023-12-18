import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import duration from 'dayjs/plugin/duration.js'; // import plugin
dayjs.locale('nl');
dayjs.extend(utc);
dayjs.extend(duration);
import { VtbTravelPlanData, VtbElement, VtbElementGroup, VtbExtraField, VtbFlight, VtbFlightCarrier, VtbFlightData, VtbGeoLocation, VtbMedia, VtbParticipant, VtbParticipantPrice, VtbParty, VtbMapMarker, } from '../models.js';
export class VtbDataTransformer {
    constructor() {
        this._data = new VtbTravelPlanData();
        this.re_body = /<body[^>]+>(.*)<\/body>/g;
        this.re_style = /style="[^"]+"/gi;
    }
    parse_vtb_data(vtbSrcData // eslint-disable-line @typescript-eslint/no-explicit-any
    ) {
        // search and setup base info
        this._data.title = vtbSrcData.title;
        this._data.subtitle = vtbSrcData.subTitle || '';
        this._data.start_date = dayjs.utc(vtbSrcData.startDate);
        this._data.end_date = dayjs.utc(vtbSrcData.endDate);
        this._data.duration = vtbSrcData.totalDays;
        this._data.sales_price =
            vtbSrcData.salesPriceAfterRounding ?? vtbSrcData.salesPriceBeforeRounding;
        // search and setup participants and parties
        for (const party_id of Object.keys(vtbSrcData.participants)) {
            const participants = vtbSrcData.participants[party_id];
            const _party = new VtbParty();
            _party.id = party_id;
            for (const pax of participants) {
                const _pax = new VtbParticipant();
                _pax.id = Number(pax.id);
                _pax.title = pax.title;
                _pax.name = pax.name;
                _pax.prefix = pax.surname_prefix;
                _pax.surname = pax.surname;
                _pax.calc_type = pax.age_calc_type;
                if (pax.birthdate) {
                    _pax.birthdate = dayjs.utc(pax.birthdate);
                }
                this._data.add_participant(_pax);
                _party.participants?.push(_pax);
            }
            this._data.parties[party_id] = _party;
        }
        // search and setup covers (can be 0 or more!)
        if (vtbSrcData.cover && vtbSrcData.cover.length >= 1) {
            for (const src of vtbSrcData.cover) {
                const _media = new VtbMedia();
                _media.src = src.url;
                _media.id = src.sourceId;
                _media.tags = src.tags;
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
                const _field = new VtbExtraField();
                _field.name = field.name.toLowerCase().replace(/[\s-]+/g, '_');
                _field.title = field.translated_name;
                _field.value = field.value;
                _field.type = field.field_type;
                if (field.options && field.options.length >= 1) {
                    _field.options = field.options;
                }
                if (fieldgroup.name) {
                    _field.group_name = fieldgroup.name;
                }
                if (this._data.extra_fields[_field.name]) {
                    console.warn('Duplicate extra field', _field.name);
                }
                this._data.extra_fields[_field.name] = _field;
            }
        }
        for (const segment_data of vtbSrcData.segments) {
            console.info('Segment', {
                typeId: segment_data.typeId,
                title: segment_data.title,
                day: segment_data.day,
                nights: segment_data.nights,
            });
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
            this._data.add_element_group(this.parse_vtb_segment(segment_data));
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
            const car_element = this.parse_vtb_element(carElementData.element, segment_data.title);
            // todo: check if this is a feature or a bug, or a pebkac?!?
            if (!car_element.description && segment_parent_data.content) {
                car_element.description = segment_parent_data.content;
            }
            if (last_element &&
                car_element.optional &&
                last_element.unit_id == car_element.unit_id) {
                car_element.price_diff = car_element.price - last_element.price; // price difference between non-optional and optional elements
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
            carrier.name =
                flight.airlineObject.name || flight.airlineObject.carrier_name;
            carrier.code =
                flight.airlineObject.code || flight.airlineObject.carrier_code;
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
            if (!flightElement.duration) {
                flightElement.duration = dayjs
                    .duration(arrival.date.diff(departure.date))
                    .format('H:mmu');
            }
            this._data.add_flight_element(flightElement);
        }
    }
    parse_vtb_segment(segment_data // eslint-disable-line @typescript-eslint/no-explicit-any
    ) {
        const element_group = new VtbElementGroup();
        element_group.id = segment_data.vtbObjectId;
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
            const vtb_element = this.parse_vtb_element(element_data, segment_data.title);
            if (last_element &&
                vtb_element.optional &&
                last_element.unit_id == vtb_element.unit_id) {
                console.debug('Optional element: ', {
                    title: vtb_element.title,
                    subtitle: vtb_element.subtitle,
                    price: vtb_element.price,
                    last_price: last_element.price,
                    price_diff: last_element.price - vtb_element.price,
                });
                vtb_element.price_diff = vtb_element.price - last_element.price; // price difference between non-optional and optional elements
            }
            element_group.add_element(vtb_element);
            if (!vtb_element.optional ||
                (last_element && vtb_element.unit_id != last_element.unit_id)) {
                console.debug('set last element: ', {
                    title: vtb_element.title,
                    subtitle: vtb_element.subtitle,
                    price: vtb_element.price,
                });
                last_element = vtb_element; // act as default element
            }
        }
        if (segment_data.maps) {
            // console.debug('segment_data.maps', segment_data);
            element_group.location = new VtbMapMarker();
            element_group.location.lat = segment_data.maps.latitude;
            element_group.location.lng = segment_data.maps.longitude;
            element_group.location.zoom = segment_data.maps.zoom;
        }
        return element_group;
    }
    parse_vtb_element(element_data, // eslint-disable-line @typescript-eslint/no-explicit-any
    grouptitle) {
        const vtb_element = new VtbElement();
        // console.debug('element_data: ', element_data);
        vtb_element.id = element_data.vtbObjectId;
        vtb_element.title = element_data.title;
        vtb_element.subtitle = element_data.subTitle;
        // set element description, get all contents from the <body> and remove all style attributes
        vtb_element.description = element_data.additionalText
            ?.replace(this.re_body, '$1')
            ?.replace(this.re_style, '');
        vtb_element.additional_description = element_data.subAdditionalText
            ?.replace(this.re_body, '$1')
            ?.replace(this.re_style, '');
        vtb_element.optional = element_data.optional;
        vtb_element.price = parseFloat(element_data.olPrices?.salesTotal || 0);
        vtb_element.nights = element_data.flexNights || element_data.nights;
        vtb_element.day = element_data.day;
        vtb_element.unit_id = element_data.unitId;
        vtb_element.grouptitle = grouptitle;
        vtb_element.object_id = element_data.vtbObjectId;
        if (element_data.date) {
            vtb_element.startdate = dayjs(element_data.date);
        }
        if (element_data.endDate) {
            vtb_element.enddate = dayjs(element_data.endDate);
        }
        if (element_data.media && element_data.media.length >= 1) {
            for (const media_data of element_data.media) {
                const media = new VtbMedia();
                media.src = media_data.url;
                media.id = media_data.sourceId;
                media.tags = media_data.tags;
                vtb_element.media.push(media);
            }
        }
        for (const participant_id of Object.keys(element_data.olPrices?.participants)) {
            const participant_element_price = new VtbParticipantPrice();
            participant_element_price.participant_id = Number(participant_id);
            participant_element_price.price = parseFloat(element_data.olPrices.participants[participant_id]?.salesPrice || 0);
            vtb_element.participant_prices.push(participant_element_price);
        }
        if (element_data.maps &&
            element_data.maps.enabled &&
            element_data.maps.latitude != 0 &&
            element_data.maps.longitude != 0) {
            // console.debug('element_data.maps', element_data);
            vtb_element.location = new VtbMapMarker();
            vtb_element.location.lat = element_data.maps.latitude;
            vtb_element.location.lng = element_data.maps.longitude;
            vtb_element.location.zoom = element_data.maps.zoom || 16;
            vtb_element.location.title = element_data.title;
            vtb_element.location.content = element_data.additionalText;
        }
        return vtb_element;
    }
}
//# sourceMappingURL=transformer.js.map
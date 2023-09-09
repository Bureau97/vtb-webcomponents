import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration'; // import plugin

dayjs.locale('nl');
dayjs.extend(utc);
dayjs.extend(duration);

import {
  VtbData,
  VtbElement,
  VtbElementGroup,
  VtbExtraField,
  VtbFlight,
  VtbFlightCarrier,
  VtbFlightData,
  VtbGeoLocation,
  VtbMedia,
  VtbParticipant,
  VtbParticipantPrice,
  VtbParty,
  VtbMapMarker
} from './data';

export class VtbDataTransformer {
  private _data = new VtbData();

  parse_vtb_data(
    vtbSrcData: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    // search and setup base info
    this._data.title = vtbSrcData.title;
    this._data.subtitle = vtbSrcData.subtitle || '';
    this._data.start_date = dayjs.utc(vtbSrcData.startDate);
    this._data.end_date = dayjs.utc(vtbSrcData.endDate);
    this._data.duration = vtbSrcData.totalDays;
    this._data.sales_price = vtbSrcData.salesPriceAfterRounding;

    // search and setup participants and parties
    for (const party_id of Object.keys(vtbSrcData.participants)) {
      const participants = vtbSrcData.participants[party_id];

      const _party = new VtbParty();
      _party.id = party_id;

      for (const pax of participants) {
        const _pax = new VtbParticipant();
        _pax.id = pax.id;
        _pax.title = pax.title;
        _pax.name = pax.name;
        _pax.prefix = pax.surname_prefix;
        _pax.surname = pax.surname;
        _pax.birthdate = dayjs(pax.birthdate);

        this._data.participants[pax.id] = _pax;
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

    // search and setup extra fields on travelplan
    for (const fieldgroup of vtbSrcData.extraFieldValues) {
      for (const field of fieldgroup.fields) {
        const _field = new VtbExtraField();
        _field.name = field.name.toLowerCase().replace(/\s+/, '_');
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

    for (const segment of vtbSrcData.segments) {
      console.info(
        'Segment',
        segment.vtbObjectId,
        segment.typeId,
        segment.typeName,
        segment
      );

      if (!(segment.typeId in this._data.elements)) {
        this._data.elements[segment.typeId] = new VtbElementGroup();
      } else {
        console.warn('Duplicate segment', segment.typeId);
      }

      // parse flight info elements
      if (segment.flightInfo && segment.flightInfo.length >= 1) {
        for (const flight of segment.flightInfo) {
          const carrier = new VtbFlightCarrier();
          carrier.name = flight.airlineObject.name || flight.airlineObject.carrier_name;
          carrier.code = flight.airlineObject.code || flight.airlineObject.carrier_code;

          const departure = new VtbFlight();
          departure.date = dayjs.utc(
            `${flight.departureDate} ${flight.departureTime}:00`
          );
          departure.IATA = flight.departureAirport;
          departure.description = flight.departureAirportObject.description;
          departure.country = flight.departureAirportObject.country;
          departure.city = flight.departureAirportObject.city;
          departure.location = new VtbGeoLocation();
          departure.location.lat = flight.departureAirportObject.latitude;
          departure.location.lng = flight.departureAirportObject.longitude;

          const arrival = new VtbFlight();
          arrival.date = dayjs.utc(
            `${flight.arrivalDate} ${flight.arrivalTime}:00`
          );
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
          flightElement.day = segment.day;

          this._data.flight_elements.push(flightElement);
        }
      }

      // parse car rental info
      if (
        segment.car_rental_elements &&
        segment.car_rental_elements.length >= 1
      ) {
        console.info('has car_rental_elements');

        let last_element: VtbElement | null = null;
        for (const carElementData of segment.car_rental_elements) {
          const car_element = this.parse_vtb_element(
            carElementData.element,
            segment.title
          );

          if (
            last_element &&
            car_element.optional &&
            last_element.unit_id == car_element.unit_id
          ) {
            car_element.price_diff = car_element.price - last_element.price; // price difference between non-optional and optional elements
          }

          if (
            !this._data.car_rental_elements.find(
              (element) =>
                element.object_id == car_element.object_id &&
                element.day == car_element.day
            )
          ) {
            this._data.car_rental_elements.push(car_element);

            if (
              !car_element.optional ||
              (last_element && car_element.unit_id != last_element.unit_id)
            ) {
              last_element = car_element; // act as default element
            }
          }
        }
      }

      this.parse_vtb_segment(segment);
    }

    return this._data;
  }

  protected parse_vtb_segment(
    segment_data: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    const element_group = new VtbElementGroup();
    element_group.id = segment_data.vtbObjectId;
    element_group.title = segment_data.title;
    element_group.subtitle = segment_data.subTitle;
    element_group.description = segment_data.content;
    element_group.nights = segment_data.nights;
    element_group.day = segment_data.dau;
    element_group.type_id = segment_data.typeId;

    for (const media_data of segment_data.media) {
      const media = new VtbMedia();
      media.src = media_data.url;
      media.id = media_data.sourceId;
      media.tags = media_data.tags;

      element_group.media?.push(media);
    }

    let last_element: VtbElement | null = null;
    for (const element of segment_data.elements) {
      if (
        element_group.elements &&
        !(element.unitId in element_group.elements)
      ) {
        element_group.elements[element.unitId] = [];
      }

      const price_element: VtbElement = this.parse_vtb_element(
        element,
        segment_data.title
      );

      if (
        last_element &&
        price_element.optional &&
        last_element.unit_id == price_element.unit_id
      ) {
        price_element.price_diff = price_element.price - last_element.price; // price difference between non-optional and optional elements
      }

      element_group.elements[element.unitId].push(price_element);

      if (
        !price_element.optional ||
        (last_element && price_element.unit_id != last_element.unit_id)
      ) {
        last_element = price_element; // act as default element
      }
    }

    if (segment_data.map && segment_data.map.enabled >= 1) {
      element_group.location = new VtbMapMarker();
      element_group.location.lat = segment_data.map.latitude;
      element_group.location.lng = segment_data.map.longitude;
      element_group.location.zoom = segment_data.map.zoom;
    }

    this._data.elements[segment_data.typeId] = element_group;
  }

  protected parse_vtb_element(
    element_data: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    grouptitle?: string
  ) {
    const vtb_element = new VtbElement();

    console.info(element_data);

    vtb_element.id = element_data.id;
    vtb_element.title = element_data.title;
    vtb_element.subtitle = element_data.subTitle;
    vtb_element.description = element_data.additionalText?.replace(
      /^.*?<body[^>]+>(.*)<\/body>.*$/g,
      '$1'
    );
    vtb_element.optional = element_data.optional;
    vtb_element.price = parseFloat(element_data.olPrices?.salesTotal || 0);
    vtb_element.nights = element_data.flexNights || element_data.nights;
    vtb_element.day = element_data.day;
    vtb_element.unit_id = element_data.unitId;
    vtb_element.grouptitle = grouptitle;
    vtb_element.object_id = element_data.vtbObjectId;

    if (element_data.media && element_data.media.length >= 1) {
      for (const media_data of element_data.media) {
        const media = new VtbMedia();

        media.src = media_data.url;
        media.id = media_data.sourceId;
        media.tags = media_data.tags;

        vtb_element.media?.push(media);
      }
    }

    vtb_element.participants = [];
    for (const participant_id of Object.keys(
      element_data.olPrices?.participants
    )) {
      const participant_element = new VtbParticipantPrice();

      participant_element.participant_id = participant_id;
      participant_element.price = parseFloat(
        element_data.olPrices.participants[participant_id]?.salesPrice || 0
      );

      vtb_element.participants.push(participant_element);
    }

    if (element_data.map && element_data.map.enabled >= 1) {
      vtb_element.location = new VtbMapMarker();
      vtb_element.location.lat = element_data.map.latitude;
      vtb_element.location.lng = element_data.map.longitude;
      vtb_element.location.zoom = element_data.map.zoom;
    }

    return vtb_element;
  }
}

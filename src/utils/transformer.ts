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
import duration from 'dayjs/plugin/duration.js'; // import plugin

dayjs.locale('nl');
dayjs.extend(utc);
dayjs.extend(duration);

import sortBy from 'lodash/sortBy.js';
import isEqual from 'lodash/isEqual.js';

import {
  VtbTravelPlanData,
  VtbElement,
  VtbElementGroup,
  VtbElementUnit,
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
} from '../models.js';

import {VtbConfig} from './interfaces.js';

export class VtbDataTransformer {
  private _data = new VtbTravelPlanData();
  private _config?: VtbConfig;

  constructor(vtb_config?: VtbConfig) {
    if (vtb_config) {
      this._config = vtb_config;
    }
  }

  parse_vtb_data(
    vtbSrcData: any // eslint-disable-line @typescript-eslint/no-explicit-any
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
        const _pax = new VtbParticipant();
        _pax.id = Number(pax.id);
        _pax.title = pax.title;
        _pax.name = pax.name;
        _pax.prefix = pax.surname_prefix ?? '';
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
        const _field = this.parse_extra_field(field);

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
      if (
        segment_data.carRentalElements &&
        segment_data.carRentalElements.length >= 1
      ) {
        // console.info('has carRentalElements: ', segment_data.carRentalElements);

        this.parse_carrental_elements(
          segment_data.carRentalElements,
          segment_data
        );
      }

      this._data.add_element_group(this.parse_vtb_segment(segment_data));
    }

    // console.info(this._data);

    return this._data;
  }

  protected parse_extra_field(
    field: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ): VtbExtraField {
    const _field = new VtbExtraField();
    _field.name = field.name.toLowerCase().replace(/[\s-]+/g, '_');
    _field.title = field.translated_name;
    _field.value = field.value;
    _field.type = field.field_type;

    if (field.options && field.options.length >= 1) {
      _field.options = field.options;
    }

    return _field;
  }

  protected parse_carrental_elements(
    segment_data: any, // eslint-disable-line @typescript-eslint/no-explicit-any,
    segment_parent_data: any // eslint-disable-line @typescript-eslint/no-explicit-any,
  ): void {
    // console.info(segment_data, typeof segment_data);

    let last_element: VtbElement | null = null;
    for (const carElementData of segment_data) {
      const car_element = this.parse_vtb_element(
        carElementData.element,
        segment_data.title
      );

      // todo: check if this is a feature or a bug, or a pebkac?!?
      if (!car_element.description && segment_parent_data.content) {
        console.warn('adding segment content to element description!');
        // car_element.description = segment_parent_data.content;
      }

      if (
        last_element &&
        car_element.optional &&
        last_element.unit_id == car_element.unit_id
      ) {
        // car_element.price_diff = car_element.price - last_element.price; // price difference between non-optional and optional elements
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

    // console.info('carrental: ', this._data.car_rental_elements);
  }

  protected parse_flight_info(
    segment_data: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ): void {
    for (const flight of segment_data.flightInfo) {
      const carrier = new VtbFlightCarrier();

      if (flight.airlineObject) {
        carrier.name =
          flight.airlineObject.name || flight.airlineObject.carrier_name;
        carrier.code =
          flight.airlineObject.code || flight.airlineObject.carrier_code;
      }

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

  protected parse_vtb_segment(
    segment_data: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ): VtbElementGroup {
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

    if (!segment_data.date && !segment_data.endDate && this._data.start_date) {
      console.debug(
        'no date found for segment, using start date as segment start date'
      );
      element_group.startdate = this._data.start_date
        ?.clone()
        .add(segment_data.day - 1, 'days');

      console.debug(
        `Date set to ${element_group.startdate.format('dddd D MMM')}`
      );
    }

    if (segment_data.flightInfo && segment_data.flightInfo.length >= 1) {
      element_group.is_flight = true;
    }

    if (
      segment_data.carRentalElements &&
      segment_data.carRentalElements.length >= 1
    ) {
      element_group.is_carrental = true;
    }

    for (const media_data of segment_data.media) {
      const media = new VtbMedia();
      media.src = media_data.url;
      media.id = media_data.sourceId;
      media.tags = media_data.tags;

      element_group.media.push(media);
    }

    let last_element: VtbElement | null = null;

    for (const element_data of segment_data.elements) {
      const vtb_element: VtbElement = this.parse_vtb_element(
        element_data,
        segment_data.title
      );

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

      // console.info(
      //   '[parse_vtb_segment] current element: ', [vtb_element.title, vtb_element.ts_product_id, vtb_element.startdate.toString(), vtb_element.unit_id])

      if (!last_element) {
        // console.info('[parse_vtb_segment] last element not set, adding element to group and set element as last element');
        element_group.add_element(vtb_element);
        last_element = vtb_element;
        continue;
      }

      // console.info(
      //   '[parse_vtb_segment] last element: ', [last_element.title, last_element.ts_product_id, last_element.startdate.toString(), last_element.unit_id]);

      if (
        last_element.ts_product_id == vtb_element.ts_product_id &&
        last_element.startdate.toString() == vtb_element.startdate.toString() &&
        last_element.enddate.toString() == vtb_element.enddate.toString() &&
        last_element.unit_id == vtb_element.unit_id
      ) {
        // add units to last element
        // console.info('[parse_vtb_segment] current product id matches last element id, adding units to last element', vtb_element.ts_product_id);
        // console.info('[parse_vtb_segment]  -> last element: ', last_element.title, last_element.subtitle);
        // console.info('[parse_vtb_segment]  -> current element: ', vtb_element.title, vtb_element.subtitle);

        // walk through the current units
        for (const unit of vtb_element._units) {
          // console.info('[parse_vtb_segment] current unit: ', unit);

          // if the unit is not optional, add it to the last element
          if (!unit.optional) {
            // console.info('[parse_vtb_segment] unit is not optional, adding unit to last element');
            last_element._units.push(unit);
            continue;
          }

          // walk through the units of the last element
          // to see if the unit participants match
          for (const last_unit of last_element._units) {
            // console.info('[parse_vtb_segment] last unit: ', unit);

            // if the last unit is optional, skip it
            // we need to match against a non-optional unit
            if (last_unit.optional) {
              // console.info('[parse_vtb_segment] last unit is optional, skipping');
              continue;
            }

            // if the unit participants match, set the price difference
            // betweem the current unit and the last unit
            if (
              isEqual(sortBy(unit.participants), sortBy(last_unit.participants))
            ) {
              // console.info('[parse_vtb_segment]   unit participants match, setting price difference');
              unit.price_diff = unit.price - last_unit.price;
              // unit.price = 0;

              last_element._units.push(unit);

              break;
            }
            // if the unit participants do not match, add the unit to the last element
            // it could be a completely different alternative to the (multiple) units of the last element
            else {
              // console.debug(
              //   '[parse_vtb_segment]   unit participants do not match, adding unit to last element', unit
              // );

              // set unit price difference by substracting the total element price from the last element from
              // the unit price
              unit.price_diff = unit.price - last_element.price; // TODO: check if this is correct

              last_element._units.push(unit);

              break;
            }
          }
        }
      } else {
        if (
          last_element.unit_id == vtb_element.unit_id &&
          last_element.startdate.toString() ==
            vtb_element.startdate.toString() &&
          last_element.enddate.toString() == vtb_element.enddate.toString()
        ) {
          // we need to calculate the price difference between the last element and the current element
          // console.info('price difference between elements: ', vtb_element.price, last_element.price, vtb_element.price - last_element.price);

          // we have to find the unit that matches the participants from the last element

          // console.info('[parse_vtb_segment] current unit id matches last element id, adding units to last element', vtb_element.unit_id);
          // console.info('[parse_vtb_segment]  -> last element: ', last_element.title, last_element.subtitle);
          // console.info('[parse_vtb_segment]  -> current element: ', vtb_element.title, vtb_element.subtitle);

          for (const unit of vtb_element._units) {
            // console.info('current unit participants: ', unit.title, unit.participants);

            if (!unit.optional) {
              // console.info('unit is not optional, skipping');
              continue;
            }
            // console.info('unit is optional, looking for matching unit in last element');

            for (const last_unit of last_element._units) {
              // console.info('last unit participants: ', last_unit.title, last_unit.participants);

              if (last_unit.optional) {
                // console.info('unit is optionsal, skipping');
                continue;
              }

              if (
                isEqual(
                  sortBy(unit.participants),
                  sortBy(last_unit.participants)
                )
              ) {
                // console.info('[parse_vtb_segment]   unit participants match, setting price difference');
                unit.price_diff = vtb_element.price - last_unit.price;
                // unit.price = 0;

                break;
              } else {
                console.debug(
                  '[parse_vtb_segment]   unit participants do not match, adding unit to last element',
                  unit
                );

                last_element._units.push(unit);

                break;
              }
            }
          }
        }
        // else {
        //   console.debug('[parse_vtb_segment] current element does not match last element');
        // }

        // console.info('[parse_vtb_segment]     adding element to group and set current element as last element');
        element_group.add_element(vtb_element);
        last_element = vtb_element;
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

  private re_body = /<body[^>]+>(.*)<\/body>/g;
  private re_style = /style="[^"]+"/gi;

  protected parse_vtb_element_unit(
    element_data: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ): VtbElementUnit {
    const vtb_element_unit = new VtbElementUnit();
    vtb_element_unit.title = element_data.subTitle || element_data.title;
    vtb_element_unit.optional = element_data.optional;
    vtb_element_unit._element_id = element_data.id;
    vtb_element_unit._ts_product_id = element_data.ts_product_id;

    vtb_element_unit.price = parseFloat(element_data.olPrices?.salesTotal || 0);

    vtb_element_unit.description = element_data.additionalText
      ? element_data.additionalText
          ?.replace(this.re_body, '$1')
          ?.replace(this.re_style, '')
      : '';

    vtb_element_unit.additional_description = element_data.subAdditionalText
      ? element_data.subAdditionalText
          ?.replace(this.re_body, '$1')
          ?.replace(this.re_style, '')
      : '';

    if (element_data.media && element_data.media.length >= 1) {
      for (const media_data of element_data.media) {
        const media = new VtbMedia();

        media.src = media_data.url;
        media.id = media_data.sourceId;
        media.tags = media_data.tags;

        vtb_element_unit.media.push(media);
      }
    }

    for (const participant_id of Object.keys(
      element_data.olPrices?.participants
    )) {
      const participant_element_price = new VtbParticipantPrice();

      participant_element_price.participant_id = Number(participant_id);
      participant_element_price.price = parseFloat(
        element_data.olPrices.participants[participant_id]?.salesPrice || 0
      );

      // vtb_element.participant_prices.push(participant_element_price);
      vtb_element_unit.participant_prices.push(participant_element_price);
    }

    if (element_data.TSOrderline && element_data.TSOrderline.extraFieldValues) {
      for (const extraField of element_data.TSOrderline.extraFieldValues) {
        const vtb_extra_field = this.parse_extra_field(extraField);
        vtb_element_unit.extra_fields[vtb_extra_field.name] = vtb_extra_field;
      }
    }

    if (
      element_data.maps &&
      element_data.maps.enabled &&
      element_data.maps.latitude != 0 &&
      element_data.maps.longitude != 0
    ) {
      // console.debug('element_data.maps', element_data);

      vtb_element_unit.location = new VtbMapMarker();
      vtb_element_unit.location.lat = element_data.maps.latitude;
      vtb_element_unit.location.lng = element_data.maps.longitude;
      vtb_element_unit.location.zoom = element_data.maps.zoom || 16;
      vtb_element_unit.location.title = element_data.title;
      vtb_element_unit.location.content = element_data.additionalText;
    }

    return vtb_element_unit;
  }

  protected parse_vtb_element(
    element_data: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    grouptitle?: string
  ): VtbElement {
    const vtb_element = new VtbElement();
    // console.debug('element_data: ', element_data);
    vtb_element.id = element_data.vtbObjectId || element_data.TSOrderline.id;
    vtb_element.object_id = element_data.vtbObjectId || vtb_element.id;
    vtb_element.ts_product_id = element_data.TSProduct.id;

    vtb_element.title = element_data.title;

    // console.info('Parse vtb element: ', vtb_element.title);

    vtb_element.subtitle = element_data.subTitle;
    // set element description, get all contents from the <body> and remove all style attributes
    // vtb_element.description = element_data.additionalText
    //   ? element_data.additionalText
    //       ?.replace(this.re_body, '$1')
    //       ?.replace(this.re_style, '')
    //   : '';

    // vtb_element.additional_description = element_data.subAdditionalText
    //   ? element_data.subAdditionalText
    //       ?.replace(this.re_body, '$1')
    //       ?.replace(this.re_style, '')
    //   : '';

    // vtb_element.optional = element_data.optional;
    // vtb_element.price = parseFloat(element_data.olPrices?.salesTotal || 0);
    vtb_element.nights = element_data.flexNights || element_data.nights;
    vtb_element.day = element_data.day;
    vtb_element.unit_id = element_data.unitId;
    vtb_element.grouptitle = grouptitle;

    if (element_data.date) {
      vtb_element.startdate = dayjs(element_data.date);
    }
    if (element_data.endDate) {
      vtb_element.enddate = dayjs(element_data.endDate);
    }

    // if (element_data.media && element_data.media.length >= 1) {
    //   for (const media_data of element_data.media) {
    //     const media = new VtbMedia();

    //     media.src = media_data.url;
    //     media.id = media_data.sourceId;
    //     media.tags = media_data.tags;

    //     vtb_element.media.push(media);
    //   }
    // }

    // copy all element data to element unit
    const vtb_element_unit = this.parse_vtb_element_unit(element_data);

    // for (const participant_id of Object.keys(
    //   element_data.olPrices?.participants
    // )) {
    //   const participant_element_price = new VtbParticipantPrice();

    //   participant_element_price.participant_id = Number(participant_id);
    //   participant_element_price.price = parseFloat(
    //     element_data.olPrices.participants[participant_id]?.salesPrice || 0
    //   );

    //   vtb_element.participant_prices.push(participant_element_price);
    //   vtb_element_unit.participant_prices.push(participant_element_price);
    // }

    vtb_element._units.push(vtb_element_unit);

    // if (
    //   element_data.maps &&
    //   element_data.maps.enabled &&
    //   element_data.maps.latitude != 0 &&
    //   element_data.maps.longitude != 0
    // ) {
    //   // console.debug('element_data.maps', element_data);

    //   vtb_element.location = new VtbMapMarker();
    //   vtb_element.location.lat = element_data.maps.latitude;
    //   vtb_element.location.lng = element_data.maps.longitude;
    //   vtb_element.location.zoom = element_data.maps.zoom || 16;
    //   vtb_element.location.title = element_data.title;
    //   vtb_element.location.content = element_data.additionalText;
    // }

    // console.info('parse_vtb_segment::vtb_element: ', vtb_element);

    // if (element_data.TSOrderline && element_data.TSOrderline.extraFieldValues) {
    //   for (const extraField of element_data.TSOrderline.extraFieldValues) {
    //     const vtb_extra_field = this.parse_extra_field(extraField);
    //     vtb_element.extra_fields[vtb_extra_field.name] = vtb_extra_field;
    //   }
    // }

    return vtb_element;
  }
}

import dayjs from 'dayjs';
import 'dayjs/locale/nl';
import { VtbTravelPlanData, VtbElement, VtbElementGroup, VtbElementUnit, VtbExtraField, VtbMedia, VtbParticipant, VtbMapMarker } from '../models.js';
import { VtbConfig } from './interfaces.js';
/**
 * Parse a participant object from VTB into a VtbParticipant object.
 *
 * @param {Object} participant - participant object from VTB
 * @returns {VtbParticipant} - parsed participant object
 */
export declare function parse_participant(participant: any): VtbParticipant;
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
export declare function parse_media(media: any): VtbMedia;
/**
 * Parse an extra field object from VTB into a VtbExtraField object.
 *
 * @param {Object} field - extra field object from VTB
 * @returns {VtbExtraField} - parsed extra field object
 */
export declare function parse_extra_field(field: any): VtbExtraField;
/**
 * Parses a VTB element unit from the provided element data and VTB element.
 *
 * @param {Object} element_data - The raw data of the element from VTB.
 * @param {VtbElement} vtb_element - The VTB element containing parsed data.
 * @param {number} vtb_element_price - The price associated with the VTB element.
 * @returns {VtbElementUnit} The parsed VTB element unit with detailed information.
 */
export declare function parse_element_unit(element_data: any, // eslint-disable-line @typescript-eslint/no-explicit-any
vtb_element: VtbElement, vtb_element_price: number): VtbElementUnit;
/**
 * Parses a VTB element from the given element data.
 *
 * @param {Object} element_data - The element data to parse.
 * @param {string} [grouptitle] - The group title of the element.
 * @returns {VtbElement} The parsed VTB element.
 */
export declare function parse_element(element_data: any, // eslint-disable-line @typescript-eslint/no-explicit-any
grouptitle?: string): VtbElement;
/**
 * Parse a vtb marker data into a VtbMapMarker.
 *
 * This function takes a vtb marker data as input and returns a VtbMapMarker.
 *
 * @param {object} marker_data - The vtb marker data to parse.
 * @returns {VtbMapMarker} - A VtbMapMarker containing the parsed marker data.
 */
export declare function parse_marker(marker_data: any, // eslint-disable-line @typescript-eslint/no-explicit-any
title?: string): VtbMapMarker;
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
export declare function parse_segment(segment_data: any, // eslint-disable-line @typescript-eslint/no-explicit-any
vtb_start_date?: dayjs.Dayjs): VtbElementGroup;
export declare class VtbDataTransformer {
    private _data;
    private _config?;
    constructor(vtb_config?: VtbConfig);
    parse_vtb_data(vtbSrcData: any): VtbTravelPlanData;
    protected parse_carrental_elements(segment_data: any, // eslint-disable-line @typescript-eslint/no-explicit-any,
    segment_parent_data: any): void;
    protected parse_flight_info(segment_data: any): void;
}
//# sourceMappingURL=transformer.d.ts.map
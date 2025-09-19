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
import { LitElement } from 'lit';
import { VtbMapMarkerGroup, VtbMapMarker } from '../models.js';
export interface VtbMapOptions {
    connect_mode?: string;
    connect_markers: boolean;
    api_key: string;
    height?: number;
    width?: number;
    zoom?: number;
    default_labels: boolean;
}
export declare class VtbMapMarkerElement extends LitElement {
    lat: number;
    lng: number;
    icon?: string;
    label?: string;
    default_label: boolean;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
}
export declare class VtbMapMarkerGroupElement extends LitElement {
    connect_markers: boolean;
    get connectMarkers(): boolean;
    set connectMarkers(value: boolean);
    connect_mode?: string;
    get connectMode(): string | undefined;
    set connectMode(value: string);
    markers: Array<VtbMapMarker>;
    static styles: import("lit").CSSResult;
    constructor();
    connectedCallback(): void;
    parseMarkerElement(element: HTMLElement): VtbMapMarker | null;
}
export declare class VtbMapElement extends LitElement {
    api_key: string;
    set apiKey(value: string);
    get apiKey(): string;
    markergroups: Array<VtbMapMarkerGroup>;
    height?: number;
    width?: number;
    zoom?: number;
    connect_markers: boolean;
    default_labels: boolean;
    get connectMarkers(): boolean;
    set connectMarkers(value: boolean);
    connect_mode?: string;
    get connectMode(): string | undefined;
    set connectMode(value: string);
    use_info_window: boolean;
    get useInfoWindow(): boolean;
    set useInfoWindow(value: boolean);
    mapstyles?: Array<google.maps.MapTypeStyle>;
    _container?: HTMLElement;
    private _loader?;
    private _google?;
    private _directions_service?;
    private _directions_renderer?;
    private marker_counter;
    private _map?;
    set map(value: google.maps.Map | null | undefined);
    get map(): google.maps.Map | null | undefined;
    private _bounds?;
    set bounds(value: google.maps.LatLngBounds | undefined);
    get bounds(): google.maps.LatLngBounds | undefined;
    static styles: import("lit").CSSResult;
    constructor();
    connectedCallback(): void;
    private parseChildNode;
    render(): import("lit-html").TemplateResult<1>;
    firstUpdated(): void;
    protected initializeMap(): void;
    protected setMapStyle(): void;
    protected addMarkers(): void;
    protected addMarker(marker: VtbMapMarker): void;
    protected renderDirections(tripCoordinates: Array<google.maps.LatLng>, travel_mode?: google.maps.TravelMode): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'vtb-map-marker-group': VtbMapMarkerGroupElement;
        'vtb-map-marker': VtbMapMarkerElement;
        'vtb-map': VtbMapElement;
    }
}
//# sourceMappingURL=map.d.ts.map
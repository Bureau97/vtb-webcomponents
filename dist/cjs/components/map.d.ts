/// <reference types="google.maps" />
import { LitElement } from 'lit';
import { VtbMapMarkerGroup, VtbMapMarker } from '../models.js';
export interface VtbMapOptions {
    connect_mode?: string;
    connect_markers: boolean;
    api_key: string;
    height?: number;
    width?: number;
    zoom?: number;
}
export declare class VtbMapMarkerElement extends LitElement {
    lat: number;
    lng: number;
    icon?: string;
    label?: string;
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
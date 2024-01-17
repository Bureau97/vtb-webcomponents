import { __decorate } from "tslib";
import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import * as _ from 'lodash';
const { isEqual } = _;
import * as GMaps from '@googlemaps/js-api-loader';
const { Loader } = GMaps;
import { VtbMapMarkerGroup, VtbMapMarker } from '../models.js';
let VtbMapMarkerElement = class VtbMapMarkerElement extends LitElement {
    constructor() {
        super(...arguments);
        this.lat = 0.0;
        this.lng = 0.0;
    }
    connectedCallback() {
        // console.debug('VTB-MAP-MARKER::connectedCallback');
        super.connectedCallback();
    }
};
VtbMapMarkerElement.styles = css `
    :host {
      display: none;
    }
  `;
__decorate([
    property({ type: Number, reflect: true })
], VtbMapMarkerElement.prototype, "lat", void 0);
__decorate([
    property({ type: Number, reflect: true })
], VtbMapMarkerElement.prototype, "lng", void 0);
__decorate([
    property({ type: String })
], VtbMapMarkerElement.prototype, "icon", void 0);
__decorate([
    property({ type: String })
], VtbMapMarkerElement.prototype, "label", void 0);
VtbMapMarkerElement = __decorate([
    customElement('vtb-map-marker')
], VtbMapMarkerElement);
export { VtbMapMarkerElement };
let VtbMapMarkerGroupElement = class VtbMapMarkerGroupElement extends LitElement {
    get connectMarkers() {
        return this.connect_markers;
    }
    set connectMarkers(value) {
        this.connect_markers = value;
    }
    get connectMode() {
        return this.connect_mode;
    }
    set connectMode(value) {
        this.connect_mode = value;
    }
    constructor() {
        super();
        this.connect_markers = false;
        this.connect_mode = 'flight';
        this.markers = [];
    }
    connectedCallback() {
        // console.debug('VTB-MAP-MARKER-GROUP::connectedCallback');
        super.connectedCallback();
        if (this.children.length >= 1) {
            for (const child of this.children) {
                const marker = this.parseMarkerElement(child);
                if (marker) {
                    this.markers.push(marker);
                }
            }
        }
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    // push all nodes to the childElements
                    let _changed = false;
                    for (const node of mutation.addedNodes) {
                        const marker = this.parseMarkerElement(node);
                        if (marker) {
                            this.markers.push(marker);
                            _changed = true;
                        }
                    }
                    // call requestUpdate to re-render the element
                    if (_changed) {
                        this.requestUpdate();
                    }
                }
            });
        });
        observer.observe(this, {
            childList: true
        });
    }
    parseMarkerElement(element) {
        const re_marker = /^vtb-map-marker$/i;
        if (re_marker.test(element.tagName)) {
            const _marker_element = element;
            const marker = new VtbMapMarker();
            marker.title = element.title || element.innerHTML;
            marker.lat =
                parseFloat(_marker_element.getAttribute('lat')) || 0.0;
            marker.lng =
                parseFloat(_marker_element.getAttribute('lng')) || 0.0;
            return marker;
        }
        return null;
    }
};
VtbMapMarkerGroupElement.styles = css `
    :host {
      display: none;
    }
  `;
__decorate([
    property({ type: Boolean, attribute: 'connect-markers' })
], VtbMapMarkerGroupElement.prototype, "connect_markers", void 0);
__decorate([
    property({ type: String, attribute: 'connect-mode' })
], VtbMapMarkerGroupElement.prototype, "connect_mode", void 0);
__decorate([
    property({
        type: Array,
        hasChanged(newVal, oldVal) {
            // console.debug('VtbMapElement::markers::hasChanged');
            return !isEqual(newVal, oldVal);
        }
    })
], VtbMapMarkerGroupElement.prototype, "markers", void 0);
VtbMapMarkerGroupElement = __decorate([
    customElement('vtb-map-marker-group')
], VtbMapMarkerGroupElement);
export { VtbMapMarkerGroupElement };
let VtbMapElement = class VtbMapElement extends LitElement {
    set apiKey(value) {
        this.api_key = value;
    }
    get apiKey() {
        return this.api_key;
    }
    get connectMarkers() {
        return this.connect_markers;
    }
    set connectMarkers(value) {
        this.connect_markers = value;
    }
    get connectMode() {
        return this.connect_mode;
    }
    set connectMode(value) {
        this.connect_mode = value;
    }
    get useInfoWindow() {
        return this.use_info_window;
    }
    set useInfoWindow(value) {
        this.use_info_window = value;
    }
    set map(value) {
        this._map = value;
    }
    get map() {
        return this._map;
    }
    set bounds(value) {
        this._bounds = value;
    }
    get bounds() {
        return this._bounds;
    }
    constructor() {
        // console.debug('VtbMapElement::constructor');
        super();
        this.api_key = '';
        this.height = 400;
        this.width = Number.NaN;
        this.zoom = Number.NaN;
        this.connect_markers = false;
        this.connect_mode = 'flight';
        this.use_info_window = false;
        this.mapstyles = [];
        this._google = undefined;
        this._directions_service = undefined;
        this._directions_renderer = undefined;
        this.marker_counter = 0;
        this._map = null;
        this._bounds = undefined;
        this.markergroups = [];
        this.marker_counter = 0; // make sure to reset the counter on each initialization
    }
    connectedCallback() {
        // console.debug('VtbMapElement::connectedCallback');
        super.connectedCallback();
        if (this.children.length >= 1) {
            for (const child of this.children) {
                this.parseChildNode(child);
            }
        }
        // setup google maps loader
        this._loader = new Loader({
            apiKey: this.apiKey,
            version: 'weekly'
        });
        // setup mutation observer for changes to dom
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    // push all nodes to the childElements
                    let _changed = false;
                    for (const node of mutation.addedNodes) {
                        const rs = this.parseChildNode(node);
                        if (rs && !_changed) {
                            _changed = true;
                        }
                    }
                    // call requestUpdate to re-render the element
                    if (_changed) {
                        // console.debug('requesting an update');
                        this.requestUpdate();
                    }
                }
            });
        });
        observer.observe(this, {
            childList: true
        });
    }
    parseChildNode(childNode) {
        // console.debug('VTB-MAP::parseChildNode', childNode);
        const re_group = /^vtb-map-marker-group$/i, re_marker = /^vtb-map-marker$/i;
        if (re_group.test(childNode.tagName)) {
            const group = new VtbMapMarkerGroup();
            const groupElement = childNode;
            group.connectMode = childNode.getAttribute('connect-mode');
            group.connectMarkers = childNode.hasAttribute('connect-markers') || false;
            group.markers = groupElement.markers;
            this.markergroups.push(group);
            return true;
        }
        else if (re_marker.test(childNode.tagName)) {
            // we got a marker without a group
            const _marker_element = childNode;
            const marker = new VtbMapMarkerGroupElement().parseMarkerElement(_marker_element);
            if (this.markergroups.length <= 0) {
                this.markergroups.push(new VtbMapMarkerGroup());
                this.markergroups[0].connectMarkers = this.connect_markers;
                this.markergroups[0].connectMode = this
                    .connect_mode;
            }
            if (marker) {
                this.markergroups[0].markers.push(marker);
            }
            return true;
        }
        return false;
    }
    render() {
        // console.debug('VTB-MAP::render');
        const containerStyles = {};
        if (this.height && this.height > 0) {
            containerStyles.height = this.height.toString() + 'px';
        }
        if (this.width && this.width > 0) {
            containerStyles.width = this.width.toString() + 'px';
        }
        return html `
      <div id="map" style="${styleMap(containerStyles)}">
        Initializing map...
      </div>
    `;
    }
    firstUpdated() {
        // console.debug('VTB-MAP::firstUpdated');
        this._loader
            ?.load()
            .then((google // eslint-disable-line @typescript-eslint/no-explicit-any
        ) => {
            this._google = google.maps;
            this._bounds = new google.maps.LatLngBounds();
            this.initializeMap();
        })
            .catch((err) => {
            console.error(err);
        });
    }
    initializeMap() {
        // console.debug('VTB-MAP::initializeMap');
        const mapoptions = {
            zoom: 1, // default zoom level, without it stops rendering
            mapTypeControl: false, // disable map control
            streetViewControl: false, // disable streetview
            fullscreenControl: false // disable fullscreen
        };
        if (this._container && this._google) {
            const map = new this._google.Map(this._container, mapoptions);
            this._map = map;
        }
        // this._map?.addListener('mapcapabilities_changed', () => {
        //   // const mapCapabilities = this._map?.getMapCapabilities();
        //   // console.debug('mapCapabilities: ', mapCapabilities);
        //   // if (!mapCapabilities?.isAdvancedMarkersAvailable) {
        //   //   // Advanced markers are *not* available, add a fallback.
        //   //   console.warn('Advanced markers are not available');
        //   // }
        // });
        this.setMapStyle();
        this.addMarkers();
        if (this._bounds) {
            // console.debug('fitting bounds: ', this._bounds);
            this._map?.fitBounds(this._bounds);
            // console.debug('setting center: ', this._bounds.getCenter());
            this._map?.setCenter(this._bounds.getCenter());
        }
    }
    setMapStyle() {
        if (this._google &&
            this.mapstyles &&
            this.mapstyles.length >= 1 &&
            this._map) {
            this._map.mapTypes.set('custom_map_styles', new this._google.StyledMapType(this.mapstyles));
            this._map.setMapTypeId('custom_map_styles');
        }
    }
    addMarkers() {
        // console.debug('VTB-MAP::addMarkers');
        if (!this._google || !this._map) {
            // console.debug('not adding markers (yet): ', [this._google, this._map]);
            return;
        }
        for (const group of this.markergroups) {
            // console.debug('adding markers from group: ', group);
            const tripCoordinates = [];
            const markers = group.markers;
            for (const marker of markers) {
                this.addMarker(marker);
                const latlng = new this._google.LatLng(marker.lat, marker.lng);
                tripCoordinates.push(latlng);
            }
            const connectModeOptionsByAir = [
                'fly',
                'plane',
                'air',
                'flight',
                'airplane'
            ];
            if (group.connectMarkers &&
                (!group.connectMode ||
                    connectModeOptionsByAir.includes(group.connectMode))) {
                const tripPath = new this._google.Polyline({
                    path: tripCoordinates,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });
                tripPath.setMap(this._map);
            }
            const connectModeOptionsByRoad = [
                'drive',
                'car',
                'driving',
                'byroad',
                'road'
            ];
            if (group.connectMarkers &&
                group.connectMode &&
                connectModeOptionsByRoad.includes(group.connectMode)) {
                this.renderDirections(tripCoordinates, google.maps.TravelMode.DRIVING);
            }
        }
    }
    addMarker(marker) {
        // console.debug('VTB-MAP::addMarker => ', marker);
        const map = this._map;
        const markerOptions = {};
        markerOptions.position = new google.maps.LatLng(marker.lat, marker.lng);
        markerOptions.map = map;
        markerOptions.label = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[this.marker_counter];
        const gmarker = new google.maps.Marker(markerOptions);
        if (marker.title) {
            // console.debug('create rich marker markup');
            const infowindow = new google.maps.InfoWindow({
                content: `<div class="vtb-map-marker-title">${marker.title}</div>`,
                ariaLabel: marker.title ? marker.title : ''
            });
            gmarker.addListener('click', () => {
                // console.debug('click');
                infowindow.open({
                    anchor: gmarker,
                    map
                });
            });
        }
        this._bounds?.extend(gmarker.getPosition());
        this.marker_counter++;
    }
    renderDirections(tripCoordinates, travel_mode = google.maps.TravelMode.DRIVING) {
        if (!this._google && !this._map) {
            return;
        }
        const map = this._map;
        if (!this._directions_service) {
            this._directions_service = new google.maps.DirectionsService();
        }
        if (!this._directions_renderer) {
            this._directions_renderer = new google.maps.DirectionsRenderer({
                suppressMarkers: true
            });
            this._directions_renderer.setMap(map);
        }
        const origin = tripCoordinates.shift();
        const destination = tripCoordinates.pop();
        const directions_request = {};
        directions_request.origin = origin;
        directions_request.destination = destination;
        directions_request.travelMode = travel_mode;
        directions_request.unitSystem = google.maps.UnitSystem.METRIC;
        if (tripCoordinates.length >= 1) {
            const waypoints = [];
            tripCoordinates.forEach((elm) => {
                const wypnt = {
                    location: elm,
                    stopover: true
                };
                waypoints.push(wypnt);
            });
            directions_request.waypoints = waypoints;
        }
        this._directions_service.route(directions_request, (result, status) => {
            if (status == 'OK' && result) {
                this._directions_renderer?.setDirections(result);
            }
            else {
                console.error('Directions request failed due to ' + status);
            }
        });
    }
};
VtbMapElement.styles = css `
    :host {
      display: block;
    }

    button.gm-ui-hover-effect span svg {
      fill: #000;
    }
  `;
__decorate([
    property({ type: String, attribute: 'api-key' })
], VtbMapElement.prototype, "api_key", void 0);
__decorate([
    property({
        type: Array,
        hasChanged(newVal, oldVal) {
            // console.debug('VtbMapElement::markergroups::hasChanged');
            return !isEqual(newVal, oldVal);
        }
    })
], VtbMapElement.prototype, "markergroups", void 0);
__decorate([
    property({ type: Number })
], VtbMapElement.prototype, "height", void 0);
__decorate([
    property({ type: Number })
], VtbMapElement.prototype, "width", void 0);
__decorate([
    property({ type: Number })
], VtbMapElement.prototype, "zoom", void 0);
__decorate([
    property({ type: Boolean, attribute: 'connect-markers' })
], VtbMapElement.prototype, "connect_markers", void 0);
__decorate([
    property({ type: String, attribute: 'connect-mode' })
], VtbMapElement.prototype, "connect_mode", void 0);
__decorate([
    property({ type: Boolean, attribute: 'infowindow-enabled' })
], VtbMapElement.prototype, "use_info_window", void 0);
__decorate([
    property({
        type: Array,
        attribute: false,
        hasChanged(newVal, oldVal) {
            return !isEqual(newVal, oldVal);
        }
    })
], VtbMapElement.prototype, "mapstyles", void 0);
__decorate([
    query('div#map')
], VtbMapElement.prototype, "_container", void 0);
VtbMapElement = __decorate([
    customElement('vtb-map')
], VtbMapElement);
export { VtbMapElement };
// test
//# sourceMappingURL=map.js.map
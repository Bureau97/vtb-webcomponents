import {LitElement, css, html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {styleMap, StyleInfo} from 'lit/directives/style-map.js';

import * as _ from 'lodash';
const {isEqual} = _;

import * as GMaps from '@googlemaps/js-api-loader';
const {Loader} = GMaps;

import {VtbMapMarkerGroup, VtbMapMarker} from '../models.js';

import {VtbMapMarkerConnectMode} from '../utils/types.js';

export interface VtbMapOptions {
  connect_mode?: string;
  connect_markers: boolean;
  api_key: string;
  height?: number;
  width?: number;
  zoom?: number;
}

@customElement('vtb-map-marker')
export class VtbMapMarkerElement extends LitElement {
  @property({type: Number, reflect: true})
  lat: number = 0.0;

  @property({type: Number, reflect: true})
  lng: number = 0.0;

  @property({type: String})
  icon?: string;

  @property({type: String})
  label?: string;

  static override styles = css`
    :host {
      display: none;
    }
  `;

  override connectedCallback() {
    // console.debug('VTB-MAP-MARKER::connectedCallback');
    super.connectedCallback();
  }
}

@customElement('vtb-map-marker-group')
export class VtbMapMarkerGroupElement extends LitElement {
  @property({type: Boolean, attribute: 'connect-markers'})
  connect_markers: boolean = false;

  get connectMarkers(): boolean {
    return this.connect_markers;
  }

  set connectMarkers(value: boolean) {
    this.connect_markers = value;
  }

  @property({type: String, attribute: 'connect-mode'})
  connect_mode?: string = 'flight';

  get connectMode(): string | undefined {
    return this.connect_mode;
  }

  set connectMode(value: string) {
    this.connect_mode = value;
  }

  @property({
    type: Array,
    hasChanged(newVal: Array<VtbMapMarker>, oldVal: Array<VtbMapMarker>) {
      // console.debug('VtbMapElement::markers::hasChanged');
      return !isEqual(newVal, oldVal);
    },
  })
  markers: Array<VtbMapMarker>;

  static override styles = css`
    :host {
      display: none;
    }
  `;

  constructor() {
    super();
    this.markers = [];
  }

  override connectedCallback() {
    // console.debug('VTB-MAP-MARKER-GROUP::connectedCallback');
    super.connectedCallback();

    if (this.children.length >= 1) {
      for (const child of this.children) {
        const marker = this.parseMarkerElement(child as HTMLElement);
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
            const marker = this.parseMarkerElement(node as HTMLElement);

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
      childList: true,
    });
  }

  public parseMarkerElement(element: HTMLElement): VtbMapMarker | null {
    const re_marker = /^vtb-map-marker$/i;

    if (re_marker.test(element.tagName)) {
      const _marker_element = element as VtbMapMarkerElement;

      const marker = new VtbMapMarker();
      marker.title = element.title || element.innerHTML;
      marker.lat =
        parseFloat(_marker_element.getAttribute('lat') as string) || 0.0;
      marker.lng =
        parseFloat(_marker_element.getAttribute('lng') as string) || 0.0;

      return marker;
    }

    return null;
  }
}

@customElement('vtb-map')
export class VtbMapElement extends LitElement {
  @property({type: String, attribute: 'api-key'})
  api_key = '';

  set apiKey(value: string) {
    this.api_key = value;
  }

  get apiKey(): string {
    return this.api_key;
  }

  @property({
    type: Array,
    hasChanged(
      newVal: Array<VtbMapMarkerGroup>,
      oldVal: Array<VtbMapMarkerGroup>
    ) {
      // console.debug('VtbMapElement::markergroups::hasChanged');
      return !isEqual(newVal, oldVal);
    },
  })
  markergroups: Array<VtbMapMarkerGroup>;

  @property({type: Number})
  height?: number = 400;

  @property({type: Number})
  width?: number = Number.NaN;

  @property({type: Number})
  zoom?: number = Number.NaN;

  @property({type: Boolean, attribute: 'connect-markers'})
  connect_markers = false;

  get connectMarkers(): boolean {
    return this.connect_markers;
  }

  set connectMarkers(value: boolean) {
    this.connect_markers = value;
  }

  @property({type: String, attribute: 'connect-mode'})
  connect_mode?: string = 'flight';

  get connectMode(): string | undefined {
    return this.connect_mode;
  }

  set connectMode(value: string) {
    this.connect_mode = value;
  }

  @property({type: Boolean, attribute: 'infowindow-enabled'})
  use_info_window = false;

  get useInfoWindow(): boolean {
    return this.use_info_window;
  }

  set useInfoWindow(value: boolean) {
    this.use_info_window = value;
  }

  @property({
    type: Array,
    attribute: false,
    hasChanged(newVal: Array<Node>, oldVal: Array<Node>) {
      return !isEqual(newVal, oldVal);
    },
  })
  mapstyles?: Array<google.maps.MapTypeStyle> = [];

  @query('div#map')
  _container?: HTMLElement;

  private _loader?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  private _google?: typeof google.maps = undefined;
  private _directions_service?: google.maps.DirectionsService = undefined;
  private _directions_renderer?: google.maps.DirectionsRenderer = undefined;
  private marker_counter: number = 0;

  private _map?: google.maps.Map | null | undefined = null;
  set map(value: google.maps.Map | null | undefined) {
    this._map = value;
  }

  get map(): google.maps.Map | null | undefined {
    return this._map;
  }

  private _bounds?: google.maps.LatLngBounds | undefined = undefined;
  set bounds(value: google.maps.LatLngBounds | undefined) {
    this._bounds = value;
  }

  get bounds(): google.maps.LatLngBounds | undefined {
    return this._bounds;
  }

  static override styles = css`
    :host {
      display: block;
    }

    button.gm-ui-hover-effect span svg {
      fill: #000;
    }
  `;

  constructor() {
    // console.debug('VtbMapElement::constructor');
    super();
    this.markergroups = [];
    this.marker_counter = 0; // make sure to reset the counter on each initialization
  }

  override connectedCallback() {
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
      version: 'weekly',
    });

    // setup mutation observer for changes to dom
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          // push all nodes to the childElements
          let _changed: Boolean = false;
          for (const node of mutation.addedNodes) {
            const rs = this.parseChildNode(node as Element);

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
      childList: true,
    });
  }

  private parseChildNode(childNode: Element): boolean {
    // console.debug('VTB-MAP::parseChildNode', childNode);
    const re_group = /^vtb-map-marker-group$/i,
      re_marker = /^vtb-map-marker$/i;

    if (re_group.test(childNode.tagName)) {
      const group = new VtbMapMarkerGroup();
      const groupElement = childNode as VtbMapMarkerGroupElement;

      group.connectMode = childNode.getAttribute(
        'connect-mode'
      ) as VtbMapMarkerConnectMode;
      group.connectMarkers = childNode.hasAttribute('connect-markers') || false;
      group.markers = groupElement.markers;

      this.markergroups.push(group);

      return true;
    } else if (re_marker.test(childNode.tagName)) {
      // we got a marker without a group
      const _marker_element = childNode as VtbMapMarkerElement;
      const marker = new VtbMapMarkerGroupElement().parseMarkerElement(
        _marker_element
      );

      if (this.markergroups.length <= 0) {
        this.markergroups.push(new VtbMapMarkerGroup());
        this.markergroups[0].connectMarkers = this.connect_markers;
        this.markergroups[0].connectMode = this
          .connect_mode as VtbMapMarkerConnectMode;
      }

      if (marker) {
        this.markergroups[0].markers.push(marker);
      }

      return true;
    }

    return false;
  }

  override render() {
    // console.debug('VTB-MAP::render');

    const containerStyles: StyleInfo = {};
    if (this.height && this.height > 0) {
      containerStyles.height = this.height.toString() + 'px';
    }

    if (this.width && this.width > 0) {
      containerStyles.width = this.width.toString() + 'px';
    }

    return html`
      <div id="map" style="${styleMap(containerStyles)}">
        Initializing map...
      </div>
    `;
  }

  override firstUpdated() {
    // console.debug('VTB-MAP::firstUpdated');
    this._loader
      ?.load()
      .then(
        (
          google: any // eslint-disable-line @typescript-eslint/no-explicit-any
        ) => {
          this._google = google.maps;
          this._bounds = new google.maps.LatLngBounds();
          this.initializeMap();
        }
      )
      .catch((err: Error | string) => {
        console.error(err);
      });
  }

  protected initializeMap() {
    // console.debug('VTB-MAP::initializeMap');
    const mapoptions = {
      zoom: 1, // default zoom level, without it stops rendering
      mapTypeControl: false, // disable map control
      streetViewControl: false, // disable streetview
      fullscreenControl: false, // disable fullscreen
    } as google.maps.MapOptions;

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

  protected setMapStyle() {
    if (
      this._google &&
      this.mapstyles &&
      this.mapstyles.length >= 1 &&
      this._map
    ) {
      this._map.mapTypes.set(
        'custom_map_styles',
        new this._google.StyledMapType(this.mapstyles)
      );
      this._map.setMapTypeId('custom_map_styles');
    }
  }

  protected addMarkers() {
    // console.debug('VTB-MAP::addMarkers');

    if (!this._google || !this._map) {
      // console.debug('not adding markers (yet): ', [this._google, this._map]);
      return;
    }

    for (const group of this.markergroups) {
      // console.debug('adding markers from group: ', group);
      const tripCoordinates: Array<google.maps.LatLng> = [];
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
        'airplane',
      ];

      if (
        group.connectMarkers &&
        (!group.connectMode ||
          connectModeOptionsByAir.includes(group.connectMode))
      ) {
        const tripPath = new this._google.Polyline({
          path: tripCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });

        tripPath.setMap(this._map);
      }

      const connectModeOptionsByRoad = [
        'drive',
        'car',
        'driving',
        'byroad',
        'road',
      ];
      if (
        group.connectMarkers &&
        group.connectMode &&
        connectModeOptionsByRoad.includes(group.connectMode)
      ) {
        this.renderDirections(tripCoordinates, google.maps.TravelMode.DRIVING);
      }
    }
  }

  protected addMarker(marker: VtbMapMarker) {
    // console.debug('VTB-MAP::addMarker => ', marker);
    const map: google.maps.Map | null | undefined = this._map;

    const markerOptions: google.maps.MarkerOptions = {};
    markerOptions.position = new google.maps.LatLng(marker.lat, marker.lng);
    markerOptions.map = map;
    markerOptions.label = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[this.marker_counter];

    const gmarker: google.maps.Marker = new google.maps.Marker(markerOptions);
    if (marker.title) {
      // console.debug('create rich marker markup');
      const infowindow = new google.maps.InfoWindow({
        content: `<div class="vtb-map-marker-title">${marker.title}</div>`,
        ariaLabel: marker.title ? marker.title : '',
      });

      gmarker.addListener('click', () => {
        // console.debug('click');
        infowindow.open({
          anchor: gmarker,
          map,
        });
      });
    }

    this._bounds?.extend(gmarker.getPosition() as google.maps.LatLng);

    this.marker_counter++;
  }

  protected renderDirections(
    tripCoordinates: Array<google.maps.LatLng>,
    travel_mode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
  ) {
    if (!this._google && !this._map) {
      return;
    }

    const map: google.maps.Map | null = this._map as google.maps.Map | null;

    if (!this._directions_service) {
      this._directions_service = new google.maps.DirectionsService();
    }

    if (!this._directions_renderer) {
      this._directions_renderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
      });
      this._directions_renderer.setMap(map);
    }

    const origin = tripCoordinates.shift() as
      | google.maps.LatLng
      | google.maps.LatLngLiteral
      | string
      | google.maps.Place;
    const destination = tripCoordinates.pop() as
      | google.maps.LatLng
      | google.maps.LatLngLiteral
      | string
      | google.maps.Place;
    const directions_request = {} as google.maps.DirectionsRequest;
    directions_request.origin = origin;
    directions_request.destination = destination;
    directions_request.travelMode = travel_mode;
    directions_request.unitSystem = google.maps.UnitSystem.METRIC;

    if (tripCoordinates.length >= 1) {
      const waypoints = [] as Array<google.maps.DirectionsWaypoint>;

      tripCoordinates.forEach((elm) => {
        const wypnt = {
          location: elm,
          stopover: true,
        } as google.maps.DirectionsWaypoint;

        waypoints.push(wypnt);
      });
      directions_request.waypoints = waypoints;
    }

    this._directions_service.route(directions_request, (result, status) => {
      if (status == 'OK' && result) {
        this._directions_renderer?.setDirections(result);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vtb-map-marker-group': VtbMapMarkerGroupElement;
    'vtb-map-marker': VtbMapMarkerElement;
    'vtb-map': VtbMapElement;
  }
}
// test

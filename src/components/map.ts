import {LitElement, css, html} from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import {styleMap, StyleInfo} from 'lit/directives/style-map.js';

// import {isEqual} from 'lodash';
import * as _ from 'lodash';
const {isEqual} = _;

import * as GMaps from '@googlemaps/js-api-loader';
const {Loader} = GMaps;

@customElement('vtb-map-marker')
export class VtbMapMarkerElement extends LitElement {
  @property({type: Number, reflect: true})
  lat: number = Number.NaN;

  @property({type: Number, reflect: true})
  lng: number = Number.NaN;

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

  override render() {
    // console.debug('VTB-MAP-MARKER::render');
    return html` <div class="marker-content"></div> `;
  }
}

@customElement('vtb-map-marker-group')
export class VtbMapMarkerGroupElement extends LitElement {
  @property({type: Boolean, attribute: 'connect-markers'})
  connectMarkers: Boolean = false;

  @property({type: String, attribute: 'connect-mode'})
  connectMode?: string = 'flight';

  @property({type: Array, attribute: false})
  markers?: Array<Node> = [];

  @queryAssignedElements(<AssignedNodesOptions>{selector: 'vtb-map-marker'})
  _markers?: Array<VtbMapMarkerElement>;

  constructor() {
    super();
    this.markers = [];
  }

  override connectedCallback() {
    // console.debug('VTB-MAP-MARKER-GROUP::connectedCallback');
    super.connectedCallback();

    if (this.children.length >= 1) {
      for (const child of this.children) {
        if (child.tagName == 'VTB-MAP-MARKER') {
          const marker = <VtbMapMarkerElement>child;
          this.markers?.push(marker);
        }
      }
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          // push all nodes to the childElements
          let _changed = false;
          for (const node of mutation.addedNodes) {
            const _node = node as HTMLElement;
            if (_node.tagName == 'VTB-MAP-MARKER') {
              this.markers?.push(node);
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

  override render() {
    // console.debug('VTB-MAP-MARKER-GROUP::render');
    return html`
      <div class="vtb-map-marker-group">
        <slot></slot>
      </div>
    `;
  }
}

@customElement('vtb-map')
export class VtbMapElement extends LitElement {
  @property({type: String, attribute: 'api-key'})
  apiKey = '';

  @property({
    type: Array,
    hasChanged(
      newVal: Array<VtbMapMarkerGroupElement>,
      oldVal: Array<VtbMapMarkerGroupElement>
    ) {
      return !isEqual(newVal, oldVal);
    },
  })
  markergroups?: Array<VtbMapMarkerGroupElement>;

  @property({type: Number})
  height: number = 400;

  @property({type: Number})
  width: number = Number.NaN;

  @property({type: Number})
  zoom: number = Number.NaN;

  @property({type: Number, attribute: 'center-lat'})
  centerLat: number = Number.NaN;

  @property({type: Number, attribute: 'center-lng'})
  centerLng: number = Number.NaN;

  @property({type: String})
  center?: string;

  @property({type: Boolean, attribute: 'connect-markers'})
  connectMarkers = false;

  @property({type: Boolean, attribute: 'infowindow-enabled'})
  useInfoWindow = false;

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

  @queryAssignedElements(<AssignedNodesOptions>{
    selector: 'vtb-map-marker-group',
  })
  _markergroups?: Array<VtbMapMarkerGroupElement>;

  private _loader?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  private _google?: typeof google.maps = undefined;
  private _map?: google.maps.Map | null | undefined = null;
  private _directions_service?: google.maps.DirectionsService = undefined;
  private _directions_renderer?: google.maps.DirectionsRenderer = undefined;
  private _bounds?: google.maps.LatLngBounds = undefined;

  static override styles = css`
    :host {
      display: block;
    }

    button.gm-ui-hover-effect span svg {
      fill: #000;
    }
  `;

  constructor() {
    super();
    this.markergroups = [];
  }

  override connectedCallback() {
    super.connectedCallback();

    // console.info('loader: ', Loader);
    this._loader = new Loader({
      apiKey: this.apiKey,
      version: 'weekly',
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          // push all nodes to the childElements
          let _changed: Boolean = false;
          for (const node of mutation.addedNodes) {
            const _node: HTMLElement = node as HTMLElement;
            if (_node.tagName == 'VTB-MAP-MARKER-GROUP') {
              const _group = <VtbMapMarkerGroupElement>_node;
              this.markergroups?.push(_group);
              _changed = true;
            }
            // if (_node.tagName == 'VTB-MAP-MARKER') {
            //   let _markergroup = <VtbMapMarkerGroupElement> document.createElement('vtb-map-marker-group');
            //   _markergroup.appendChild(_node);
            // console.info(_markergroup);
            //   that.markergroups.push(_markergroup);
            //   _changed = true;
            // }
          }
          // call requestUpdate to re-render the element
          if (_changed) {
            // console.info('requesting an update');
            this.requestUpdate();
          }
        }
      });
    });

    observer.observe(this, {
      childList: true,
    });
  }

  override render() {
    // console.debug('VTB-MAP::render');

    const containerStyles: StyleInfo = {};
    if (this.height > 0) {
      containerStyles.height = this.height.toString() + 'px';
    }

    if (this.width > 0) {
      containerStyles.width = this.width.toString() + 'px';
    }

    return html`
      <div id="map" style="${styleMap(containerStyles)}">
        Initializing map...
      </div>
      <slot></slot>
    `;
  }

  override firstUpdated() {
    // console.debug('VTB-MAP::firstUpdated');

    const markergroups: Array<VtbMapMarkerGroupElement> = [];
    if (this._markergroups && this._markergroups.length >= 1) {
      for (const markergroup of this._markergroups) {
        markergroups.push(markergroup);
      }
    }
    this.markergroups = markergroups;

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
      center: {
        lat: this.centerLat,
        lng: this.centerLng,
      },
      zoom: 1, // default zoom level, without it stops rendering
      mapTypeControl: false, // disable map control
      streetViewControl: false, // disable streetview
      fullscreenControl: false, // disable fullscreen
    } as google.maps.MapOptions;
    // console.debug('mapoptions: ', mapoptions);

    if (this._container && this._google) {
      const map = new this._google.Map(this._container, mapoptions);
      this._map = map;
    }

    this.setMapStyle();
    this.renderMarkers();

    // if a zoom level is set on the element, dynamically set
    // this level.
    // if (this.zoom && this._map) {
    //   // console.info('setting zoom: ', this.zoom, typeof this.zoom);
    //   const zoom = Number(this.zoom);
    //   this._map.setZoom(zoom);
    // }

    // if (this._bounds) {
    //   console.info('fitting bounds: ', this._bounds);
    //   this._map?.fitBounds(this._bounds);
    //   console.info('setting center: ', this._bounds.getCenter());
    //   this._map?.setCenter(this._bounds.getCenter());
    //   // this._map?.setZoom(this._map?.getBoundsZoomLevel(this._bounds));
    // }
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

  protected renderMarkers() {
    // console.debug('VTB-MAP::renderMarkers');
    if (!this._google || !this._map) {
      // console.debug('not render markers: ', [this._google, this._map]);
      return;
    }

    const map: google.maps.Map | null = this._map;
    if (!this.markergroups) {
      return;
    }

    for (const group of this.markergroups) {
      // console.debug(group);
      const tripCoordinates: Array<google.maps.LatLng> = [];

      if (group._markers) {
        for (const marker of group._markers) {
          // console.debug('adding marker: ', marker);
          this.addMarker(marker);
          const latlng = new this._google.LatLng(marker.lat, marker.lng);
          tripCoordinates.push(latlng);
        }
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

        tripPath.setMap(map);
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

  protected addMarker(m: VtbMapMarkerElement) {
    // console.debug('VTB-MAP::addMarker => ', m);
    const map: google.maps.Map | null | undefined = this._map;

    // console.debug(this._map);

    const markerOptions: google.maps.MarkerOptions = {};
    markerOptions.position = new google.maps.LatLng(m.lat, m.lng);
    markerOptions.map = this._map;

    if (m.icon) {
      markerOptions.icon = m.icon;
    }

    if (!this.useInfoWindow) {
      markerOptions.title = m.innerText || m.title;
    }

    if (this.useInfoWindow && m.title) {
      markerOptions.title = m.title;
    }

    if (m.label) {
      markerOptions.label = m.label;
    }

    // console.debug('markeroptions', markerOptions);
    const marker: google.maps.Marker = new google.maps.Marker(markerOptions);
    // console.debug('google.maps.marker: ', marker);
    if (this.useInfoWindow && m.innerText) {
      // console.info('create rich marker markup');
      const infowindow = new google.maps.InfoWindow({
        content: m.innerHTML || m.title,
        ariaLabel: m.title ? m.title : '',
      });

      marker.addListener('click', () => {
        infowindow.open({
          anchor: marker,
          map,
        });
      });
    }

    this._bounds?.extend(marker.getPosition() as google.maps.LatLng);
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
      this._directions_renderer = new google.maps.DirectionsRenderer();
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

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
dayjs.locale('nl');
dayjs.extend(utc);
dayjs.extend(duration);
export class VtbParticipant {}
export class VtbParty {
  constructor() {
    this.id = '';
    this.participants = [];
  }
}
export class VtbMedia {
  constructor() {
    this.tags = [];
  }
}
export class VtbExtraField {
  constructor() {
    this.name = '';
  }
}
export class VtbFlight {
  constructor() {
    this.dateformat = 'DD MMM';
    this.timezone = 'UTC+01:00';
  }
}
export class VtbFlightCarrier {}
export class VtbFlightData {}
export class VtbParticipantPrice {
  constructor() {
    this.participant_id = '';
    this.price = 0.0;
  }
}
export class VtbElement {
  constructor() {
    this.id = 0;
    this.price = 0.0;
    this.price_diff = 0.0;
    this.optional = false;
    this.nights = 0;
    this.hidden = false;
    this.participants = [];
    this.media = [];
  }
}
export class VtbElementGroup {
  constructor() {
    this.id = 0;
    this.nights = 0;
    this.hidden = false;
    this.elements = {};
    this.media = [];
  }
}
export class VtbGeoLocation {
  constructor() {
    this.lat = 0.0;
    this.lng = 0.0;
  }
}
export class VtbData {
  constructor() {
    this.title = '';
    this.subtitle = '';
    this.duration = 0; // the number of days
    this.sales_price = 0;
    this.flight_elements = [];
    this.car_rental_elements = [];
    this.participants = {};
    this.parties = {};
    this.covers = [];
    this.extra_fields = {};
    this.days = [];
    this.elements = {};
  }
}
//# sourceMappingURL=data.js.map

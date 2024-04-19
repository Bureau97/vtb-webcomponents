---
layout: layout.njk
title: VTB API
---

# VTB API

De VTB API kan worden gebruikt om een travelplan.json in te laden. De loader biedt een API aan om de data uit het travelplan op een zo eenvoudig mogelijke manier te gebruiken.


## Initialisatie

```typescript
const config: VtbConfig = {
    calculate_flight_duration: true
};

new Vtb(config).load('/assets/travelplan.json').then((vtb) => {
    console.info(`vtb data loaded: ${vtb.title}`);
});
```



## Properties

### `.title: string`
Geeft de titel van het reisvoorstel

```javascript
const title = `<h1>${vtb.title}</h1>`;
```

### `.subtitle: string`
Geeft de subtitel van het reisvoorstel

```javascript
const subtitle = `<h2>${vtb.subtitle}</h2>`;
```


### `.covers: Array<VtbMedia>`
Geeft een lijst van VtbMedia objecten welke gebruikt kunnen worden voor het opbouwen van een VtbMediaElement voor bijvoorbeeld een "hero" afbeelding.

Met meerdere covers kan er bijvoorbeeld een hero slider worden opgebouwd.

```typescript
const cover: VtbMedia = vtb.covers[0];
const mediaElement = new VtbMediaElement();
mediaElement.media = cover;
mediaElement.cover = true;

document.appendChild(mediaElement);
```
```html
<vtb-media src="..." cover></vtb-media>
```

### `.startdate: Dayjs`
Geeft de start datum van de reis

```typescript
const metadata: HTMLDlElement = document.getElementById('trip-meta-data'); // <dl>
metadata.appendChild(`<dt>Startdatum:</dt><dd>${vtb.startdate.format('DD MMM YYYY')}</dd>`);
```
```html
<dl><dt>Startdatum:</dt><dd>15 april 2024</dd></dl>
```

### `.enddate: Dayjs`
Geeft de terugkomst datum van de reis
```typescript
const metadata: HTMLDlElement = document.getElementById('trip-meta-data'); // <dl>
metadata.appendChild(`<dt>Einddatum:</dt><dd>${vtb.enddate.format('DD MMM YYYY')}</dd>`);
```
```html
<dl><dt>Einddatum:</dt><dd>26 april 2024</dd></dl>
```

### `.duration: number`
Geeft de duur in dagen van de reis

```typescript
const metadata: HTMLDlElement = document.getElementById('trip-meta-data'); // <dl>
metadata.appendChild(`<dt>Reisduur:</dt><dd>${vtb.duration} dagen</dd>`);
```
```html
<dl><dt>Reisduur:</dt><dd>10 dagen</dd></dl>
```

### `.days: number`
Alias van duration
```typescript
const metadata: HTMLDlElement = document.getElementById('trip-meta-data'); // <dl>
metadata.appendChild(`<dt>Reisduur:</dt><dd>${vtb.days} dagen</dd>`);
```
```html
<dl><dt>Reisduur:</dt><dd>10 dagen</dd></dl>
```

### `.nights: number`
Geeft de duur in het aantal nachten van de reis

```typescript
const metadata: HTMLDlElement = document.getElementById('trip-meta-data'); // <dl>
metadata.appendChild(`<dt>Reisduur:</dt><dd>${vtb.nights} nachten</dd>`);
```
```html
<dl><dt>Reisduur:</dt><dd>9 nachten</dd></dl>
```

### `.sales_price: number`
Geeft de totaal prijs van de reis (door VTB berekend)
```typescript
import {currency} from 'vtb-webcomponents/utils/currency.js';

const metadata: HTMLDlElement = document.getElementById('trip-meta-data'); // <dl>
metadata.appendChild(`<dt>Totaal:</dt><dd>${currency(vtb.sales_price)}</dd>`);
```
```html
<dl><dt>Totaal:</dt><dd>€ 1.995,00</dd></dl>
```

### `.has_flightinfo: boolean`
Geeft aan of er binnen de reis een of meerdere (al dan niet optionele) vluchten zijn opgenomen.

```javascript
if (vtb.has_flightinfo) {
    // .. do something
}
```

### `.flightinfo Array<VtbFlightData>`
Geeft een lijst van vluchtelementen (FLightElement) terug

```typescript
const flight_table = document.getElementById('flight-table');
vtb.flightinfo.each((idx, flight) => {
    flight_table.appendChild(`
        <tr>
            <td>${flight.departure.city} (${flight.departure.IATA})</td>
            <td>${flight.departure.date.format('DD MMM')}</td>
            <td>${flight.arrival.city} (${flight.arrival.IATA})</td>
            <td>${flight.arrival.date.format('DD MMM')}</td>
            <td>${flight.flightnumber}</td>
        </tr>
    `);
});
```
```html
<table>
    <tr>
        <td>Amsterdam (AMS)</td>
        <td>10 april</td>
        <td>New York (JFK)</td>
        <td>11 april</td>
        <td>KLM987</td>
    </tr>
</table>
```

### `.flight_info`
Alias voor flightinfo

### `.has_carrental: boolean`
Geeft aan of er autohuur in het reisvoorstel is opgenomen

```javascript
if (vtb.has_carrental) {
    // .. do something
}
```

### `.carrental: Array<VtbElement>`
Geeft een lijst van elementen

### `.participants: Array<VtbParticipant>`
Geeft een lijst van de reizigers binnen het reisvoorstel

### `.parties: Array<VtbParty>`
Geeft een lijst van de binnen het reisvoorstel gedefinieerde reizigersgroepen. Er kunnen meerdere groepen bestaan wanneer er bijvoorbeeld twee bevriende koppels met elkaar op vakantie gaan.

### `.extra_fields: Dictionary<VtbExtraField>`
Geeft een dictionary terug met extra velden uit het reisvoorstel.


## Methoden

### `.load(travelplan_source_url: string): Promise<Vtb>`

Laad een travelplan.json bestand van het reisvoorstel en parsed deze data meteen voor gebruik.

```typescript
const config: VtbConfig = {
    calculate_flight_duration: true
};

new Vtb(config).load('/assets/travelplan.json').then((vtb) => {
    console.info(`vtb data loaded: ${vtb.title}`);
});
```


### `.parse_vtb_data(vtbSrcData: any): void`

Wanneer op een andere manier de json wordt ingeladen dan via de hierboven genoemde `.load()` kan de data geparsed worden via deze methode.

Een voorbeeld via SvelteKit met de json als statische asset waardoor server side rendering / static rendering mogelijk is:
```typescript
// (sveltekit)
import * as travelplan_data from '$lib/json/travelplan.json';
import {Vtb} from 'vtb-webcomponents';

export function load({params}) {
  const vtb = new Vtb({
    calculate_flight_duration: false
  });
  vtb.parse_vtb_data(travelplan_data);
}
```

### `.element_groups(): Array<VtbElementGroup>`

Geeft alle groepen elementen terug, meestal zijn deze per dag gedefinieerd.


### `.filter_groups(config: VtbFilterConfig): Array<VtbElementGroup>`

Geeft groepen terug welke voldoen aan het meegegeven filter:
[VtbFilterConfig]()

```typescript
const f: VtbFilterConfig = {
    group_type_ids: [SegmentTypes.DEFAULT, SegmentTypes.FLIGHT]
}

const groups = vtb.filter_groups(f);
groups.each((group, idx) => {
    // do something with the current group
});
```

### `.filter_elements(config: VtbFilterConfig): Array<VtbElement>`

Geeft alle elementen terug welke voldoen aan het meegegeven filter:

```typescript
const acco_elements: Array<VtbElement> = group.filter_elements({
    group_type_ids: [SegmentTypes.DEFAULT],
    element_unit_ids: [UnitTypes.ACCO]
});
```

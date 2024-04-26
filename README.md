# VTB Webcomponents

Dit project omvat een aantal tools en webcomponenten om het opbouwen van een output van de Visual Tour Builder (VTB) van TravelSpirit te vergemakkelijken.

De volgende features zijn beschikbaar:

- VTB API, voor het laden en inlezen van de VTB travelplan json uit de VTB
- VTB Media webcomponent, voor het weergeven van afbeeldingen uit MediaSpirit
- VTB Calculator, voor het weergeven en berekenen van de prijzen
- VTB Flightschedule, voor het opbouwen en weergeven van een vluchtschema
- VTB Map, voor het weergeven van kaarten op basis van Google Maps
- VTB Text, voor het weergeven en het inline bewerken van teksten uit het travelplan

Voor uitgebreide informatie zie: [Vtb Webcomponents docs](https://bureau97.github.io/vtb-webcomponents/)

## Installatie

De componenten zijn (nog niet) beschikbaar via npm maar zullen dit binnen
afzienbare tijd zijn. Tot die tijd kunnen de componenten rechtstreeks van
GitHub worden geinstalleerd.

```bash
npm i github:Bureau97/vtb-webcomponents
```

## Gebruik

**Initialisatie en inladen van een travelplan json:**

```typescript
import * as travelplan_data from 'travelplan.json';

import {Vtb} from 'vtb-webcomponents';

const vtb = new Vtb({
  calculate_flight_duration: false
});
vtb.parse_vtb_data(travelplan_data);
```

of

```typescript
import {Vtb} from 'vtb-webcomponents';

const travelplan_source_url = '/travelplan.json';

document.addEventListener('DOMContentLoaded', () => {
  const config: VtbConfig = {
    calculate_flight_duration: true
  };

  new Vtb(config).load(travelplan_source_url).then(vtbDataLoaded);
});

function vtbDataLoaded(vtb: Vtb) {
  // doe iets met de data
}
```

**Ophalen en weergeven van accommodatie elementen in een prijsoverzicht:**

```typescript
enum SegmentTypes {
  DEFAULT = 1,
  FLIGHT = 2,
  TOESLAGEN = 3,
  REISSOM = 4,
  HIDDEN = 5
}

enum UnitTypes {
  ACCO = 2,
  FLIGHT = 3,
  FLIGHTNIGHT = 4,
  TRANSFER = 5,
  CARRENTAL = 6,
  ACTIVITY = 10,
  EXTRA = 11
}

const acco_elements = vtb.filter_elements({
  group_type_ids: [SegmentTypes.DEFAULT],
  element_unit_ids: [UnitTypes.ACCO],
  optional: false
});

const accoTable = document.getElementById(
  'calc-dynamic-accos'
) as VtbCalculatorElement;

if (accoTable && acco_elements.length >= 1) {
  accoTable.render_element_description = function (element: VtbElement) {
    return `Dag: ${element.day}-${element.last_day} |
        ${element.nights} ${element.nights == 1 ? 'nacht' : 'nachten'}
        ${element.title}
    `;
  };
  accoTable.elements = acco_elements;
}
```

```html
<html>
  <head>
    ...
  </head>
  <body>
    <vtb-calculator
      id="calc-dynamic-accos"
      title="Accommodaties"
    ></vtb-calculator>
  </body>
</html>
```

## Richtlijnen voor het bijdragen aan het project.

Bugs en feature request kunnen worden ingediend via [Github Issues](https://github.com/Bureau97/vtb-webcomponents/issues).

Bijdragen aan code en documentatie kunnen worden toegevoegd via [Pull Requests](https://github.com/Bureau97/vtb-webcomponents/pulls).

### Bijdragen aan de componenten:

```bash
npm i github:Bureau97/vtb-webcomponents
```

Om de componenten te kunnen ontwikkelen is minimaal Nodejs 18.20 vereist. Wanneer gebruik gemaakt wordt Node Version Manager, er is een .nvmrc file toegevoegd met de te gebruiken Nodejs versie.

De componenten maken gebruik van het [Lit framework](https://lit.dev/).

De ontwikkelomgeving kan worden gestart via:

```bash
npm run webpack:dev
```

De componenten zijn benaderbaar via http://localhost:8000/

De /src/ directory bevat de componenten, de /dev/ directory bevat bestanden om de output van de componenten te renderen.


### Bijdragen aan de documentatie

De documentatie wordt opgebouwd met behulp van 11ty. De bronbestanden zijn MarkDown bestanden in /doc-src/.

De documentatie ontwikkelomgeving kan gestart worden door:

```bash
npm run docs:serve
```

De documentatie kan dan worden bekeken via http://localhost:8080/


## Licentie:

MIT

## Credits

[Huub Segers - Bureau97](https://github.com/huub-segers)

[Barry Nijenhuis - TravelSpirit](https://github.com/bseyb)

[Chris Kanger - 3rd floor coding](https://github.com/ChrisKanger)

[Dennis Essenburg - TravelSpirit](https://github.com/djessenb)

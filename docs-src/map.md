---
layout: page.11ty.cjs
title: VTB Map Element
---

# VTB Map

Het VTB Map element &lt;vtb-map&gt; kan worden gebruikt voor het weergeven van kaarten in de output van de Visual Tour Builder. De kaarten maken gebruik van Google Maps als basis.


```html
<script src="dist/esm/vtb.js"></script>
<script src="dist/esm/components/vtb-map.js"></script>

<script type="text/javascript">
    const map_options: VtbMapOptions = {
      connect_markers: true,
      connect_mode: 'flight',
      api_key: GOOGLE_MAPS_KEY
    };

    const map_search: VtbFilterConfig = {
      group_type_ids: [SegmentTypes.DEFAULT],
      element_unit_ids: [UnitTypes.ACCO],
      optional: false
    };

    vtb.map('example-map', map_search, map_options);
</script>

<vtb-map id="example-map">
</vtb-map>
```




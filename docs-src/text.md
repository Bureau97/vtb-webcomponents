---
layout: page.11ty.cjs
title: VTB Text Element
---

# VTB Text (in ontwikkeling)

Het VTB Text element &lt;vtb-text&gt; kan worden gebruikt voor het weergeven van teksten welke moeten kunnen worden aangepast middels de live-preview functie van de Visual Tour Builder.

Wanneer de live preview geactiveerd wordt vanuit de Visual Tour Builder kunnen teksten worden aangeklikt en aangepast. Na het wijzigen worden deze wijzigingen terug gestuurd naar de Visual Tour Builder.

```html
<script src="dist/esm/vtb.js"></script>
<script src="dist/esm/components/vtb-tekst.js"></script>

<script type="text/javascript">
    if (vtb.is_live_preview) {
        document.getElementsByTagName('vtb-text').forEach((el) => {
            vtb.initialize_live_preview(el);
        });
    }
</script>

<vtb-text>
    <p>
        When could weathermen predict the weather, let alone the future. Yeah,
        alright, bye-bye. What? Perfect, just perfect. Can I go now, Mr.
        Strickland? Over there, on my hope chest. I've never seen purple
        underwear before, Calvin.
    </p>
</vtb-tekst>
```




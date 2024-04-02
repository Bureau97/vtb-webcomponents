# VTB Media

<script src="../dist/esm/components/media.js"></script>

Het VTB Media element &lt;vtb-media&gt; kan worden gebruikt voor het weergeven
van foto's vanuit MediaSpirit. Door het meegeven van een "crop" eigenschap kan de foto op het juiste formaat worden weergegeven.

Het VTB Media element gedraagt zich als een HTML img element met een kanttekening dat het VTB media element zich aan de bounding box houdt en
zichzelf daarop schaalt.

<vtb-media
    src="https://s3-eu-west-1.amazonaws.com/media.reismetkinderen.nl/wordpress/large/miami-beach-.jpeg"
    crop="square/md"
    cover></vtb-media>

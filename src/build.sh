#!/bin/sh
cd "$(dirname "$0")"
{ cat head.html themes.css; echo "<script>"; cat game.js v5.js tail.js; echo "</script>"; } > index.html

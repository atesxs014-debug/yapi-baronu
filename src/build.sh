#!/bin/sh
cd "$(dirname "$0")"
{ cat head.html themes.css layout.css layout7.css; echo "<script>"; cat game.js v5.js v6.js v7.js v8.js tail.js; echo "</script>"; } > index.html

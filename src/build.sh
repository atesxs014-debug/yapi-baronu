#!/bin/sh
cd "$(dirname "$0")"
{ cat head.html; echo "<script>"; cat game.js v5.js tail.js; echo "</script>"; } > index.html

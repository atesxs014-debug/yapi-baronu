#!/bin/sh
# index.html'i (oyun) mobil uygulama klasörüne tam bir HTML sayfası olarak kopyalar
cd "$(dirname "$0")"
sh build.sh
{ echo '<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no"><meta name="theme-color" content="#fdf4e7"></head><body>'; cat index.html; echo '</body></html>'; } > ../www/index.html

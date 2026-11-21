# Yapı Baronu (mobil)

İnşaat ve emlak imparatorluğu kurma oyunu. Oyunun tamamı `www/index.html` içinde, Capacitor ile Android ve iOS uygulamasına çevriliyor.

## Derleme

`main` dalına her gönderimde GitHub Actions iki uygulamayı da derler:

- **Android:** `YapiBaronu.apk` (debug imzalı, doğrudan kurulur)
- **iOS:** `YapiBaronu.ipa` (imzasız; AltStore ya da Sideloadly ile yüklenir)

Dosyalar depo sayfasındaki **Releases** bölümünde çıkar. Elle başlatmak için: Actions → "Mobil derleme" → Run workflow.

## App Store / Google Play

- Google Play için imzalı bir sürüm (AAB) ve Play Console hesabı gerekir.
- App Store için Apple Developer hesabı ve imzalama sertifikası gerekir.

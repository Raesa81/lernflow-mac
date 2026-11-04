# Ziele und Semesterbilanz

Die Semesterbilanz summiert je Kalendertag Lernminuten minus Tagesziel, vom Semesterbeginn bis heute (höchstens Semesterende). Tage ohne Lernen zählen ebenfalls; freie Tage mit Ziel 0 erzeugen kein Minus. Die Kurve verbindet die tatsächlichen Tagesbilanzen ohne Glättung. Jeder Punkt enthält Datum, Lernzeit, Ziel und kumulierte Bilanz.

Unter Ziele gilt ein neuer Wochenplan wahlweise ab morgen oder für alle vergangenen und zukünftigen Tage. Rückwirkende Änderungen ersetzen die wirksamen Zielversionen; vorherige Versionen bleiben im Änderungsprotokoll `goalChanges` im JSON-Backup erhalten. `goalHistory` enthält die wirksamen datierten Pläne. Auch das Wochenziel unter Einstellungen gilt ab morgen.

Bestehende Browserdaten bleiben unter `lernflow-local-v1` gespeichert. Für alte Backups ohne Zielhistorie wird der vorhandene Tagesplan als Ausgangsplan verwendet. Frühere, vor dieser Version überschriebene Zielwerte sind nicht rekonstruierbar. Export und Import erhalten Zielhistorie und Änderungsprotokoll zusammen mit allen bisherigen Daten. Die Website-Adresse und der Browser müssen gleich bleiben, um auf dieselben lokalen Daten zuzugreifen.

Der Kalender zeigt Details beim Darüberfahren, Tastaturfokus und Antippen direkt unter dem Monatsraster.

Tests mit Node.js: `node balance.test.cjs`. Geprüft werden Migration, zukünftige und rückwirkende Ziele, wiederholte Änderungen, kumuliertes Auf/Ab, Semestergrenzen, freie Tage, Datenerhalt, JSON-Roundtrip, lange Zeiträume und die Kalender-Ereignisse.

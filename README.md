# Lernflow – Lerntracker für Mac

Ein eigenständiger, lokal nutzbarer Lerntracker mit einer modernen Dashboard-Oberfläche. Inspiriert von allgemein bekannten Lerntracker-Funktionen, **nicht** mit Athenify verbunden.

## Auf dem Mac starten

1. ZIP entpacken.
2. `index.html` doppelklicken – die App öffnet sich in Safari, Chrome oder Firefox.
3. Optional in Safari: **Ablage → Zum Dock hinzufügen**, um sie wie eine App zu starten (verfügbar auf neueren macOS-Versionen).

Es ist **keine** Installation und **kein** Terminal nötig. Die App läuft offline.

## Features
- Dashboard mit Wochenziel, Streak, Lernzeit und Fachverteilung
- Stoppuhr und 25-Minuten-Pomodoro
- Fach- und Aktivitätsauswahl
- Lerneinheiten manuell anlegen und löschen
- Lernkalender und Statistik-Heatmap
- Eigene Fächer und Prüfungen
- Lernziel bearbeiten
- Lokales Speichern und JSON-Backup/Import
- Responsives Dark UI

## Wichtig

Alle Daten werden per `localStorage` im jeweiligen Browser gespeichert. Bitte regelmäßig unter **Einstellungen → JSON exportieren** sichern. Ein Löschen der Browser-Website-Daten entfernt auch diese Lerntracker-Daten. Auf unterschiedlichen Browsern und Geräten erfolgt **keine** Synchronisierung.

Als Startdaten sind fünf Ingenieurwissenschafts-Fächer und zugehörige Beispiel-/persönliche Prüfungsdaten vorbelegt. Diese können gelöscht oder ergänzt werden.

## Auf GitHub veröffentlichen

Auf github.com ein neues Repository z. B. `lernflow-mac` erstellen und `index.html` sowie `README.md` hochladen. Unter **Settings → Pages** `Deploy from a branch` wählen, Branch `main`, Ordner `/ (root)`. Danach ist die App über die GitHub-Pages-Adresse erreichbar. Beim Aufruf über GitHub Pages wird der lokale Speicher getrennt vom `file://`-Aufruf geführt: Vor dem Umzug Backup exportieren, anschließend importieren.

Optional über Terminal:

```bash
git init
git add .
git commit -m "Initial Lernflow app"
git branch -M main
git remote add origin https://github.com/DEIN-NUTZERNAME/lernflow-mac.git
git push -u origin main
```

## Lizenz

Code für persönliche Nutzung und eigene Weiterentwicklung bereitgestellt. Keine Übernahme von Athenify-Code, Logos oder anderen Markenassets.

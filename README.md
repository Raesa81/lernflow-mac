# Lernflow Mac – Lerntracker (Version 2)

Eine unabhängige Lerntracking-Web-App für macOS und andere Browser. Sie ist von modernen Lern-Dashboards inspiriert, enthält aber keinen Originalcode von Athenify.

## Starten

`index.html` im Browser öffnen oder über GitHub Pages bereitstellen.

## Neu in Version 2

- Dunkle Seitenleiste mit Dashboard, Lerneinheiten, Aufgaben und Einstellungen
- Dashboard: Tages-, Wochen- und Monatsfortschritt, Kalender, Lernverlauf, Fachverteilung, Balkendiagramme und Prüfungstermine
- Nachträgliche Erfassung mit Anfang, Ende, Pause, Aktivität und Notiz
- Such- und Fachfilter sowie Bearbeiten/Löschen in der Lerneinheiten-Historie
- Permanenter Timer-Zugang oben rechts; Stoppuhr und 25-Minuten-Pomodoro
- Vollbild-Fokusmodus mit getrennt gemessener Lernzeit und Pausenzeit
- Timerzustand überlebt gewöhnliches Neuladen des Tabs
- Aufgabenliste, Fachverwaltung, JSON-Export/-Import

## GitHub Pages aktualisieren

1. Vorher in der bisherigen App **Einstellungen → JSON-Backup herunterladen**.
2. Das Repository unter `github.com/DEIN-NAME/lernflow-mac` öffnen.
3. `index.html` auswählen, dann das Stift-Symbol (Edit this file) wählen. Für einen einfacheren Austausch: auf `Add file` → `Upload files`, die neue `index.html` und `README.md` in die Repository-Wurzel ziehen, die vorhandenen Dateien ersetzen lassen und `Commit changes` klicken. Alternativ lokal via Git pushen.
4. Ein paar Minuten später die bisherige GitHub-Pages-Adresse neu laden (ggf. Cmd + Shift + R).

## Datenschutz

Alle Lernzeiten werden ausschließlich im `localStorage` des aktuellen Browsers gespeichert. Es gibt keine Cloud-Synchronisierung. Regelmäßig JSON-Backups anlegen. GitHub Pages hostet nur die App-Dateien, nicht deine Lerndaten.

## Hinweise

Eine Web-App ist kein nativer macOS-Prozess. Auf Dauer können Browser Hintergrundtabs drosseln; der Timer basiert auf realen Zeitstempeln statt auf gezählten Intervallen. Die Vollbildansicht nutzt die Browser-Fullscreen-API, falls verfügbar. Bei unbekannten Browserrechten läuft die Ansicht innerhalb des Browserfensters.

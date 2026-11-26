# Pegger: Integrationsvorbereitung

## Aktueller Stand

- Datum: 26.11.2026. Branch `dev`, Ausgangscommit `56ef764041caeda9f0bd809fadf2c8d315319d46`.
- Auftrag: Pegger und direkte Nachbarprojekte zuerst prüfen und konkrete Anbindungshindernisse vor AgentenWerk beheben.
- Vorgefundene Nutzerarbeit: `TODO.md`, `docs/dev-terminal-design.md`, Root-`project_status.md` geändert; bestehendes `aidocs/` unversioniert. Diese drei Nutzerdateien bleiben bytegenau erhalten; SHA-256-Ausgangsmanifest im freigegebenen temporären Ordner.
- Der [bisherige Root-Tracker](../project_status.md) bleibt als unberührte Historie/Quelle offener Terminalaufgaben erhalten. Dieser lokale aidocs-Tracker besitzt den neuen Änderungsschnitt gemäss Workspace-Ablageregel.
- Lieferung nur lokal: keine Commits, Pushes, Remote-Schreibzugriffe, Secrets, DNS-/Proxyänderungen oder Deployments. Bestehende Terminalroadmap ist kein Auftrag, jetzt eine öffentliche Shell auszurollen.

## Pushfreigabe 26.11.2026

- Nutzerauftrag: „dann push mal“, bestätigt mit „server offline“ und erneutem Pushauftrag.
- Freigegebener Umfang: eigene lokale Integrationskorrekturen und notwendiger aidocs-Baum; nicht die drei vorgefundenen fachlichen Nutzerdateien. Der Server wird nicht kontaktiert.
- Ziel: `https://github.com/PEGGERdev/pegger.git`, Branch `dev`; `main` bleibt wegen offener Linux-/Betriebsabnahme unverändert.
- Für die Veröffentlichung wird ein sauberer separater Arbeitsbaum aus dem Remote-Basisstand aufgebaut. Tests und erzeugte Indizes müssen zu genau diesem Stand passen, nicht zu ausgeschlossenen lokalen Nutzeränderungen.
- Stand der Übertragung: vorbereitet; tatsächliche Commit-/Remote-Ergebnisse werden nach der Ausführung nachgetragen.
- Erneute Prüfung des isolierten `origin/dev`-basierten Lieferstands: `npm test` mit 12/12 Runtime- und 7/7 Nodefällen, Deploymentfixtures, Typprüfung und Produktionsbuild bestanden. Nach lokalen physischen Abhängigkeiten statt der nur für den Test angelegten Junction lädt Vite alle Schriften innerhalb des Prüfarbeitsbaums.
- Vollständige Browserprüfung dieses Lieferstands: `npm run test:e2e -- --workers=1`, 28/28 bestanden unter Chromium/Windows. Der vorherige Zweiarbeiterlauf hatte 27/28 bestanden und einen abweichend gescrollten Desktop-Kontaktframe gezeigt; Einzelwiederholung und anschliessender vollständiger Einarbeiterlauf bestanden. Keine Toleranz erhöht, kein Test übersprungen und keine weitere Bildreferenz erneuert; parallele Screenshotstabilität bleibt ein Befund. Linux-/Betriebsfreigabe unverändert offen.

## Aufgaben

| ID | Tätigkeit | Stand | Abnahme |
|---|---|---|---|
| PREP-01 | Mobile/Desktop-Projekt- und Kontaktaktionen samt 900px-Grenze reparieren | lokal verifiziert | 4 Node-Navigationsfälle + 10 neue Browserfälle, komplette 28/28-Browsersuite unter Windows; 3 beabsichtigte mobile Referenzen nach Bildkontrolle erneuert; Linuxfreigabe offen |
| PREP-02 | CI-Branchpfad und SSH-Hostprüfung härten | lokal verifiziert | 3 Releasekonfigurationsfälle, synthetische echte Ed25519-Schlüssel; gemischte/falsche/leere Scans abgewiesen; kein tatsächlicher CI-/VPS-Release |
| PREP-03 | Proxybackup bis öffentlicher Revisionsprüfung behalten und fremde Dateien erhalten | lokal verifiziert | Stub-Docker-Fixtures für Validierung/Reload/Restorefehler; Backup bleibt bis zum letzten Gate, fremde Routen und Legacydateien erhalten |
| PREP-04 | Direkte Projektnachbarn auf Hosting-/Domainkonflikte prüfen | lokal verifiziert | Portfolio/SpotOnSight read-only geprüft; Pay-Korrektur mit eigenen Tests im Besitzerprojekt, keine Source-/Proxyänderungen bei den beiden anderen Projekten |
| PREP-05 | Tatsächliche AgentenWerk-Anbindungsgrenze dokumentieren, Baum und Lieferung prüfen | lokal verifiziert | passende Dateiverträge, gültige Indizes/Verweise, expliziter privater Servicevertrag und bytegenauer Erhalt aller 3 vorgefundenen Nutzerdateien |

## Nachweise

| Datum | Prüfung | Ist / Grenze |
|---|---|---|
| 26.11.2026 | `npm test`, `npm run typecheck`, `npm run test:deployment` im Ausgangsstand | 12 Runtimefälle, Typprüfung und vorhandene Caddy-Parserfixtures bestanden; decken die entdeckten Navigations-/Releasefehler nicht ab |
| 26.11.2026 | Gitstatus/-diff und gemeinsame `--changes`-Prüfung | vorbestehende Nutzerdateien identifiziert, nicht Teil eigener Korrekturen |
| 26.11.2026 | reine HEAD-Proben gegen Hub/Portfolio/Pay/SpotOnSight/Dev aus Toolnetz | TLS-Namensprüfung für vier Hosts gescheitert, `pay.pegger.dev` dort nicht auflösbar; **keine** TLS-Prüfung umgangen, kein zuverlässiger Produktionsnachweis aus diesem Netz |
| 26.11.2026 | neuer mobiler semantischer Navigationstest vor der Korrektur | reproduzierbar fehlgeschlagen: Projekt ausgewählt, Link nicht vorhanden; Ausgangssuite 18/18 hatte diese Lücke nicht erfasst |
| 26.11.2026 | neue Release-/Rollbacktests vor der Korrektur | reproduzierbar fehlgeschlagen: master-Trigger, ungepinnter Gesamtscan, Legacyordnerlöschung und zu früh entferntes Caddybackup |
| 26.11.2026 | `npm test` nach Korrektur | 12/12 bestehende Runtimefälle plus 7/7 Node-Navigations-/Releasefälle bestanden |
| 26.11.2026 | `npm run test:deployment` nach Korrektur | Parser-, Hostpin- und Rollbackfixtures bestanden; Ablehnungsausgaben bei Negativfällen sind erwartet, keine echten Docker-/SSH-Zugriffe |
| 26.11.2026 | `npm run typecheck`, `npm run build` | Typprüfung erfolgreich, 49 Module gebaut; keine neuen Abhängigkeiten installiert |
| 26.11.2026 | komplette `npm run test:e2e` nach gezielter Referenzpflege, zuletzt erneut ausgeführt | 28/28 unter Chromium/Windows bestanden; 10 neue funktionale Tests, bestehende Hub-/Ratingfälle bleiben aktiv |
| 26.11.2026 | Bildkontrolle der drei mobilen Auswahlzustände | vorherige Referenz und tatsächliche Portfolio-/Kontakt-/Devansichten gelesen; neue Details/Schliessen/Aktion ohne Clipping, absichtliche Mehrhöhe. Nur 3 Win32referenzen aktualisiert, keine Linuxdatei geändert |
| 26.11.2026 | gemeinsame `--write`, `--check-contracts` für 14 bearbeitete Quellpfade, `--check`, `--context` | keine fehlenden Vertragsabschnitte/Indizes/Dateiziele; Roottracker im Tool ist historisch, aktueller Schnitt wird gemäss lokaler Karte hier geführt |
| 26.11.2026 | zusätzlicher temporärer Markdown-Dateilinkprüfer | alle lokalen Dateiziele in aidocs und Root-Einstiegen erreichbar; keine Funktions-/Betriebsprüfung |
| 26.11.2026 | `git diff --check` und temporärer SHA-256-Erhaltungsprüfer | keine Whitespacefehler; `TODO.md`, Terminalentwurf und Roottracker bytegenau im vorgefundenen Zustand |

## Noch keine Betriebsfreigabe

Der Terminaldienst und AgentenWerk sind lokal nicht implementiert. Öffentliche Erreichbarkeit, Zertifikate, Authentifizierung, Worker-/Serverisolation und echte Geräte-/SSH-/Containerproben sind getrennte offene Betriebsgates. Die sichere öffentliche Hubnavigation erlaubt keinen Backend-/Shellzugriff ohne dessen eigene Authentifizierung.

**Releaseblocker:** Die drei Linux-Auswahlreferenzen sind nach der absichtlichen UI-Erweiterung noch im alten Stand und brauchen einen echten Linuxlauf mit Bildreview. Keine Windowsbilder nach Linux kopieren. Den vorhandenen VPS-Fingerprint vor Einsatz als tatsächlichen Ed25519-Pin unabhängig bestätigen; bei Abweichung scheitert das neue Verfahren geschlossen. Gemeinsame Infrastrukturänderungen benötigen Betreiberkoordination. Alte manuelle Fremdprojektdeployskripte werden dadurch nicht automatisch gehärtet oder als Agentenwerkzeuge freigegeben.

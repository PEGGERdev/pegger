# Anbindung an AgentenWerk

## Verantwortungsgrenzen

| Projekt | Tatsächliche Rolle | Konsequenz |
|---|---|---|
| Pegger | öffentlicher Vue-Hub mit Projektdaten und Links | Navigation, keine Credentials, Agenten-API, Jobausführung oder private Projektinhalte |
| [AgentenWerk](../../AgentenWerk/aidocs/README.md) | bisher nur Spezifikation einer privaten Arbeitszentrale | eigenständige Authentifizierung/Policy/Persistenz/Worker nötig; kein vorhandener Dienst zum Verlinken |
| [SpotOnSight](../../spotonsight/aidocs/README.md) | eigenes Produkt und lokaler Besitzer des Caddy-Grundmodells | gemeinsames `spotonsight_proxy`-Netz ist **keine** gemeinsame Authentifizierung; keine fremden Hostblöcke ersetzen |
| [Portfolio](../../portfolio/aidocs/README.md) | React-Portfolio auf `portfolio.pegger.dev` | separater öffentlicher Link, kein notwendiger Auth-/Workerbaustein |
| [Pay QR](../../pay-qr-with-apple-pay/aidocs/README.md) | Zahlungssystem | nicht als Hub/Terminal verwenden; bisher kollidierende Beispieldomains im Besitzerprojekt korrigieren |

## Vorhandene Konflikte

- Hubziel für Pay ist `pay.pegger.dev`; Zahlungs-Beispielkonfiguration/Doku benutzte dagegen `pegger.dev` und `dev.pegger.dev`, ein Legacydeploy `qr-pay.pegger.dev`. Der lokale sichere Zielvertrag trennt `pay.pegger.dev` / `pay-dev.pegger.dev` vom Hub und privaten Devzugang. DNS, Apple-Pay-Verifikation und tatsächliche Serverkonfiguration sind damit noch nicht eingerichtet.
- Peggers privater Terminalentwurf liegt in bestehender, uncommitteter Nutzerarbeit. Es gibt keinen lokalen Terminalserver. Ein Hub-Link ist kein Beweis für sicheren oder verfügbaren Betrieb.
- Shared Caddy darf bei einer fehlgeschlagenen Hubveröffentlichung nicht mit einer vorzeitig gelöschten Wiederherstellungsbasis zurückbleiben. Konkurrierende Betreiberdeployments müssen vor Echtbetrieb koordiniert werden; ein einzelner Hubrollback macht nicht alle Fremdskripte transaktional.

## Geplanter Anschluss

Verbindliche Leitplanken für jeden späteren Terminaldienst: unabhängige Geräte-/Anwendungsauthentifizierung, widerrufbare begrenzte Sitzungen, Host-/Origin-/CSRF-Prüfung, eigene nichtadministrative SSH-Identität, ausschliesslich Schlüssel mit gepinnter Hostidentität sowie begrenzte Prozesse/Netz-/Dateirechte. Keine Standardpasswörter, automatische Hostkeyannahme, Root-/Dockerrechte, gemeinsame Produktsitzung oder öffentlich publizierter Backendport. Ältere Konzeptbeispiele und nicht veröffentlichte lokale Terminalentwürfe erteilen keine Freigabe und setzen diese Grenzen nicht ausser Kraft.

Erst nach funktionsfähiger privater AgentenWerk-Anwendung und bestätigtem Host-/Auth-/Netzvertrag wird ein weiterer Projekteintrag aus dem bestehenden Datenmodell ergänzt. Ein möglicher eigener privater Host wird **nicht** vorweg als Liveziel angelegt; `dev.pegger.dev` bleibt durch den Terminalentwurf belegt. Privater Zugang nur mit eigener serverseitiger Autorisierung, TLS und geprüfter Workergrenze. Keine Hub-Cookies auf Subdomains ausweiten und keine API-Schlüssel in Vite-Konfiguration oder Kartendaten.

Prüfweg für den späteren Link: Desktop und Handy wählen den Eintrag → semantischer Link zeigt den bestätigten Host → kontrollierte private Gegenseite verlangt Anmeldung → kein direkter Zugriff auf OpenCode/Worker. Vorgeschaltetes VPN/mTLS und Anwendungssitzung sind ausdrücklich zu entscheiden. Erst diese Serviceabnahmen erlauben echte Aufgaben/Reviews/Freigaben; die aktuelle Reparatur baut diese Dienste nicht.

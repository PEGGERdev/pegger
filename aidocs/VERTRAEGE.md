# Vertiefte Dateiverträge für Pegger Hub

Die [Ordnerregeln](README.md) gelten zusätzlich. Die übrigen Projektdateien findest du an ihrem gespiegelten Pfad in `DATEIEN.md`.

## `src/data/starMapData.js`

Besitzt Projekt- und Verbindungsdaten der Karte. IDs, Referenzen, externe URLs und Anzeige bei fehlenden Knoten prüfen. [Quellpfad](../src/data/starMapData.js)

## `src/runtime/catalog/workflows.js`

Deklariert die Karten-Workflows. Reihenfolge und Verträge zu Actors, Policies und Projektoren am normalen UI-Einstieg nachvollziehen. [Quellpfad](../src/runtime/catalog/workflows.js)

## `src/runtime/catalog/policies.js`

Beantwortet die den Kartenablauf betreffenden Regeln. Die Auswirkung auf Navigation oder Anzeige mit der Action prüfen. [Quellpfad](../src/runtime/catalog/policies.js)

## `docs/dev-terminal-design.md`

Beschreibt den separaten privaten Terminalentwurf und dessen Freigabekriterien. Status und belegte Schutzgrenzen vor einer Änderung prüfen. [Quellpfad](../docs/dev-terminal-design.md)

## `AGENTS.md`

Führt zu lokaler Projektkarte, Arbeitsanleitung und gemeinsamen Regeln.

### Schnittstelle
Markdown mit relativen Links, keine eigene Status-/Freigabequelle.
### Einbau
Root-Einstieg für jede neue KI; lokale Karte führt zu Fachbesitzern.
### Verhalten
Vor Code Verträge/Tests lesen und vorgefundene Nutzeränderungen erhalten.
### Guardrails
Keine Betriebs-/Pushfreigabe und keine Duplizierung des Trackers.
### Verifikation
Aus `C:/coding`: `node ./aidocs/werkzeuge/sync-arbeitsbaum.mjs --check-contracts ./pegger AGENTS.md` und `--check ./pegger`.

## `src/runtime/catalog/nodeActions.js`

Projiziert genau eine sichere Navigationsaktion aus einem Kartenknoten, ohne I/O.

### Schnittstelle
`projectNodeAction(node)` liefert `null` oder `{ href, label, accessibleLabel, target, rel, icon }`. HTTPS-URL ohne Credentials hat Vorrang; sonst gültige einzelne Emailadresse als `mailto:`. Nur vollständige HTTPS-Ziele, keine anderen Schemes/Protokollrelativen/Controlzeichen. Fehlender/ungültiger expliziter URLwert ergibt keine Aktion.
### Einbau
`star-map-view`-Projektor ruft für jeden Knoten auf; Desktop/Mobil konsumieren dieselbe `actionsByNode`-Projektion.
### Verhalten
HTTPS bekommt `_blank` und `noopener noreferrer`, Mail keine neue Seite. Unbekannte Knoten/Daten ohne Ziel liefern null; keine Navigation beim Selektieren.
### Guardrails
Keine Authentscheidung, Netzabfrage oder `window.open`; Modell-/Inhaltstext darf keine ausführbaren Schemes einschleusen.
### Verifikation
Aus `C:/coding/pegger`: `node --test tests/navigation.test.mjs`; echte Runtimeprojektion plus ungültige/fehlende Ziele, Mailheaderinjektion und Credentials prüfen.

## `src/runtime/catalog/projectors.js`

Formt Karten-/Panel-/Themequellen und sichere Knotenaktionen in gemeinsame Viewmodelle.

### Schnittstelle
Bestehende Exporte/Projektor-IDs bleiben. `star-map-view` ergänzt `actionsByNode: Record<id, Action|null>` aus `projectNodeAction`; alle bisherigen Felder erhalten.
### Einbau
`star-map.view` im bestehenden Workflow; `usePeggerRuntime` und normale Runtime-Tests konsumieren den Projektor.
### Verhalten
Pro vorhandener Knoten-ID genau eine sichere Aktion oder null. Fehlende Quellen bleiben leere Listen; keine Seiteneffekte.
### Guardrails
URL-/Mailregel nur beim zuständigen Node-Action-Projektor; Komponenten duplizieren sie nicht. Keine Projekt-/Cluster-/Kanten-IDs ändern.
### Verifikation
Aus `C:/coding/pegger`: `npm test`; bestehende 12 Katalogfälle sowie `tests/navigation.test.mjs` über `createPeggerRuntime().getStarMapView()`.

## `src/components/StarMap.vue`

Rendert Karte und mobile Details mit tatsächlich nutzbaren, semantischen Projekt-/Kontaktlinks.

### Schnittstelle
Bestehendes `focus-change(id|null)` bleibt. Ansichten lesen Karten-/Aktionsmodell aus `usePeggerRuntime`. Auswahlbutton zeigt `aria-pressed`/`aria-expanded`; tatsächliche Navigation ist ein `<a>` mit sicherem projiziertem Ziel.
### Einbau
`App.vue` bindet Fokusereignis. Desktop-Fokus und mobile Clusterdetails konsumieren dieselbe `selectedAction`; keine eigenen Dienstrequests.
### Verhalten
Bis einschliesslich 900 CSS-px mobile Liste mit aufklappbaren Details/Aktion, darüber Karte. Mobile Auswahl/Deselektion ohne unsichtbare Kameraanimation; Touchscrollen nicht capturen. Kontakt zeigt Mailaktion. Tastatur/Schliessen/Resize lassen keine unzugänglichen Details zurück.
### Guardrails
Kein `window.open` oder verschachtelte interaktive Controls. Links öffnen nur auf Nutzeraktion; private Ziele behalten eigene Anmeldung. Keine horizontalen Überläufe bei 360/390/900px; Desktop-Layout unverändert ausser beabsichtigter Kontaktaktion.
### Verifikation
Aus `C:/coding/pegger`: `npm run typecheck`, `npm run build`, `npm run test:e2e`. `tests/e2e/navigation.e2e.spec.js` prüft echte Popupnavigation mit kontrolliertem Ziel, Mail, private 401-Grenze, Tastatur und 900px; bestehende Hub-Bilder intentional vergleichen.

## `tests/navigation.test.mjs`

Prüft Node-Action-Sicherheitsformen und deren Einbau in der echten Kartenruntime.

### Schnittstelle
Node-Testdatei ohne externe Dienste/Fixtures; importiert echte Runtime und Node-Action-Projektion.
### Einbau
`npm test` führt nach bestehendem Harness die Node-Tests aus.
### Verhalten
Bekannte Projekte/Dev haben sichere Links, Kontakt Mail, Skills keinen Link; gefährliche/fehlende Ziele werden null.
### Guardrails
Kein echter Browser-/HTTP-/Mailzugriff; ein Unitpass ersetzt keine UI-Prüfung.
### Verifikation
Aus `C:/coding/pegger`: `node --test tests/navigation.test.mjs`; alle positiven/negativen Fälle müssen bestanden sein.

## `tests/e2e/navigation.e2e.spec.js`

Belegt funktionale Hubnavigation und responsive Details über den normalen Browsereinstieg.

### Schnittstelle
Playwright-Tests für konfigurierte Desktop-/Mobilprojekte, keine realen privaten oder Zahlungsdienste.
### Einbau
Bestehendes `playwright.config.js` startet lokalen Vite-Server; Kontext-Route kontrolliert externe Zielantworten vor Klick.
### Verhalten
Auswahl allein navigiert nicht; Linkclick erzeugt echtes Popup am korrekten Ziel. Kontaktmail ist auslösbar, privater Dienst bleibt 401. 899/900/901px, 360px, Schliessen und Tastatur geprüft.
### Guardrails
Keine Produktivrequests, automatischen Logins oder TLS-Ausnahmen. Neue Bilder nur nach tatsächlicher visueller Kontrolle.
### Verifikation
Aus `C:/coding/pegger`: `npx playwright test tests/e2e/navigation.e2e.spec.js`, danach gesamtes `npm run test:e2e`.

## `package.json`

Bindet wiederholbare Runtime-, Navigations-, Release- und Deploymentprüfungen in vorhandene Scripts ein.

### Schnittstelle
Bestehende Start/Build/Typ-/Browserscripts bleiben; `test` umfasst Harness + Node-Tests, `test:deployment` alle lokalen Shellfixtures.
### Einbau
Lokale npm-CLI und GitHub-Verifyjob nutzen dieselben Scripts; keine neuen Pakete nötig.
### Verhalten
Jeder Testfehler beendet den jeweiligen Scriptlauf ungleich null; keine Snapshotupdates im Normaltest.
### Guardrails
Keine Provider-/Server-/Deployeffekte in Tests und keine erzwungene Neuinstallation.
### Verifikation
Aus `C:/coding/pegger`: `npm test`, `npm run test:deployment`, `npm run typecheck`, `npm run build`, `npm run test:e2e`.

## `.github/workflows/deploy.yml`

Prüft dev/main und veröffentlicht nur einen verifizierten aktuellen main-Stand mit gepinntem SSH-Host.

### Schnittstelle
Push/PR auf `dev` und `main`, Dispatch mit bestehendem Snapshotflag. Deployment nur `refs/heads/main`, nie Snapshotgenerierung; bestehende VPS-Secrets bleiben.
### Einbau
Verify ruft lokale npm-Scripts auf. Release verwendet `scripts/pin-host-key.sh`, festes Knownhostsfile und strikte Ed25519-SSH-Prüfung; Remotecheckout main nur fast-forward und exakt zur geprüften SHA.
### Verhalten
Veraltete Releases überspringen; fehlender/abweichender Hostkey oder schmutziger Remotecheckout blockiert. Kein `master`-Nebenpfad.
### Guardrails
Kein automatisches Vertrauen aller gescannten Schlüssel, kein Password-SSH oder Forcecheckout. Lokale Änderung dieses Workflows ist keine tatsächliche Veröffentlichung.
### Verifikation
Aus `C:/coding/pegger`: `node --test tests/release-contract.test.mjs` und `npm run test:deployment`; echte CI/VPS-Ausführung bleibt ohne Freigabe offen.

## `scripts/pin-host-key.sh`

Erzeugt ein Knownhostsfile ausschliesslich aus vollständig zum erwarteten Fingerprint passenden Ed25519-Schlüsseln.

### Schnittstelle
CLI `bash scripts/pin-host-key.sh HOST SHA256:FINGERPRINT OUTPUT`; beim Sourcen nur `verify_host_keys EXPECTED SCAN OUTPUT`, kein Netzaufruf.
### Einbau
Workflow scannt über diese CLI; SSH nutzt das erzeugte eigene File mit strikter Prüfung.
### Verhalten
Jede nichtleere Nichtkommentarzeile muss Ed25519 und genau gepinnt sein; leerer, ungültiger, gemischter oder unbekannter Scan scheitert, vorhandene Ausgabe bleibt unverändert. Endausgabe kontrolliert atomar ersetzen.
### Guardrails
Keine Secrets/Privatkeys im Output, kein tatsächlicher Deploy und kein Accept-new. Scanlimits/Hostargument validieren.
### Verifikation
Aus `C:/coding/pegger`: `bash scripts/test-pinned-host-keys.sh`; echte synthetische Ed25519-Keys, gültig/leer/falsch/gemischt/anderer Algorithmus und unveränderte Ausgabe bei Ablehnung.

## `scripts/test-pinned-host-keys.sh`

Belegt die Hostkey-Ablehnung ohne echten SSH-Server.

### Schnittstelle
Lokale Shellsuite mit temporären synthetischen öffentlichen Schlüsseln; Exit 0 nur bei allen Erwartungen.
### Einbau
`npm run test:deployment` sourct den echten Pinhelper und nutzt echtes `ssh-keygen`.
### Verhalten
Nur exakt passende gültige Scans erzeugen Ausgabe; jeder Negativfall erhält die Sentinel-Ausgabe.
### Guardrails
Keine Netzwerk-/Produktivschlüssel; nur den eigenen eindeutigen temporären Ordner entfernen.
### Verifikation
Aus `C:/coding/pegger`: `bash scripts/test-pinned-host-keys.sh` unter Git Bash bzw. Linux.

## `scripts/deploy-production.sh`

Veröffentlicht einen expliziten Hubstand mit rücknehmbarem Proxyzustand bis zum letzten Prüfgate.

### Schnittstelle
Bestehende Variablen/Composepfade und sourcbare Parserfunktionen bleiben. `configure_caddy`, `restore_caddy` und Exitpfad behalten die Backupbasis bis nach öffentlichem Revisionsnachweis.
### Einbau
Workflow ruft main nach exakter Revision auf; Tests sourcen nur Funktionen mit Stub-Docker.
### Verhalten
Backup erst nach vollständigem Erfolg entfernen. Fehler nach Caddyreload oder Revisionsprüfung können Originalbytes wiederherstellen. Restorefehler nicht als Erfolg verschlucken oder Backup löschen.
### Guardrails
Keine ungefragte Löschung von Root-`dist`, `config` oder altem Composefile. Fremde Hostblöcke erhalten; echte konkurrierende Infrastrukturdeployments bleiben separat zu koordinieren.
### Verifikation
Aus `C:/coding/pegger`: `npm run test:deployment`; Parser plus `scripts/test-deployment-rollback.sh` mit kontrollierten Fehlern, ohne Docker/Serverzugriff.

## `scripts/test-deployment-rollback.sh`

Prüft Backuplebensdauer und Caddy-Wiederherstellung mit echten Tempdateien und Stub-Docker.

### Schnittstelle
Sourct Produktionsfunktionen, ersetzt ausschliesslich externe Dockeraufrufe, Exit ungleich null bei Vertragsbruch.
### Einbau
Teil von `test:deployment`; Fixture enthält auch fremde Portfolio-/SpotOnSight-Routen.
### Verhalten
Nach Konfiguration bleibt Backup erhalten, Restore liefert Originalbytes; Validierungs-/Reloadfehler lassen kein verlorenes Backup zu.
### Guardrails
Kein Produktionsproxy/Netzaufruf, nur eigene Tempdateien entfernen.
### Verifikation
Aus `C:/coding/pegger`: `bash scripts/test-deployment-rollback.sh` und gesamte Deploymentsuite.

## `tests/release-contract.test.mjs`

Prüft die tatsächliche Workflowkonfiguration gegen den dev/main- und Hostpinvertrag.

### Schnittstelle
Node-Tests lesen `.github/workflows/deploy.yml`, keine GitHub-/SSH-Aufrufe.
### Einbau
Teil von `npm test`, lokale Deploymentfixtures belegen die echte Pin-/Rollbacklogik ergänzend.
### Verhalten
Dev/main-Trigger, main-only Release/Remotecheckout, kein master und striktes eigenes Knownhostsfile müssen vorhanden sein.
### Guardrails
Eine statische Konfigurationsprüfung ist kein ausgeführter Workflow oder VPS-Nachweis.
### Verifikation
Aus `C:/coding/pegger`: `node --test tests/release-contract.test.mjs`; daneben Shellfixtures ausführen.

## `README.md`

Hält Hubstart und Architektur mit korrekter Abgrenzung zum noch nicht implementierten privaten Dienst fest.

### Schnittstelle
Markdown für bestehende npm-Befehle, belegte Projektrollen und Links zur lokalen aidocs-Karte.
### Einbau
Root-Einstieg; lokale Karte besitzt neuen Status und Anbindungsregeln, Terminaldetails bleiben im bestehenden Nutzerentwurf.
### Verhalten
Kein Terminal als bewiesen live ausgeben; unsichere Passwort-/Poolingkonzepte nicht als Umsetzungsanleitung duplizieren; dev/main-Releaseweg nennen.
### Guardrails
Keine vorbestehende Nutzerdatei überschreiben und keine neue Betriebsfreigabe behaupten.
### Verifikation
Dokumentationslinks via `--check ./pegger`, Befehle über lokale Suiten; echte Remoteevidenz bleibt offen.

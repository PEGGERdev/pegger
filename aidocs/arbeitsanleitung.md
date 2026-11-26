# Arbeitsanleitung: Pegger vor AgentenWerk

1. [Projektkarte](README.md), [aktuellen Schnitt](project_status.md), vorhandenen Root-Tracker und betroffene Ordnerregeln lesen. Vorgefundene Änderungen erhalten.
2. Im öffentlichen Hub zuerst echte Projekt-/Kontaktaktionen nachweisen. Ein Auswahlzustand allein ist keine Navigation. 900px-CSS-/JS-Grenze sowie Touchscrollen prüfen.
3. Releasepfad und Proxyrollback mit lokalen Fixtures prüfen; niemals zum Test einen echten Server deployen. Hauptbranch im Workflow ist `main`, Integrationsbranch `dev`.
4. Direkte Nachbarn anhand ihrer eigenen aidocs lesen. Shared Caddy/Netz gehört zum Infrastrukturprojekt, Zahlungsablauf/Auth dem Zahlungsprojekt. Nur belegte, für die Anbindung relevante Fehler dort ändern.
5. Vor Code pro Datei den [Vertrag](VERTRAEGE.md) ergänzen. Nach Code aus `C:/coding/pegger` ausführen: `npm test`, `npm run typecheck`, `npm run build`, `npm run test:deployment`, `npm run test:e2e`. Unter Windows Node/Git gegebenenfalls dem Prozess-PATH hinzufügen; keine Paketinstallation nötig, wenn die vorhandenen Abhängigkeiten passen.
6. UI-Referenzen nur für absichtlich geänderte Zustände nach tatsächlicher Bildkontrolle erneuern, danach erneut vergleichen. Linuxreferenzen nicht mit Windowsbildern überschreiben.
7. Aus `C:/coding`: `node ./aidocs/werkzeuge/sync-arbeitsbaum.mjs --write ./pegger`, `--check-contracts ./pegger <bearbeitete Quelldateien>`, `--check ./pegger`, `--context ./pegger src/components/StarMap.vue`. `AIDOCS_GIT` bei fehlendem Git im PATH setzen.
8. [Anbindungsgrenze](agentenwerk-anbindung.md), tatsächliche Nachweise und offene Betriebsfragen aktualisieren. Kein Push/Deploy oder neues Agentensystem aus einer lokalen Fehlerbehebung ableiten.

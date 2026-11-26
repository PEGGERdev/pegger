# Arbeitsbaum für Pegger Hub

Öffentlicher Vue-Hub mit interaktiver Projektkarte, Actor-Katalog und Entwurf für einen privaten Terminaldienst.

## Einstieg und Geltung

[Unterordner](ORDNER.md) · [Dateien der Projektwurzel](DATEIEN.md) · [Vertiefte Dateiverträge](VERTRAEGE.md)

[README.md](../README.md) · [docs/star-map-design.md](../docs/star-map-design.md) · [docs/dev-terminal-design.md](../docs/dev-terminal-design.md) · [project_status.md](../project_status.md)

Aktuelle Arbeit: [Integrationsstatus](project_status.md), [Arbeitsanleitung](arbeitsanleitung.md) und [AgentenWerk-Grenze](agentenwerk-anbindung.md). Der Root-Tracker und uncommittierte Terminaltexte bleiben als vorgefundene Nutzerarbeit erhalten; neue Status-/Freigabevermerke liegen nur hier in `aidocs`. Dieser Auftrag liefert lokal, ohne Git-Commit/Push oder Veröffentlichung.

Folgefreigabe vom 26.11.2026: Der Nutzer hat die geprüften Korrekturen ausdrücklich zum Commit/Push freigegeben und den Server als offline bezeichnet. Pushziel ist `origin/dev`, keine Main-Promotion und kein Serverzugriff. Die frühere lokale Liefersperre ist für diesen Änderungsschnitt aufgehoben. Bestehende fachliche Nutzeränderungen bleiben ausgeschlossen; der notwendige aidocs-Baum wird als Dokumentationsabhängigkeit mitgeliefert.

Lies für jede Änderung die lokalen Regeln am betroffenen Pfad und den passenden Dateieintrag. Prüfe direkte Verbraucher im Code. Bei einem Konflikt sind die tatsächliche Aufgabe, der lokale Vertrag und das belegte Verhalten massgeblich. [Gemeinsamer Arbeitsablauf](../../aidocs/arbeitsablauf.md) · [Zuständigkeiten](../../aidocs/architektur.md)

## Projektanforderungen und Guardrails

- Projektinhalte und Links liegen im Karten-Datenmodell. Darstellung, Routing und UI-Zustand nutzen den gemeinsamen Graphen.
- Neue Kartenfunktionen im passenden Actor-, Workflow- oder Projektor-Katalog deklarieren. Gemeinsam genutzte Inhalte an einer Stelle halten.
- Arbeite bei Terminalthemen nach der projektspezifischen Sicherheitsarchitektur und dem tatsächlichen Umsetzungsstand. Terminal und öffentliche Site haben eigene Zugangs- und Betriebsgrenzen.

## Verifikation

Vorhandene Playwright-Wege in `tests/e2e` und Build für die öffentliche Oberfläche nutzen. Terminal-Sicherheitsnachweise anhand des jeweiligen beauftragten Umsetzungsstands dokumentieren.

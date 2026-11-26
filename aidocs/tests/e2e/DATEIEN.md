# Dateien in tests/e2e

Die [Ordnerregeln](README.md) gelten für alle direkten Dateien. Die Einträge werden aus dem Quellbaum aktualisiert. Individuelle fachliche Regeln stehen im verlinkten Dateivertrag.

| Datei | Verantwortung | Guardrail und Prüfung |
|---|---|---|
| [hub.e2e.spec.js](../../../tests/e2e/hub.e2e.spec.js) | Prüft den bezeichneten Einstieg oder Vertrag. Deklarationen `openHub`, `capture`, `zoomToAllBrightStars`, `boxesOverlap`. | Prüfe beobachtbares Verhalten mit kontrollierten Eingaben. Bewahre Erfolgs- und Fehlerfälle. |
| [navigation.e2e.spec.js](../../../tests/e2e/navigation.e2e.spec.js) | Belegt funktionale Hubnavigation und responsive Details über den normalen Browsereinstieg. Deklarationen `selectNode`. | [Anforderungen und Nachweis](../../VERTRAEGE.md#testse2enavigatione2especjs). |
| [star-rating.e2e.spec.js](../../../tests/e2e/star-rating.e2e.spec.js) | Prüft den bezeichneten Einstieg oder Vertrag. | Prüfe beobachtbares Verhalten mit kontrollierten Eingaben. Bewahre Erfolgs- und Fehlerfälle. |

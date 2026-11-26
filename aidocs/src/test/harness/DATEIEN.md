# Dateien in src/test/harness

Die [Ordnerregeln](README.md) gelten für alle direkten Dateien. Die Einträge werden aus dem Quellbaum aktualisiert. Individuelle fachliche Regeln stehen im verlinkten Dateivertrag.

| Datei | Verantwortung | Guardrail und Prüfung |
|---|---|---|
| [index.js](../../../../src/test/harness/index.js) | Prüft den bezeichneten Einstieg oder Vertrag. Deklarationen `createContext`, `TestHarness`, `runTests`. | Prüfe beobachtbares Verhalten mit kontrollierten Eingaben. Bewahre Erfolgs- und Fehlerfälle. |

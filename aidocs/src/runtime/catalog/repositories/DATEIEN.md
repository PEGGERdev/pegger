# Dateien in src/runtime/catalog/repositories

Die [Ordnerregeln](README.md) gelten für alle direkten Dateien. Die Einträge werden aus dem Quellbaum aktualisiert. Individuelle fachliche Regeln stehen im verlinkten Dateivertrag.

| Datei | Verantwortung | Guardrail und Prüfung |
|---|---|---|
| [contentRepository.js](../../../../../src/runtime/catalog/repositories/contentRepository.js) | Kapselt den bezeichneten Datenzugriff. Deklarationen `getSource`, `getRecord`, `listSourceKeys`. | Abfragen, Schreibresultate und Altdaten prüfen. Die fachliche Reihenfolge bleibt beim Aufrufer. |

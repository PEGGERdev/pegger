# Dateien in src/runtime

Die [Ordnerregeln](README.md) gelten für alle direkten Dateien. Die Einträge werden aus dem Quellbaum aktualisiert. Individuelle fachliche Regeln stehen im verlinkten Dateivertrag.

| Datei | Verantwortung | Guardrail und Prüfung |
|---|---|---|
| [index.js](../../../src/runtime/index.js) | Baut die bezeichnete Laufzeit oder den Einstieg auf. Deklarationen `PeggerRegistry`, `createRegistry`, `bootstrapRegistry`, `createPeggerRuntime`. | Abhängigkeiten, Startreihenfolge und Fehlergrenzen explizit halten. Den wirklichen Einstieg prüfen. |

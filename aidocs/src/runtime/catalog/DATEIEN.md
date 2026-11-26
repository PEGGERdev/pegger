# Dateien in src/runtime/catalog

Die [Ordnerregeln](README.md) gelten für alle direkten Dateien. Die Einträge werden aus dem Quellbaum aktualisiert. Individuelle fachliche Regeln stehen im verlinkten Dateivertrag.

| Datei | Verantwortung | Guardrail und Prüfung |
|---|---|---|
| [actors.js](../../../../src/runtime/catalog/actors.js) | Baut die bezeichnete Laufzeit oder den Einstieg auf. Deklarationen `getInputValue`. | Abhängigkeiten, Startreihenfolge und Fehlergrenzen explizit halten. Den wirklichen Einstieg prüfen. |
| [nodeActions.js](../../../../src/runtime/catalog/nodeActions.js) | Projiziert genau eine sichere Navigationsaktion aus einem Kartenknoten, ohne I/O. Deklarationen `projectNodeAction`. | [Anforderungen und Nachweis](../../../VERTRAEGE.md#srcruntimecatalognodeactionsjs). |
| [policies.js](../../../../src/runtime/catalog/policies.js) | Beantwortet die den Kartenablauf betreffenden Regeln. | [Anforderungen und Nachweis](../../../VERTRAEGE.md#srcruntimecatalogpoliciesjs). |
| [projectors.js](../../../../src/runtime/catalog/projectors.js) | Formt Karten-/Panel-/Themequellen und sichere Knotenaktionen in gemeinsame Viewmodelle. | [Anforderungen und Nachweis](../../../VERTRAEGE.md#srcruntimecatalogprojectorsjs). |
| [workflows.js](../../../../src/runtime/catalog/workflows.js) | Deklariert die Karten-Workflows. | [Anforderungen und Nachweis](../../../VERTRAEGE.md#srcruntimecatalogworkflowsjs). |

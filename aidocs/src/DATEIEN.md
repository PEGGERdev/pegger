# Dateien in src

Die [Ordnerregeln](README.md) gelten für alle direkten Dateien. Die Einträge werden aus dem Quellbaum aktualisiert. Individuelle fachliche Regeln stehen im verlinkten Dateivertrag.

| Datei | Verantwortung | Guardrail und Prüfung |
|---|---|---|
| [App.vue](../../src/App.vue) | Rendert oder bindet den bezeichneten UI-Teil und seine Eingaben. Deklarationen `handleFocusChange`. | Aussehen, Eingaben und Rückmeldung am wirklichen Screen prüfen. Gemeinsame Regeln bleiben beim zuständigen Ablauf. |
| [main.js](../../src/main.js) | Baut die bezeichnete Laufzeit oder den Einstieg auf. | Abhängigkeiten, Startreihenfolge und Fehlergrenzen explizit halten. Den wirklichen Einstieg prüfen. |
| [style.css](../../src/style.css) | Trägt den bezeichneten Teil zum Vertrag des Ordners bei. | Prüfe Eingaben, direkte Verbraucher und beobachtbares Ergebnis am dokumentierten Einstieg. |

# Dateien in der Projektwurzel

Die [Ordnerregeln](README.md) gelten für alle direkten Dateien. Die Einträge werden aus dem Quellbaum aktualisiert. Individuelle fachliche Regeln stehen im verlinkten Dateivertrag.

| Datei | Verantwortung | Guardrail und Prüfung |
|---|---|---|
| [.dockerignore](../.dockerignore) | Legt den bezeichneten Build-, Start-, Test- oder Betriebsweg fest. | Prüfe Zielumgebung, Ausgabe, Fehlerverhalten und Seiteneffekte. Produktive Geheimnisse kommen aus dem Betriebsweg. |
| [.gitattributes](../.gitattributes) | Trägt den bezeichneten Teil zum Vertrag des Ordners bei. | Prüfe Eingaben, direkte Verbraucher und beobachtbares Ergebnis am dokumentierten Einstieg. |
| [.gitignore](../.gitignore) | Trägt den bezeichneten Teil zum Vertrag des Ordners bei. | Prüfe Eingaben, direkte Verbraucher und beobachtbares Ergebnis am dokumentierten Einstieg. |
| [AGENTS.md](../AGENTS.md) | Führt zu lokaler Projektkarte, Arbeitsanleitung und gemeinsamen Regeln. | [Anforderungen und Nachweis](VERTRAEGE.md#agentsmd). |
| [README.md](../README.md) | Hält Hubstart und Architektur mit korrekter Abgrenzung zum noch nicht implementierten privaten Dienst fest. | [Anforderungen und Nachweis](VERTRAEGE.md#readmemd). |
| [TODO.md](../TODO.md) | Hält den bezeichneten fachlichen Kontext, Prozess oder Nachweis fest. | Verweise, Geltungsbereich und behaupteten Stand an den zuständigen Quellen prüfen. |
| [index.html](../index.html) | Baut die bezeichnete Laufzeit oder den Einstieg auf. | Abhängigkeiten, Startreihenfolge und Fehlergrenzen explizit halten. Den wirklichen Einstieg prüfen. |
| [package-lock.json](../package-lock.json) | Legt Editor-, Paket-, Projekt- oder Build-Konfiguration fest. | Konfiguration mit dem konsumierenden Werkzeug und seiner vorgesehenen Umgebung prüfen. |
| [package.json](../package.json) | Bindet wiederholbare Runtime-, Navigations-, Release- und Deploymentprüfungen in vorhandene Scripts ein. | [Anforderungen und Nachweis](VERTRAEGE.md#packagejson). |
| [playwright.config.js](../playwright.config.js) | Trägt den bezeichneten Teil zum Vertrag des Ordners bei. | Prüfe Eingaben, direkte Verbraucher und beobachtbares Ergebnis am dokumentierten Einstieg. |
| [project_status.md](../project_status.md) | Hält den bezeichneten fachlichen Kontext, Prozess oder Nachweis fest. | Verweise, Geltungsbereich und behaupteten Stand an den zuständigen Quellen prüfen. |
| [tsconfig.json](../tsconfig.json) | Trägt den bezeichneten Teil zum Vertrag des Ordners bei. | Prüfe Eingaben, direkte Verbraucher und beobachtbares Ergebnis am dokumentierten Einstieg. |
| [tsconfig.node.json](../tsconfig.node.json) | Trägt den bezeichneten Teil zum Vertrag des Ordners bei. | Prüfe Eingaben, direkte Verbraucher und beobachtbares Ergebnis am dokumentierten Einstieg. |
| [vite.config.js](../vite.config.js) | Legt Editor-, Paket-, Projekt- oder Build-Konfiguration fest. | Konfiguration mit dem konsumierenden Werkzeug und seiner vorgesehenen Umgebung prüfen. |

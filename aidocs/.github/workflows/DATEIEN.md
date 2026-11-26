# Dateien in .github/workflows

Die [Ordnerregeln](README.md) gelten für alle direkten Dateien. Die Einträge werden aus dem Quellbaum aktualisiert. Individuelle fachliche Regeln stehen im verlinkten Dateivertrag.

| Datei | Verantwortung | Guardrail und Prüfung |
|---|---|---|
| [deploy.yml](../../../.github/workflows/deploy.yml) | Prüft dev/main und veröffentlicht nur einen verifizierten aktuellen main-Stand mit gepinntem SSH-Host. | [Anforderungen und Nachweis](../../VERTRAEGE.md#githubworkflowsdeployyml). |

# Dateien in deployment

Die [Ordnerregeln](README.md) gelten für alle direkten Dateien. Die Einträge werden aus dem Quellbaum aktualisiert. Individuelle fachliche Regeln stehen im verlinkten Dateivertrag.

| Datei | Verantwortung | Guardrail und Prüfung |
|---|---|---|
| [Dockerfile](../../deployment/Dockerfile) | Legt den bezeichneten Build-, Start-, Test- oder Betriebsweg fest. | Prüfe Zielumgebung, Ausgabe, Fehlerverhalten und Seiteneffekte. Produktive Geheimnisse kommen aus dem Betriebsweg. |
| [docker-compose.yml](../../deployment/docker-compose.yml) | Legt den bezeichneten Build-, Start-, Test- oder Betriebsweg fest. | Prüfe Zielumgebung, Ausgabe, Fehlerverhalten und Seiteneffekte. Produktive Geheimnisse kommen aus dem Betriebsweg. |
| [nginx.conf](../../deployment/nginx.conf) | Legt den bezeichneten Build-, Start-, Test- oder Betriebsweg fest. | Prüfe Zielumgebung, Ausgabe, Fehlerverhalten und Seiteneffekte. Produktive Geheimnisse kommen aus dem Betriebsweg. |

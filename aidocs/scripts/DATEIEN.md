# Dateien in scripts

Die [Ordnerregeln](README.md) gelten für alle direkten Dateien. Die Einträge werden aus dem Quellbaum aktualisiert. Individuelle fachliche Regeln stehen im verlinkten Dateivertrag.

| Datei | Verantwortung | Guardrail und Prüfung |
|---|---|---|
| [deploy-production.sh](../../scripts/deploy-production.sh) | Veröffentlicht einen expliziten Hubstand mit rücknehmbarem Proxyzustand bis zum letzten Prüfgate. | [Anforderungen und Nachweis](../VERTRAEGE.md#scriptsdeploy-productionsh). |
| [pin-host-key.sh](../../scripts/pin-host-key.sh) | Erzeugt ein Knownhostsfile ausschliesslich aus vollständig zum erwarteten Fingerprint passenden Ed25519-Schlüsseln. | [Anforderungen und Nachweis](../VERTRAEGE.md#scriptspin-host-keysh). |
| [run-tests.js](../../scripts/run-tests.js) | Prüft den bezeichneten Einstieg oder Vertrag. | Prüfe beobachtbares Verhalten mit kontrollierten Eingaben. Bewahre Erfolgs- und Fehlerfälle. |
| [test-caddy-site-labels.sh](../../scripts/test-caddy-site-labels.sh) | Prüft den bezeichneten Einstieg oder Vertrag. | Prüfe beobachtbares Verhalten mit kontrollierten Eingaben. Bewahre Erfolgs- und Fehlerfälle. |
| [test-deployment-rollback.sh](../../scripts/test-deployment-rollback.sh) | Prüft Backuplebensdauer und Caddy-Wiederherstellung mit echten Tempdateien und Stub-Docker. | [Anforderungen und Nachweis](../VERTRAEGE.md#scriptstest-deployment-rollbacksh). |
| [test-pinned-host-keys.sh](../../scripts/test-pinned-host-keys.sh) | Belegt die Hostkey-Ablehnung ohne echten SSH-Server. | [Anforderungen und Nachweis](../VERTRAEGE.md#scriptstest-pinned-host-keyssh). |

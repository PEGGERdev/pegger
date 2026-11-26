# Zuständigkeit von tests/e2e/hub.e2e.spec.js-snapshots

[Quellordner](../../../../tests/e2e/hub.e2e.spec.js-snapshots/) · [Direkte Dateien](DATEIEN.md) · [Unterordner](ORDNER.md)

## Aufgabe

Prüft den bezeichneten Einstieg oder Vertrag. Die genauen Rollen stehen bei den einzelnen Dateien.

## Anforderungen und Guardrails

Prüfe beobachtbares Verhalten mit kontrollierten Eingaben. Bewahre Erfolgs- und Fehlerfälle. Ergänzend gelten die Regeln des [übergeordneten Bereichs](../README.md).

Die drei mobilen Auswahlreferenzen für Portfolio, Kontakt und Dev zeigen nach PREP-01 echte Details mit schliessbarem Bereich und Projekt-/Mailaktion. Ihre zusätzliche Seitenhöhe ist beabsichtigt; unveränderte Grundansichten und Desktopbilder nicht erneuern. Referenzen sind von Playwright erzeugte Prüfdaten, keine handgeschriebenen Bilder. Windows- und Linuxnamen binden den tatsächlichen Renderer; niemals Windowsbilder nach Linux umbenennen.

## Verifikation

Wähle den konkreten Einstieg und die Prüfung aus dem Dateieintrag und dem übergeordneten Projektvertrag. Prüfe den normalen Erfolg und betroffene Ablehnungs- oder Fehlerfälle.

Aus `C:/coding/pegger`: `npm run test:e2e`. Vor gezielter Aktualisierung Referenz, tatsächliches Bild und Differenz visuell gegen das Soll prüfen. Linux-Auswahlreferenzen benötigen nach der absichtlichen UI-Änderung einen eigenen Linuxlauf; fehlende aktuelle Linuxevidenz bleibt ein Releaseblocker.

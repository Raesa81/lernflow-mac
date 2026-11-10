# Lernflow-Synchronisierung einrichten

Die Synchronisierung verwendet Firebase Authentication und Cloud Firestore. In Lernflow meldet sich der Eigentümer mit Benutzername und Passwort an. Lerneinheiten und Fächer werden synchronisiert. Lernziele, Aufgaben und andere Einstellungen werden weiterhin je Browser verwaltet.

1. In der [Firebase-Konsole](https://console.firebase.google.com/) ein Projekt erstellen, eine Web-App hinzufügen und deren öffentliche Web-Konfiguration für `config` in `sync.mjs` kopieren. Keine Dienstkontoschlüssel oder Passwörter ins Repository legen.
2. Unter **Authentication → Sign-in method** die Anmeldung mit **E-Mail/Passwort** aktivieren. Unter **Users → Add user** den Eigentümer anlegen, etwa mit `reza@lernflow.example` und einem privat gewählten Passwort. In Lernflow ist der Benutzername dann `reza`. Die technische Adresse muss nicht als Postfach existieren. Passwortänderungen erfolgen für dieses Konto über die Projektverwaltung.
3. Die UID des angelegten Benutzers in `sync.mjs` als `ownerUid` eintragen. In Cloud Firestore die Standarddatenbank im Produktionsmodus erstellen. Unter **Rules** den Inhalt aus `firestore.rules` einfügen, `REPLACE_WITH_OWNER_UID` durch dieselbe UID ersetzen und die Regeln veröffentlichen. Nur dieser Eigentümer darf auf die Datensätze zugreifen.
4. Die konfigurierte Version auf der bestehenden Lernflow-Adresse bereitstellen. Auf dem bisherigen Gerät unter **Einstellungen → Geräte synchronisieren** anmelden und **Lerneinheiten von diesem Gerät übernehmen** auswählen. Die Übernahme fügt bislang fehlende Einträge hinzu. Bereits synchronisierte oder gelöschte Datensätze werden bei einem erneuten Versuch nicht überschrieben.
5. Auf einem zweiten Gerät dieselbe Adresse öffnen und sich mit denselben Lernflow-Zugangsdaten anmelden. Eine Testeinheit anlegen und prüfen, ob sie auf beiden Geräten angezeigt wird.

[Firebase-Anmeldung mit Passwort](https://firebase.google.com/docs/auth/web/password-auth) · [Cloud Firestore einrichten](https://firebase.google.com/docs/firestore/quickstart)

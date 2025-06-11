= Technisches Konzept

Für den ersten Prototypen erstellen wir zunächst ein interaktives Modell in Figma, um ein klares Bild davon zu gewinnen, wie die Anwendung auf Web, Android und iOS ungefähr aussehen und funktionieren soll.

Die anschließende Implementierung erfolgt in Visual Studio Code, wobei die Anwendung vollständig in JavaScript geschrieben und mit Expo React Native als Entwicklungsframework umgesetzt wird. Expo React Native kombiniert die Vorteile des React-Ökosystems mit nativen Modulen für mobile Geräte und ermöglicht die simultane Auslieferung derselben Codebasis für iOS, Android und Web. Durch den integrierten Expo-CLI-Workflow entfallen aufwändige native Konfigurationen, und es gibt Echtzeit-Hot-Reloading, eine umfassende Bibliothek gebrauchsfertiger Komponenten und einfachen Zugriff auf Geräte-APIs wie Kamera, Push-Benachrichtigungen und Dateisystem.

Zur Bereitstellung fachlicher Inhalte wird zudem eine externe API einer Medikamentendatenbank integriert. Über diese REST-Schnittstelle lassen sich umfangreiche Wirkstoffinformationen, Packungskennzeichnungen und Wechselwirkungsdaten abrufen, die in der App unmittelbar angezeigt werden.
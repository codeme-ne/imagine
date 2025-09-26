import type { Metadata } from 'next';

// TODO: Future i18n integration
// When implementing internationalization, uncomment and use:
// import { useTranslations } from 'next-intl';
// import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung - URL → Image',
  description: 'Informationen zum Datenschutz und zur Verarbeitung personenbezogener Daten gemäß DSGVO',
  keywords: 'Datenschutz, DSGVO, GDPR, Cookies, Datenverarbeitung, Privatsphäre, KI-Bildgenerierung',
  robots: 'index, follow',
  openGraph: {
    title: 'Datenschutzerklärung - URL → Image',
    description: 'Erfahren Sie, wie wir Ihre personenbezogenen Daten schützen und verarbeiten.',
    type: 'website',
    locale: 'de_DE',
    url: 'https://pagetopic.org/datenschutz',
  },
  alternates: {
    canonical: 'https://pagetopic.org/datenschutz',
  },
};

export default function DatenschutzPage() {
  // TODO: Future i18n - initialize translations
  // const t = useTranslations('datenschutz');
  return (
    <main>
      <h1>Datenschutzerklärung</h1>
      <p className="text-sm text-muted-foreground mb-6">Stand: Dezember 2024</p>

      <section aria-labelledby="einleitung">
        <h2 id="einleitung">1. Einleitung und Überblick</h2>
        <p>
          Wir freuen uns über Ihr Interesse an unserer Website <strong>URL → Image</strong> (nachfolgend &bdquo;Website&ldquo; oder &bdquo;Service&ldquo;). 
          Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen. In dieser Datenschutzerklärung informieren 
          wir Sie ausführlich über die Verarbeitung personenbezogener Daten bei der Nutzung unserer Website und unseres 
          KI-basierten Bildgenerierungsservices.
        </p>
        <p>
          Diese Datenschutzerklärung gilt für alle Nutzer unserer Website und unseres Services, unabhängig davon, 
          von welchem Gerät oder über welchen Zugang sie diese nutzen.
        </p>
      </section>

      <section aria-labelledby="verantwortlicher">
        <h2 id="verantwortlicher">2. Verantwortlicher</h2>
        <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
        <address className="not-italic">
          <p>
            <strong>Lukas Zangerl</strong><br />
            Stapper Weg 214<br />
            41199 Mönchengladbach<br />
            Deutschland<br />
            E-Mail: <a href="mailto:lukas@zangerlcoachingdynamics.com">lukas@zangerlcoachingdynamics.com</a><br />
            Telefon: <a href="tel:+4915126718443">+49 151 26718443</a>
          </p>
        </address>
        
        <h3>2.1 Datenschutzbeauftragter</h3>
        <p>
          Wir sind gesetzlich nicht verpflichtet, einen Datenschutzbeauftragten zu bestellen. 
          Bei Fragen zum Datenschutz wenden Sie sich bitte direkt an den oben genannten Verantwortlichen.
        </p>
      </section>

      <section aria-labelledby="rechtsgrundlagen">
        <h2 id="rechtsgrundlagen">3. Rechtsgrundlagen der Datenverarbeitung</h2>
        <p>Wir verarbeiten personenbezogene Daten nur auf Grundlage einer gesetzlichen Erlaubnis. Die Rechtsgrundlagen ergeben sich insbesondere aus der DSGVO:</p>
        <ul>
          <li><strong>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):</strong> wenn Sie uns eine ausdrückliche Einwilligung zur Verarbeitung erteilt haben</li>
          <li><strong>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung):</strong> zur Erfüllung eines Vertrags mit Ihnen oder zur Durchführung vorvertraglicher Maßnahmen</li>
          <li><strong>Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung):</strong> zur Erfüllung einer rechtlichen Verpflichtung</li>
          <li><strong>Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen):</strong> zur Wahrung unserer berechtigten Interessen, sofern nicht Ihre Interessen überwiegen</li>
        </ul>
      </section>

      <section aria-labelledby="datenerfassung">
        <h2 id="datenerfassung">4. Automatische Datenerfassung</h2>
        
        <h3>4.1 Server-Log-Dateien</h3>
        <p>
          Bei jedem Zugriff auf unsere Website erfasst unser System automatisch Daten und Informationen vom 
          Computersystem des aufrufenden Rechners. Folgende Daten werden hierbei erhoben:
        </p>
        <ul>
          <li>IP-Adresse des anfragenden Rechners</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>Name und URL der abgerufenen Datei</li>
          <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
          <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners</li>
          <li>Name Ihres Access-Providers</li>
        </ul>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen)<br />
          <strong>Zweck:</strong> Gewährleistung eines reibungslosen Verbindungsaufbaus, komfortable Nutzung unserer Website, Auswertung der Systemsicherheit und -stabilität<br />
          <strong>Speicherdauer:</strong> Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht mehr erforderlich sind, in der Regel nach 7 Tagen.
        </p>

        <h3>4.2 Cookies und ähnliche Technologien</h3>
        <p>
          Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. 
          Wir unterscheiden zwischen technisch notwendigen Cookies und optionalen Cookies.
        </p>
        
        <h4>Technisch notwendige Cookies:</h4>
        <ul>
          <li><strong>Session-Cookies:</strong> Zur Verwaltung Ihrer Anmeldesitzung (NextAuth)</li>
          <li><strong>Sicherheits-Cookies:</strong> Zur Gewährleistung der Sicherheit (CSRF-Token)</li>
        </ul>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen)<br />
          <strong>Speicherdauer:</strong> Session-Cookies werden nach Ende der Browser-Sitzung gelöscht
        </p>

        <h4>Optionale Cookies (nur mit Ihrer Einwilligung):</h4>
        <ul>
          <li><strong>Präferenz-Cookies:</strong> Zur Speicherung Ihrer Einstellungen</li>
          <li><strong>Analyse-Cookies:</strong> Zur Verbesserung unseres Services (sofern implementiert)</li>
        </ul>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)<br />
          <strong>Widerruf:</strong> Sie können Ihre Einwilligung jederzeit über die Cookie-Einstellungen widerrufen
        </p>

        <h3>4.3 Cookie-Verwaltung</h3>
        <p>
          Sie haben die volle Kontrolle über die Verwendung von Cookies auf unserer Website. Bei Ihrem ersten Besuch 
          wird Ihnen ein Cookie-Banner angezeigt, über das Sie Ihre Einstellungen vornehmen können.
        </p>
        <p>
          <strong>Cookie-Einstellungen ändern:</strong> Sie können Ihre Cookie-Präferenzen jederzeit ändern, indem Sie:
        </p>
        <ul>
          <li>Das Cookie-Banner erneut aufrufen (Link am Seitenende)</li>
          <li>Die Cookie-Einstellungen in Ihrem Browser anpassen</li>
          <li>Alle Cookies in Ihrem Browser löschen</li>
        </ul>
        <p>
          <strong>Browser-Einstellungen:</strong> Die meisten Webbrowser akzeptieren Cookies automatisch. Sie können 
          Ihren Browser so einstellen, dass er Cookies ablehnt oder Sie benachrichtigt, wenn Cookies gesendet werden. 
          Bitte beachten Sie, dass einige Funktionen unserer Website möglicherweise nicht ordnungsgemäß funktionieren, 
          wenn Sie Cookies deaktivieren.
        </p>
      </section>

      <section aria-labelledby="servicenutzung">
        <h2 id="servicenutzung">5. Datenverarbeitung bei der Servicenutzung</h2>

        <h3>5.1 Registrierung und Authentifizierung</h3>
        <p>
          Für die Nutzung unseres Services ist eine Registrierung erforderlich. Wir verwenden eine passwortlose 
          E-Mail-Authentifizierung über NextAuth und Resend.
        </p>
        <p>
          <strong>Verarbeitete Daten:</strong>
        </p>
        <ul>
          <li>E-Mail-Adresse</li>
          <li>Zeitpunkt der Registrierung</li>
          <li>Zeitpunkt der letzten Anmeldung</li>
          <li>Session-Informationen</li>
        </ul>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)<br />
          <strong>Speicherdauer:</strong> Bis zur Löschung Ihres Accounts
        </p>

        <h3>5.2 KI-basierte Bildgenerierung</h3>
        <p>
          Unser Service ermöglicht die Transformation von Websites in KI-generierte Bilder. 
          Dabei werden folgende Datenverarbeitungen durchgeführt:
        </p>

        <h4>a) Website-Extraktion (Firecrawl)</h4>
        <p>
          <strong>Verarbeitete Daten:</strong>
        </p>
        <ul>
          <li>Eingegebene URLs</li>
          <li>Extrahierte Website-Inhalte (als Markdown)</li>
          <li>Zeitpunkt der Extraktion</li>
        </ul>
        <p>
          <strong>Datenübermittlung:</strong> Die URLs werden an Firecrawl (USA) übermittelt. Firecrawl ist ein Drittanbieter 
          für Web-Scraping-Services.<br />
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)<br />
          <strong>Drittlandübermittlung:</strong> USA - Angemessenheitsbeschluss liegt nicht vor. Übermittlung erfolgt auf 
          Basis von Standardvertragsklauseln gem. Art. 46 DSGVO.
        </p>

        <h4>b) Prompt-Generierung (Google Gemini)</h4>
        <p>
          <strong>Verarbeitete Daten:</strong>
        </p>
        <ul>
          <li>Extrahierte Website-Inhalte</li>
          <li>Gewählter Bildstil</li>
          <li>Generierte Prompts</li>
        </ul>
        <p>
          <strong>Datenübermittlung:</strong> Die Daten werden an Google Cloud (Google Ireland Limited) übermittelt.<br />
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)<br />
          <strong>Auftragsverarbeitung:</strong> Google Cloud agiert als Auftragsverarbeiter gemäß Art. 28 DSGVO
        </p>

        <h4>c) Bildgenerierung (Google Imagen via Fal.ai)</h4>
        <p>
          <strong>Verarbeitete Daten:</strong>
        </p>
        <ul>
          <li>Generierte Prompts</li>
          <li>Bildstil-Parameter</li>
          <li>Generierte Bilder</li>
        </ul>
        <p>
          <strong>Datenübermittlung:</strong> Die Prompts werden an Fal.ai (USA) übermittelt, welches Google Imagen nutzt.<br />
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)<br />
          <strong>Drittlandübermittlung:</strong> USA - Übermittlung erfolgt auf Basis von Standardvertragsklauseln gem. Art. 46 DSGVO.
        </p>

        <h3>5.3 Speicherung und Löschung der generierten Inhalte</h3>
        <p>
          <strong>Temporäre Speicherung:</strong> Generierte Prompts werden temporär in der Browser-Session gespeichert.<br />
          <strong>Bilder:</strong> Generierte Bilder werden nicht auf unseren Servern gespeichert, sondern direkt an Sie ausgeliefert.<br />
          <strong>Löschung:</strong> Session-Daten werden beim Schließen des Browsers oder nach 24 Stunden Inaktivität gelöscht.
        </p>
      </section>

      <section aria-labelledby="drittanbieter">
        <h2 id="drittanbieter">6. Eingebundene Drittanbieter und Services</h2>

        <h3>6.1 Hosting (Vercel)</h3>
        <p>
          Unsere Website wird bei Vercel Inc. gehostet.<br />
          <strong>Anbieter:</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
          <strong>Datenschutzerklärung:</strong> <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">https://vercel.com/legal/privacy-policy</a><br />
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen)<br />
          <strong>Drittlandübermittlung:</strong> USA - Vercel ist unter dem EU-US Data Privacy Framework zertifiziert
        </p>

        <h3>6.2 E-Mail-Versand (Resend)</h3>
        <p>
          Für den Versand von Authentifizierungs-E-Mails nutzen wir Resend.<br />
          <strong>Anbieter:</strong> Resend, Inc.<br />
          <strong>Verarbeitete Daten:</strong> E-Mail-Adresse, Zeitpunkt des Versands<br />
          <strong>Datenschutzerklärung:</strong> <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">https://resend.com/legal/privacy-policy</a><br />
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
        </p>

        <h3>6.3 Rate Limiting (Upstash Redis)</h3>
        <p>
          Zur Vermeidung von Missbrauch nutzen wir Upstash Redis für Rate Limiting.<br />
          <strong>Anbieter:</strong> Upstash, Inc.<br />
          <strong>Verarbeitete Daten:</strong> IP-Adresse (gehasht), API-Endpunkt, Zeitstempel<br />
          <strong>Datenschutzerklärung:</strong> <a href="https://upstash.com/privacy" target="_blank" rel="noopener noreferrer">https://upstash.com/privacy</a><br />
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen)<br />
          <strong>Speicherdauer:</strong> 24 Stunden
        </p>
      </section>

      <section aria-labelledby="rechte">
        <h2 id="rechte">7. Ihre Rechte als betroffene Person</h2>
        <p>Nach der DSGVO stehen Ihnen folgende Rechte zu:</p>

        <h3>7.1 Auskunftsrecht (Art. 15 DSGVO)</h3>
        <p>
          Sie haben das Recht, Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen. 
          Hierzu gehören insbesondere Informationen über Verarbeitungszwecke, Kategorien personenbezogener Daten, 
          Empfänger oder Kategorien von Empfängern, geplante Speicherdauer, Herkunft der Daten.
        </p>

        <h3>7.2 Recht auf Berichtigung (Art. 16 DSGVO)</h3>
        <p>
          Sie haben das Recht, unverzüglich die Berichtigung Sie betreffender unrichtiger personenbezogener Daten 
          zu verlangen. Ferner steht Ihnen das Recht zu, die Vervollständigung unvollständiger personenbezogener 
          Daten zu verlangen.
        </p>

        <h3>7.3 Recht auf Löschung (Art. 17 DSGVO)</h3>
        <p>
          Sie haben das Recht, die unverzügliche Löschung Sie betreffender personenbezogener Daten zu verlangen, 
          sofern einer der gesetzlich vorgesehenen Gründe zutrifft und soweit die Verarbeitung nicht erforderlich ist.
        </p>

        <h3>7.4 Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</h3>
        <p>
          Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen, 
          wenn eine der gesetzlichen Voraussetzungen gegeben ist.
        </p>

        <h3>7.5 Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</h3>
        <p>
          Sie haben das Recht, die Sie betreffenden personenbezogenen Daten in einem strukturierten, gängigen 
          und maschinenlesbaren Format zu erhalten. Sie haben außerdem das Recht, diese Daten einem anderen 
          Verantwortlichen zu übermitteln.
        </p>

        <h3>7.6 Widerspruchsrecht (Art. 21 DSGVO)</h3>
        <div className="border-l-4 border-primary pl-4 my-4">
          <p className="font-semibold">
            Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen 
            die Verarbeitung Sie betreffender personenbezogener Daten, die aufgrund von Art. 6 Abs. 1 lit. e 
            oder f DSGVO erfolgt, Widerspruch einzulegen.
          </p>
          <p>
            Wir verarbeiten die personenbezogenen Daten dann nicht mehr, es sei denn, wir können zwingende 
            schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten 
            überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.
          </p>
        </div>

        <h3>7.7 Widerruf der Einwilligung</h3>
        <p>
          Soweit die Verarbeitung auf Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a oder Art. 9 Abs. 2 lit. a 
          DSGVO beruht, haben Sie das Recht, die Einwilligung jederzeit zu widerrufen, ohne dass die Rechtmäßigkeit 
          der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung berührt wird.
        </p>

        <h3>7.8 Beschwerderecht bei einer Aufsichtsbehörde</h3>
        <p>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer 
          personenbezogenen Daten durch uns zu beschweren. Die für uns zuständige Aufsichtsbehörde ist:
        </p>
        <address className="not-italic">
          <p>
            <strong>Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen</strong><br />
            Postfach 20 04 44<br />
            40102 Düsseldorf<br />
            Telefon: 0211/38424-0<br />
            E-Mail: poststelle@ldi.nrw.de<br />
            Website: <a href="https://www.ldi.nrw.de" target="_blank" rel="noopener noreferrer">www.ldi.nrw.de</a>
          </p>
        </address>
      </section>

      <section aria-labelledby="datensicherheit">
        <h2 id="datensicherheit">8. Datensicherheit</h2>
        <p>
          Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in 
          Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird. 
          In der Regel handelt es sich dabei um eine 256-Bit-Verschlüsselung.
        </p>
        <p>
          Des Weiteren bedienen wir uns geeigneter technischer und organisatorischer Sicherheitsmaßnahmen, 
          um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust, 
          Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen. Unsere Sicherheitsmaßnahmen werden 
          entsprechend der technologischen Entwicklung fortlaufend verbessert.
        </p>
      </section>

      <section aria-labelledby="kinder">
        <h2 id="kinder">9. Kinder</h2>
        <p>
          Unser Angebot richtet sich grundsätzlich an Personen, die das 16. Lebensjahr vollendet haben. 
          Personen unter 16 Jahren dürfen ohne Zustimmung der Erziehungsberechtigten keine personenbezogenen 
          Daten an uns übermitteln.
        </p>
      </section>

      <section aria-labelledby="aenderungen">
        <h2 id="aenderungen">10. Änderungen der Datenschutzerklärung</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen 
          Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen, 
          z.B. bei der Einführung neuer Services. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
        </p>
      </section>

      <section aria-labelledby="kontakt">
        <h2 id="kontakt">11. Kontakt für Datenschutzanfragen</h2>
        <p>
          Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail oder wenden Sie sich direkt 
          an die für den Datenschutz verantwortliche Person in unserer Organisation:
        </p>
        <address className="not-italic">
          <p>
            E-Mail: <a href="mailto:lukas@zangerlcoachingdynamics.com">lukas@zangerlcoachingdynamics.com</a><br />
            Anschrift: Siehe Abschnitt 2 (Verantwortlicher)
          </p>
        </address>
      </section>
    </main>
  );
}
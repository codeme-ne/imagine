import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AGB - Allgemeine Geschäftsbedingungen | PageTopic',
  description: 'Allgemeine Geschäftsbedingungen für die Nutzung der PageTopic AI-Bildgenerierungs-Plattform für Geschäftskunden',
};

export default function AGBPage() {
  const paragraphClass = 'text-muted-foreground leading-relaxed';
  const listClass = 'list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed';

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Startseite
      </Link>

      <div className="space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Allgemeine Geschäftsbedingungen (AGB)</h1>
          <p className="text-sm text-muted-foreground">Stand: September 2025</p>
        </header>

        <section aria-labelledby="geltungsbereich" className="space-y-4">
          <h2 id="geltungsbereich" className="text-xl font-semibold text-foreground">§ 1 Geltungsbereich und Vertragspartner</h2>
          <p className={paragraphClass}>
            (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend &bdquo;AGB&ldquo;) der PageTopic,
            vertreten durch Lukas Zangerl, Stapper Weg 214, 41199 Mönchengladbach (nachfolgend &bdquo;Anbieter&ldquo;),
            gelten für alle Verträge über die Nutzung der SaaS-Plattform zur KI-gestützten Bildgenerierung,
            die zwischen dem Anbieter und Unternehmern im Sinne des § 14 BGB (nachfolgend &bdquo;Kunde&ldquo;) geschlossen werden.
          </p>
          <p className={paragraphClass}>
            (2) Diese AGB gelten ausschließlich für Geschäftskunden (B2B). Eine Nutzung durch Verbraucher ist nicht vorgesehen.
          </p>
          <p className={paragraphClass}>
            (3) Abweichende, entgegenstehende oder ergänzende Allgemeine Geschäftsbedingungen des Kunden werden nur dann
            und insoweit Vertragsbestandteil, als der Anbieter ihrer Geltung ausdrücklich schriftlich zugestimmt hat.
          </p>
        </section>
        <section aria-labelledby="leistungsbeschreibung" className="space-y-4">
          <h2 id="leistungsbeschreibung" className="text-xl font-semibold text-foreground">§ 2 Leistungsbeschreibung</h2>
          <p className={paragraphClass}>
            (1) Der Anbieter stellt dem Kunden eine webbasierte SaaS-Plattform zur Verfügung, die folgende Kernfunktionen umfasst:
          </p>
          <ul className={listClass}>
            <li>Extraktion von Webseiteninhalten mittels Firecrawl-Technologie</li>
            <li>KI-gestützte Generierung von Bildprompts basierend auf extrahierten Inhalten</li>
            <li>Erstellung von Bildern mittels Google Imagen 4 AI-Technologie</li>
            <li>Auswahl aus verschiedenen vorgefertigten Bildstilen</li>
            <li>Download der generierten Bilder in Standardformaten</li>
          </ul>
          <p className={paragraphClass}>
            (2) Die Plattform wird als Software-as-a-Service (SaaS) bereitgestellt. Der Kunde erhält keinen Zugriff auf den Quellcode der Software.
          </p>
          <p className={paragraphClass}>
            (3) Die Verfügbarkeit der Plattform beträgt im Jahresmittel mindestens 95%. Hiervon ausgenommen sind geplante Wartungsfenster, die dem Kunden mindestens 24 Stunden im Voraus angekündigt werden.
          </p>
        </section>
        <section aria-labelledby="vertragsmodell" className="space-y-4">
          <h2 id="vertragsmodell" className="text-xl font-semibold text-foreground">§ 3 Vertragsmodell und Credits</h2>
          <p className={paragraphClass}>
            (1) Die Nutzung der Plattform erfolgt ausschließlich auf Basis eines <strong>Prepaid-Credit-Systems</strong>. Es handelt sich ausdrücklich nicht um ein Abonnement-Modell.
          </p>
          <p className={paragraphClass}>
            (2) Der Kunde erwirbt Credits im Voraus, die auf seinem Nutzerkonto gutgeschrieben werden. Ein Credit entspricht einer Bildgenerierung.
          </p>
          <p className={paragraphClass}>
            (3) Credits verfallen 12 Monate nach Kaufdatum. Eine automatische Verlängerung oder Aufladung erfolgt nicht.
          </p>
          <p className={paragraphClass}>
            (4) Der Mindesterwerb beträgt 10 Credits. Mengenrabatte werden ab 100 Credits gewährt.
          </p>
          <p className={paragraphClass}>
            (5) Credits sind nicht übertragbar und können nicht in Bargeld umgetauscht werden.
          </p>
        </section>
        <section aria-labelledby="vertragsschluss" className="space-y-4">
          <h2 id="vertragsschluss" className="text-xl font-semibold text-foreground">§ 4 Vertragsschluss und Registrierung</h2>
          <p className={paragraphClass}>
            (1) Der Vertrag kommt durch die vollständige Registrierung des Kunden auf der Plattform und die Bestätigung durch den Anbieter zustande.
          </p>
          <p className={paragraphClass}>
            (2) Bei der Registrierung sind wahrheitsgemäße Angaben zu machen. Der Kunde ist verpflichtet, Änderungen seiner Daten unverzüglich mitzuteilen.
          </p>
          <p className={paragraphClass}>
            (3) Der Kunde ist für die Geheimhaltung seiner Zugangsdaten verantwortlich und haftet für deren Missbrauch.
          </p>
        </section>

        <section aria-labelledby="zahlungsbedingungen" className="space-y-4">
          <h2 id="zahlungsbedingungen" className="text-xl font-semibold text-foreground">§ 5 Preise und Zahlungsbedingungen</h2>
          <p className={paragraphClass}>
            (1) Es gelten die zum Zeitpunkt des Credit-Erwerbs auf der Plattform angegebenen Preise.
          </p>
          <p className={paragraphClass}>
            (2) Alle Preise verstehen sich als Nettopreise zuzüglich der gesetzlichen Umsatzsteuer in Höhe von derzeit 19% (Deutschland) bzw. der im Land des Kunden geltenden Umsatzsteuer.
          </p>
          <p className={paragraphClass}>
            (3) Bei Kunden mit gültiger EU-Umsatzsteuer-Identifikationsnummer erfolgt die Rechnungsstellung unter Anwendung des Reverse-Charge-Verfahrens ohne Umsatzsteuer.
          </p>
          <p className={paragraphClass}>
            (4) Die Zahlung erfolgt per Kreditkarte, PayPal oder Überweisung. Credits werden erst nach Zahlungseingang freigeschaltet.
          </p>
          <p className={paragraphClass}>
            (5) Rechnungen werden elektronisch per E-Mail zugestellt und entsprechen den Anforderungen an elektronische Rechnungen gemäß § 14 UStG.
          </p>
        </section>

        <section aria-labelledby="nutzungsrechte" className="space-y-4">
          <h2 id="nutzungsrechte" className="text-xl font-semibold text-foreground">§ 6 Nutzungsrechte und Geistiges Eigentum</h2>
          <p className={paragraphClass}>
            (1) Der Kunde erhält an den mittels der Plattform generierten Bildern ein einfaches, zeitlich und räumlich unbeschränktes Nutzungsrecht für kommerzielle und nicht-kommerzielle Zwecke.
          </p>
          <p className={paragraphClass}>
            (2) Der Anbieter behält sich das Recht vor, generierte Bilder in anonymisierter Form für die Verbesserung der KI-Modelle zu verwenden, sofern der Kunde dem nicht widerspricht.
          </p>
          <p className={paragraphClass}>
            (3) Der Kunde garantiert, dass er zur Nutzung der eingegebenen Webseiten-URLs berechtigt ist und keine Rechte Dritter verletzt.
          </p>
          <p className={paragraphClass}>
            (4) Die Plattform-Software selbst sowie alle damit verbundenen Rechte verbleiben beim Anbieter.
          </p>
        </section>

        <section aria-labelledby="datenschutz" className="space-y-4">
          <h2 id="datenschutz" className="text-xl font-semibold text-foreground">§ 7 Datenschutz und Datenverarbeitung</h2>
          <p className={paragraphClass}>
            (1) Die Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).
          </p>
          <p className={paragraphClass}>
            (2) Einzelheiten zur Datenverarbeitung sind in der separaten Datenschutzerklärung geregelt, die unter /datenschutz einsehbar ist.
          </p>
          <p className={paragraphClass}>
            (3) Soweit bei der Nutzung der Plattform personenbezogene Daten im Auftrag des Kunden verarbeitet werden, schließen die Parteien eine separate Auftragsverarbeitungsvereinbarung (AVV) ab.
          </p>
          <p className={paragraphClass}>
            (4) Die generierten Bilder und Prompts werden für 30 Tage zur Wiederverwendung gespeichert und danach automatisch gelöscht.
          </p>
        </section>

        <section aria-labelledby="ki-compliance" className="space-y-4">
          <h2 id="ki-compliance" className="text-xl font-semibold text-foreground">§ 8 KI-Compliance und EU AI Act</h2>
          <p className={paragraphClass}>
            (1) Der Anbieter verpflichtet sich zur Einhaltung der Anforderungen des EU AI Act für KI-Systeme.
          </p>
          <p className={paragraphClass}>
            (2) Die verwendeten KI-Modelle werden regelmäßig auf Bias, Diskriminierung und Qualität überprüft.
          </p>
          <p className={paragraphClass}>
            (3) Der Kunde wird darauf hingewiesen, dass KI-generierte Bilder Ungenauigkeiten oder unbeabsichtigte Inhalte enthalten können.
          </p>
          <p className={paragraphClass}>
            (4) Der Kunde ist verpflichtet, generierte Bilder vor der Veröffentlichung auf rechtliche Zulässigkeit zu prüfen.
          </p>
        </section>

        <section aria-labelledby="haftung" className="space-y-4">
          <h2 id="haftung" className="text-xl font-semibold text-foreground">§ 9 Haftung und Haftungsbeschränkung</h2>
          <p className={paragraphClass}>
            (1) Der Anbieter haftet unbeschränkt:
          </p>
          <ul className={listClass}>
            <li>bei Vorsatz und grober Fahrlässigkeit</li>
            <li>für die Verletzung von Leben, Körper oder Gesundheit</li>
            <li>nach den Vorschriften des Produkthaftungsgesetzes</li>
            <li>im Umfang einer übernommenen Garantie</li>
          </ul>
          <p className={paragraphClass}>
            (2) Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist die Haftung auf den vorhersehbaren, vertragstypischen Schaden begrenzt, maximal jedoch auf die Höhe der vom Kunden in den letzten 12 Monaten gezahlten Entgelte.
          </p>
          <p className={paragraphClass}>
            (3) Die Haftung für Datenverlust ist auf den typischen Wiederherstellungsaufwand beschränkt, der bei regelmäßiger Datensicherung eingetreten wäre.
          </p>
          <p className={paragraphClass}>
            (4) Eine weitergehende Haftung ist ausgeschlossen.
          </p>
        </section>

        <section aria-labelledby="laufzeit" className="space-y-4">
          <h2 id="laufzeit" className="text-xl font-semibold text-foreground">§ 10 Laufzeit und Kündigung</h2>
          <p className={paragraphClass}>
            (1) Das Vertragsverhältnis beginnt mit der Registrierung und läuft auf unbestimmte Zeit.
          </p>
          <p className={paragraphClass}>
            (2) Beide Parteien können das Vertragsverhältnis jederzeit ohne Einhaltung einer Kündigungsfrist in Textform (E-Mail genügt) kündigen.
          </p>
          <p className={paragraphClass}>
            (3) Bei Kündigung verfallen nicht genutzte Credits ersatzlos. Eine Rückerstattung ist ausgeschlossen.
          </p>
          <p className={paragraphClass}>
            (4) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
          </p>
          <p className={paragraphClass}>
            (5) Nach Vertragsbeendigung werden alle Kundendaten binnen 30 Tagen gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten bestehen.
          </p>
        </section>

        <section aria-labelledby="aenderungen" className="space-y-4">
          <h2 id="aenderungen" className="text-xl font-semibold text-foreground">§ 11 Änderungen der AGB und der Leistungen</h2>
          <p className={paragraphClass}>
            (1) Der Anbieter behält sich vor, diese AGB anzupassen, soweit dies zur Anpassung an geänderte gesetzliche Vorgaben oder zur Einführung neuer Leistungen erforderlich ist.
          </p>
          <p className={paragraphClass}>
            (2) Änderungen werden dem Kunden mindestens 4 Wochen vor Inkrafttreten in Textform mitgeteilt.
          </p>
          <p className={paragraphClass}>
            (3) Widerspricht der Kunde nicht innerhalb von 4 Wochen nach Zugang der Änderungsmitteilung, gelten die Änderungen als genehmigt. Auf die Widerspruchsmöglichkeit wird in der Mitteilung hingewiesen.
          </p>
        </section>

        <section aria-labelledby="schlussbestimmungen" className="space-y-4">
          <h2 id="schlussbestimmungen" className="text-xl font-semibold text-foreground">§ 12 Schlussbestimmungen</h2>
          <p className={paragraphClass}>
            (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
          </p>
          <p className={paragraphClass}>
            (2) Erfüllungsort und ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist Mönchengladbach, sofern der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.
          </p>
          <p className={paragraphClass}>
            (3) Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
          </p>
          <p className={paragraphClass}>
            (4) Änderungen und Ergänzungen dieser AGB bedürfen der Textform. Dies gilt auch für die Abbedingung dieser Textformklausel.
          </p>
        </section>

      </div>
    </main>
  );
}
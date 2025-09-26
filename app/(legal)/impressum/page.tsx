import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Impressum - URL → Image',
  description: 'Rechtliche Informationen und Pflichtangaben gemäß § 5 TMG',
};

export default function ImpressumPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Impressum</h1>
          <p className="text-sm text-muted-foreground">Stand: September 2025</p>
        </header>

        <section aria-labelledby="anbieterangaben" className="space-y-4">
          <h2 id="anbieterangaben" className="text-xl font-semibold text-foreground">
            Angaben gemäß § 5 TMG
          </h2>
          <address className={`not-italic ${paragraphClass}`}>
            <p className={paragraphClass}>
              Lukas Zangerl<br />
              Stapper Weg 214<br />
              41199 Mönchengladbach<br />
              Deutschland
            </p>
          </address>
        </section>
        <section aria-labelledby="vertretung" className="space-y-3">
          <h2 id="vertretung" className="text-xl font-semibold text-foreground">
            Vertreten durch
          </h2>
          <p className={paragraphClass}>Lukas Zangerl</p>
        </section>

        <section aria-labelledby="kontakt" className="space-y-3">
          <h2 id="kontakt" className="text-xl font-semibold text-foreground">
            Kontakt
          </h2>
          <ul className={listClass}>
            <li>
              Telefon: <a href="tel:+4915126718443" className="underline-offset-4 hover:underline">+49 151 26718443</a>
            </li>
            <li>
              E-Mail: <a href="mailto:lukas@zangerlcoachingdynamics.com" className="underline-offset-4 hover:underline">lukas@zangerlcoachingdynamics.com</a>
            </li>
            <li>
              Website: <a href="https://pagetopic.org" className="underline-offset-4 hover:underline">www.pagetopic.org</a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="verantwortlich" className="space-y-3">
          <h2 id="verantwortlich" className="text-xl font-semibold text-foreground">
            Inhaltlich Verantwortlicher gemäß § 55 Abs. 2 RStV
          </h2>
          <p className={paragraphClass}>
            Lukas Zangerl<br />
            Stapper Weg 214<br />
            41199 Mönchengladbach
          </p>
        </section>

        <section aria-labelledby="streitschlichtung" className="space-y-3">
          <h2 id="streitschlichtung" className="text-xl font-semibold text-foreground">
            EU-Streitschlichtung
          </h2>
          <p className={paragraphClass}>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
          </p>
          <p>
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className={paragraphClass}>
            Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
        </section>

        <section aria-labelledby="verbraucherstreit" className="space-y-3">
          <h2 id="verbraucherstreit" className="text-xl font-semibold text-foreground">
            Verbraucherstreitbeilegung/Universalschlichtungsstelle
          </h2>
          <p className={paragraphClass}>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section aria-labelledby="haftung" className="space-y-5">
          <h2 id="haftung" className="text-xl font-semibold text-foreground">
            Haftungsausschluss
          </h2>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Haftung für Inhalte</h3>
            <p className={paragraphClass}>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen.
            </p>
            <p className={paragraphClass}>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
              allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
              erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
              Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
              entfernen.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Haftung für Links</h3>
            <p className={paragraphClass}>
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
              Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
              mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
              Verlinkung nicht erkennbar.
            </p>
            <p className={paragraphClass}>
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
              Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
              Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Urheberrecht</h3>
            <p className={paragraphClass}>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
              Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind
              nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p className={paragraphClass}>
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
              Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
              gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
              bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
              werden wir derartige Inhalte umgehend entfernen.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
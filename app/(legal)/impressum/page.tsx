import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum - URL → Image',
  description: 'Rechtliche Informationen und Pflichtangaben gemäß § 5 TMG',
};

export default function ImpressumPage() {
  return (
    <main>
      <h1>Impressum</h1>

      <section aria-labelledby="anbieterangaben">
        <h2 id="anbieterangaben">
          Angaben gemäß § 5 TMG
        </h2>
        <address className="not-italic">
          <p>
            Lukas Zangerl<br />
            Stapper Weg 214<br />
            41199 Mönchengladbach<br />
            Deutschland
          </p>
        </address>
      </section>

      <section aria-labelledby="vertretung">
        <h2 id="vertretung">
          Vertreten durch
        </h2>
        <p>Lukas Zangerl</p>
      </section>

      <section aria-labelledby="kontakt">
        <h2 id="kontakt">
          Kontakt
        </h2>
        <ul>
          <li>
            Telefon: <a href="tel:+4915126718443">+49 151 26718443</a>
          </li>
          <li>
            E-Mail: <a href="mailto:lukas@zangerlcoachingdynamics.com">lukas@zangerlcoachingdynamics.com</a>
          </li>
          <li>
            Website: <a href="https://pagetopic.org">www.pagetopic.org</a>
          </li>
        </ul>
      </section>


      <section aria-labelledby="verantwortlich">
        <h2 id="verantwortlich">
          Inhaltlich Verantwortlicher gemäß § 55 Abs. 2 RStV
        </h2>
        <p>
          Lukas Zangerl<br />
          Stapper Weg 214<br />
          41199 Mönchengladbach
        </p>
      </section>

      <section aria-labelledby="streitschlichtung">
        <h2 id="streitschlichtung">
          EU-Streitschlichtung
        </h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
        </p>
        <p>
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p>
          Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>
      </section>

      <section aria-labelledby="verbraucherstreit">
        <h2 id="verbraucherstreit">
          Verbraucherstreitbeilegung/Universalschlichtungsstelle
        </h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <section aria-labelledby="haftung">
        <h2 id="haftung">
          Haftungsausschluss
        </h2>

        <h3>Haftung für Inhalte</h3>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </p>
        <p>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
          allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
          erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
          Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
          entfernen.
        </p>

        <h3>Haftung für Links</h3>
        <p>
          Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
          Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
          Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
          mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
          Verlinkung nicht erkennbar.
        </p>
        <p>
          Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
          Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
          Rechtsverletzungen werden wir derartige Links umgehend entfernen.
        </p>

        <h3>Urheberrecht</h3>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
          dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
          der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
          Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind
          nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        </p>
        <p>
          Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
          Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
          gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
          bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
          werden wir derartige Inhalte umgehend entfernen.
        </p>
      </section>
    </main>
  );
}
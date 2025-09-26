import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" aria-label="Site Footer">
      <div className="mx-auto max-w-6xl w-full px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Product Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Produkt
            </h3>
            <nav aria-label="Product navigation">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    URL zu Bild Generator
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/gallery" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Galerie
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/pricing" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Preise
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Ressourcen
            </h3>
            <nav aria-label="Resources navigation">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/prompt-guide" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Prompt Guide
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/use-cases" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Anwendungsfälle
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Unternehmen
            </h3>
            <nav aria-label="Company navigation">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/about" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Über uns
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/enterprise" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Enterprise
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:lukas@zangerlcoachingdynamics.com" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Kontakt
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Rechtliches
            </h3>
            <nav aria-label="Legal navigation">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/impressum" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/datenschutz" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Datenschutzerklärung
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/agb" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    AGB
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} URL → Image. Alle Rechte vorbehalten.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ in Mönchengladbach
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
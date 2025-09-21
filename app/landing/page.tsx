import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Flame } from "lucide-react";
import { Bot } from "lucide-react";
import { ImagePlus } from "lucide-react"; 
import { FileJson } from "lucide-react";


export const metadata: Metadata = {
  title: "Stop Wrestling With Canva and Figma | URL → Image",
  description:
    "Create on-brand posts in minutes—save hours each week and cut freelancer/tool costs. We extract content with Firecrawl, craft concise prompts with Gemini 2.5 Flash, and render with Google Imagen 4.",
};

export default function LandingPage() {
  const features = [
    {
      title: "From Link to Live in Seconds",
      desc: "No more blank canvases or prompt engineering. Just paste a URL and get a polished, ready-to-share image in a flash.",
    },
    {
      title: "Perfectly On-Brand, Every Time",
      desc: "We intelligently extract your page's headline and key content to craft a concise, on-message prompt that reflects your brand.",
    },
    {
      title: "Studio-Quality Visuals",
      desc: "Powered by Google's Imagen 4 for crisp, professional, and share-worthy visuals that will stop the scroll.",
    },
    {
      title: "Transparent & Developer-Friendly",
      desc: "Built on a powerful, transparent stack: Firecrawl for web scraping, Gemini 2.5 Flash for prompt generation, and Fal.ai for reliable image rendering.",
    },
  ];

  const steps = [
    { n: 1, t: "Paste a URL" },
    { n: 2, t: "Pick a style" },
    { n: 3, t: "We extract the content" },
    { n: 4, t: "We craft a concise prompt" },
    { n: 5, t: "We generate the image" },
    { n: 6, t: "Download & share" },
  ];

  const hasTestimonials = false;

  return (
    <div className="min-h-screen font-sans">
      {/* Hero */}
      <section className="px-6 md:px-8 pt-16 md:pt-24 pb-6 md:pb-8">
        <div className="mx-auto w-full max-w-xl md:max-w-3xl lg:max-w-6xl">
          <div className="grid md:grid-cols-2 md:items-center gap-8 md:gap-12 lg:gap-16">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">Turn any URL into a stunning visual. Instantly.</h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">Create on-brand social posts, blog graphics, and marketing visuals in minutes. Save hours each week and say goodbye to expensive freelancers and complicated design tools.</p>
              <div className="mt-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild>
                    <Link href="/auth/signin">Generate your first image</Link>
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                {["Ghibli", "LEGO", "Claymation", "Logo", "Whimsical", "Sumi-e"].map(
                  (style, index, arr) => (
                    <span key={style} className="flex items-center gap-x-2">
                      {style}
                      {index < arr.length - 1 && (
                        <span className="opacity-50">•</span>
                      )}
                    </span>
                  ),
                )}
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
              <Image
                src="/url-to-image/hero_main.png"
                alt="Hero visual generated from a URL"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Tech */}
      <section className="px-6 md:px-8 py-6">
        <div className="mx-auto w-full max-w-xl md:max-w-3xl lg:max-w-6xl opacity-80">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flame className="h-5 w-5 text-foreground" />
            <span>Firecrawl</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bot className="h-5 w-5 text-foreground" />
            <span>Gemini 2.5 Flash</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ImagePlus className="h-5 w-5 text-foreground" />
            <span>Imagen 4 (Fal.ai)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileJson className="h-5 w-5 text-foreground" />
            <span>Next.js 15</span>
          </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="px-6 md:px-8 py-10">
        <div className="mx-auto w-full max-w-xl md:max-w-3xl lg:max-w-6xl rounded-lg border bg-card p-6">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">Your Brand, Your Content, Instantly Visualized.</h2>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <p>• Create stunning visuals for changelogs, launch announcements, and product pages without needing a designer.</p>
            <p>• Ensure brand consistency—your website&apos;s headline and key messages are automatically baked into every image.</p>
            <p>• Go from idea to iteration in seconds. Switch styles, tweak prompts, and download your final image instantly.</p>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 md:px-8 py-12 md:py-16">
        <div className="mx-auto w-full max-w-xl md:max-w-3xl lg:max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border bg-card p-5">
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 md:px-8 py-12 md:py-16">
        <div className="mx-auto w-full max-w-xl md:max-w-3xl lg:max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            How it works
          </h2>
          <div className="mt-6">
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((s) => (
              <li key={s.n} className="rounded-lg border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold font-mono">
                    {s.n}
                  </span>
                  <span className="text-sm font-medium text-foreground">{s.t}</span>
                </div>
              </li>
            ))}
          </ol>
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-3">
            <Button asChild variant="outline" >
              <Link href="/auth/signin">Try it for free</Link>
            </Button>
            <span className="text-xs text-muted-foreground font-mono">It usually takes ~5–10 seconds.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      {hasTestimonials ? (
        <section className="px-6 md:px-8 py-12 md:py-16">
          <div className="mx-auto w-full max-w-xl md:max-w-3xl lg:max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center text-foreground">
              Loved by Marketers, Makers, and Developers
            </h2>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-lg border bg-card p-5">
                <p className="text-sm text-muted-foreground">&quot;This is a game-changer for our content workflow. We went from spending hours in Figma to generating stunning, on-brand images in seconds.&quot;</p>
                <p className="mt-4 text-sm font-semibold text-foreground">- Head of Marketing, SaaS Startup</p>
              </div>
              <div className="rounded-lg border bg-card p-5">
                <p className="text-sm text-muted-foreground">&quot;As an indie hacker, I wear a lot of hats. This tool lets me create professional-looking visuals for my projects without having to hire a designer.&quot;</p>
                <p className="mt-4 text-sm font-semibold text-foreground">- Solo Founder & Developer</p>
              </div>
              <div className="rounded-lg border bg-card p-5">
                <p className="text-sm text-muted-foreground">&quot;The image quality is incredible, and the fact that it&apos;s built on a solid, transparent tech stack gives me a lot of confidence.&quot;</p>
                <p className="mt-4 text-sm font-semibold text-foreground">- Senior Frontend Engineer</p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-6 md:px-8 py-12 md:py-16">
          <div className="mx-auto w-full max-w-xl md:max-w-3xl lg:max-w-6xl">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                From the builder
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                I started by playing with the Firecrawl examples on GitHub and turned the idea into a tool I use for my own blog, <a href="https://www.neurohackingly.com" className="underline" target="_blank" rel="noreferrer">neurohackingly.com</a>. Making graphics that truly add value was hard—this app makes it fast.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                I’m making it public so you don’t need to clone a repo or wire API keys. Use a prebuilt app and top up credits when needed.
              </p>
              <ul className="mt-4 text-sm text-muted-foreground list-disc pl-5">
                <li>Paste a URL, pick a style, get an on‑brand visual in ~5–10s</li>
                <li>1 free credit on first sign‑in; pay‑as‑you‑go credits</li>
                <li>Open‑source stack; view the source <a href="https://github.com/codeme-ne/imagine" className="underline" target="_blank" rel="noreferrer">on GitHub</a></li>
              </ul>
              <div className="mt-5 flex items-center gap-3">
                <Button asChild>
                  <Link href="/auth/signin">Try it free</Link>
                </Button>
                <a href="https://github.com/codeme-ne/imagine" target="_blank" rel="noreferrer" className="text-sm underline">
                  View source
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Style presets */}
      <section className="px-6 md:px-8 py-12 md:py-16">
        <div className="mx-auto w-full max-w-xl md:max-w-3xl lg:max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Style presets included
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose from curated looks like Ghibli, LEGO, Claymation, Logo, Whimsical, and Sumi‑e—or bring your own prompt.
          </p>
          <div className="mt-6 grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { src: "/url-to-image/1.png", label: "Ghibli" },
              { src: "/url-to-image/2.png", label: "LEGO" },
              { src: "/url-to-image/3.png", label: "Claymation" },
              { src: "/url-to-image/4.png", label: "Logo" },
              { src: "/url-to-image/5.png", label: "Whimsical" },
              { src: "/url-to-image/6.png", label: "Sumi‑e Ink Wash" },
            ].map((item) => (
                <figure key={item.label} className="overflow-hidden rounded-lg border bg-muted">
                  <div className="relative aspect-[17/16]">
                    <Image src={item.src} alt={item.label} fill className="object-cover" />
                  </div>
                  <figcaption className="p-3 text-center text-sm text-muted-foreground">{item.label} </figcaption>
                </figure>
              )
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 md:px-8 py-12 md:py-16">
        <div className="mx-auto w-full max-w-xl md:max-w-3xl lg:max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">Simple pricing</h2>
          <p className="mt-2 text-sm text-muted-foreground">Pay as you go with credits. 1 credit = 1 image. First-time users get 1 free credit.</p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
              name: 'Starter', price: '€5', credits: 20, blurb: 'Great for occasional posts', pack: 'starter'
            }, {
              name: 'Creator', price: '€12', credits: 60, blurb: 'For regular content', pack: 'creator'
            }, {
              name: 'Pro', price: '€35', credits: 200, blurb: 'Best value for teams', pack: 'pro'
            }].map((p) => (
              <div key={p.name} className="rounded-lg border bg-card p-5 flex flex-col">
                <h3 className="font-semibold text-foreground">{p.name}</h3>
                <div className="mt-1 text-2xl font-semibold">{p.price}</div>
                <div className="text-sm text-muted-foreground">{p.credits} credits</div>
                <p className="mt-3 text-sm text-muted-foreground">{p.blurb}</p>
                <div className="mt-5">
                  <Button asChild className="w-full">
                    <Link href="/auth/signin">
                      {p.pack === 'starter'
                        ? 'Generate your first image'
                        : p.pack === 'creator'
                          ? 'Paste a URL and create'
                          : 'Create campaign visuals now'}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & Trust */}
      <section className="px-6 md:px-8 pb-20">
        <div className="mx-auto w-full max-w-xl md:max-w-3xl lg:max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">Frequently asked</h3>
                <div className="mt-2">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="faq-keys">
                    <AccordionTrigger className="text-foreground py-2">Do I need API keys?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-2">
                      No for the hosted app—keys are configured server‑side. The project is open‑source on
                      <a href="https://github.com/codeme-ne/imagine" className="underline" target="_blank" rel="noreferrer"> GitHub</a>,
                      so you can self‑host and provide your own keys via environment variables. There’s no in‑app API key entry in the current UI.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-pricing">
                    <AccordionTrigger className="text-foreground py-2">How do credits and pricing work?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-2">
                      1 credit = 1 image. No subscriptions or contracts — just pay‑as‑you‑go credit packs via Stripe.
                      You get 1 free credit on first sign‑in. Credits don’t expire.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-regen">
                    <AccordionTrigger className="text-foreground py-2">Can I regenerate images?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-2">
                      Yes—up to 3 additional regenerations per prompt (1 initial + 3). Each regeneration costs 1 credit.
                      In practice, the first result often nails it, so you may not need to regenerate.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-limits">
                    <AccordionTrigger className="text-foreground py-2">Are there any limits?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-2">
                      There’s a daily cap of 100 images per account to keep the service fast for everyone. Standard per‑IP rate limits also apply.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-styles">
                    <AccordionTrigger className="text-foreground py-2">What styles are available?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-2">
                      Curated presets include Ghibli, LEGO, Claymation, Logo, Whimsical, and Sumi‑e. We’re constantly adding new styles so your visuals stay fresh and on‑trend.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-blog-images">
                    <AccordionTrigger className="text-foreground py-2">Can it help with blog images and social posts?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-2">
                      Yes. No more hunting for stock visuals — paste your article or page URL and we extract the key ideas to generate a fitting, on‑brand graphic in seconds.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-workflow">
                    <AccordionTrigger className="text-foreground py-2">What’s the workflow?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-2">
                      Paste a URL → pick a style → we extract content (Firecrawl) → we craft a concise prompt (Gemini) → we render the image (Imagen 4 via Fal.ai) → you download.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-payments">
                    <AccordionTrigger className="text-foreground py-2">How do payments work?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-2">
                      We use Stripe Checkout for one‑time purchases of credit packs. Credits are added to your account immediately after payment and don’t expire.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">Simple, fast, and safe</h3>
              <p className="mt-2 text-sm text-muted-foreground">Built with industry‑standard tools. No hidden processing, no gimmicks—just a clean pipeline that delivers reliable outputs.</p>
              <div className="mt-4">
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground list-disc pl-5">
                  <li>Firecrawl for accurate content extraction</li>
                  <li>Gemini 2.5 Flash for concise, on‑brand prompts</li>
                  <li>Google Imagen 4 (via Fal.ai) for high‑quality renders</li>
                </ul>
              </div>
              <div className="mt-5">
                <Button asChild>
                  <Link href="/auth/signin">Generate from a URL</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 md:px-8 pt-16 md:pt-24 pb-6 md:pb-8">
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">Turn any URL into a stunning visual. Instantly.</h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">Create on-brand social posts, blog graphics, and marketing visuals in minutes. Save hours each week and say goodbye to expensive freelancers and complicated design tools.</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button asChild>
                  <Link href="/auth/signin">Generate your first image</Link>
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
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

            <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] border bg-muted">
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
        <div className="mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 items-center opacity-80" style={{ maxWidth: 720 }}>
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
      </section>

      {/* Who it's for */}
      <section className="px-6 md:px-8 py-10">
        <div className="mx-auto rounded-[10px] border bg-card p-6" style={{ maxWidth: 720 }}>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">Your Brand, Your Content, Instantly Visualized.</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-muted-foreground">
            <p>• Create stunning visuals for changelogs, launch announcements, and product pages without needing a designer.</p>
            <p>• Ensure brand consistency—your website&apos;s headline and key messages are automatically baked into every image.</p>
            <p>• Go from idea to iteration in seconds. Switch styles, tweak prompts, and download your final image instantly.</p>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 md:px-8 py-12 md:py-16">
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-[10px] border bg-card p-5">
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 md:px-8 py-12 md:py-16">
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            How it works
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="rounded-[10px] border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {s.n}
                  </span>
                  <span className="text-sm font-medium text-foreground">{s.t}</span>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-center gap-3">
            <Button asChild variant="outline" >
              <Link href="/auth/signin">Try it for free</Link>
            </Button>
            <span className="text-xs text-muted-foreground">It usually takes ~5–10 seconds.</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-8 py-12 md:py-16">
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center text-foreground">
            Loved by Marketers, Makers, and Developers
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[10px] border bg-card p-5">
              <p className="text-sm text-muted-foreground">&quot;This is a game-changer for our content workflow. We went from spending hours in Figma to generating stunning, on-brand images in seconds.&quot;</p>
              <p className="mt-4 text-sm font-semibold text-foreground">- Head of Marketing, SaaS Startup</p>
            </div>
            <div className="rounded-[10px] border bg-card p-5">
              <p className="text-sm text-muted-foreground">&quot;As an indie hacker, I wear a lot of hats. This tool lets me create professional-looking visuals for my projects without having to hire a designer.&quot;</p>
              <p className="mt-4 text-sm font-semibold text-foreground">- Solo Founder & Developer</p>
            </div>
            <div className="rounded-[10px] border bg-card p-5">
              <p className="text-sm text-muted-foreground">&quot;The image quality is incredible, and the fact that it&apos;s built on a solid, transparent tech stack gives me a lot of confidence.&quot;</p>
              <p className="mt-4 text-sm font-semibold text-foreground">- Senior Frontend Engineer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Style presets */}
      <section className="px-6 md:px-8 py-12 md:py-16">
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Style presets included
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose from curated looks like Ghibli, LEGO, Claymation, Logo, Whimsical, and Sumi‑e—or bring your own prompt.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { src: "/url-to-image/1.png", label: "Ghibli" },
              { src: "/url-to-image/2.png", label: "LEGO" },
              { src: "/url-to-image/3.png", label: "Claymation" },
              { src: "/url-to-image/4.png", label: "Logo" },
              { src: "/url-to-image/5.png", label: "Whimsical" },
              { src: "/url-to-image/6.png", label: "Sumi‑e Ink Wash" },
            ].map((item) => (
                <figure key={item.label} className="overflow-hidden rounded-[10px] border bg-muted">
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

      {/* FAQ & Trust */}
      <section className="px-6 md:px-8 pb-20">
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[10px] border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">Frequently asked</h3>
              <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Do I need API keys?</p>
                  <p>If your environment doesn’t provide a Firecrawl key, you can paste a temporary key for your session. Keys are not stored server‑side.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">What styles are available?</p>
                  <p>We include curated presets (Ghibli, LEGO, Claymation, Logo, Whimsical, Sumi‑e). You can also tweak the prompt for custom looks.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Is there a limit?</p>
                  <p>Endpoints are rate‑limited per IP in production to prevent abuse. Limits are enforced per endpoint (scrape, prompt, image).</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">What’s the workflow?</p>
                  <p>Paste URL → pick style → we extract content → we craft a prompt → we render the image → you download.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[10px] border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">Simple, fast, and safe</h3>
              <p className="mt-2 text-sm text-muted-foreground">Built with industry‑standard tools. No hidden processing, no gimmicks—just a clean pipeline that delivers reliable outputs.</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li>Firecrawl for accurate content extraction</li>
                <li>Gemini 2.5 Flash for concise, on‑brand prompts</li>
                <li>Google Imagen 4 (via Fal.ai) for high‑quality renders</li>
              </ul>
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

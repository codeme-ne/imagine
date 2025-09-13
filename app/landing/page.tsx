import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import { Bot } from "lucide-react";
import { ImagePlus } from "lucide-react"; 
import { FileJson } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";


export const metadata: Metadata = {
  title: "Stop Wrestling With Canva and Figma | URL → Image",
  description:
    "Create on-brand posts in minutes—save hours each week and cut freelancer/tool costs. We extract content with Firecrawl, craft concise prompts with Gemini 2.5 Flash, and render with Google Imagen 4.",
};

export default function LandingPage() {
  const features = [
    {
      title: "From link to design in seconds",
      desc: "No blank canvas or prompt engineering—paste a URL and get a polished image fast.",
    },
    {
      title: "On-brand by default",
      desc: "We use your page headline and key content to craft a concise, on-message prompt.",
    },
    {
      title: "Studio‑quality renders",
      desc: "Powered by Google Imagen 4 (via Fal.ai) for crisp, share‑worthy visuals.",
    },
    {
      title: "Developer‑friendly",
      desc: "Built on Firecrawl + Gemini 2.5 Flash. Transparent, reliable, and fast.",
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
      <section className="px-6 md:px-8 pt-16 md:pt-24 pb-10 md:pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">Stop Wrestling With Canva and Figma.</h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">Create on-brand posts in minutes—save hours each week and cut freelancer/tool costs with AI built for SMB marketing managers.</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <SignUpButton>
                  <Button variant="outline" className="cursor-pointer">Sign up now</Button>
                </SignUpButton>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">🔒 Keys stay on your device when pasted</span>
                <span className="inline-flex items-center gap-1">🪄 Ghibli, LEGO, Claymation, Logo, Whimsical, Sumi‑e presets</span>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
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
        <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-4 gap-6 items-center opacity-80">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flame className="h-5 w-5 text-orange-500" />
            <span>Firecrawl</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bot className="h-5 w-5 text-blue-500" />
            <span>Gemini 2.5 Flash</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ImagePlus className="h-5 w-5 text-red-500" />
            <span>Imagen 4 (Fal.ai)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileJson className="h-5 w-5 text-black" />
            <span>Next.js 15</span>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="px-6 md:px-8 py-10">
        <div className="mx-auto max-w-6xl rounded-xl border bg-card p-6">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">Made for makers, marketers, and indie devs</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-muted-foreground">
            <p>• Ship visuals for changelogs, launch posts, and product pages without a designer.</p>
            <p>• Keep messaging consistent—your site’s headline is baked into the prompt.</p>
            <p>• Iterate fast—switch styles, tweak prompts, and download instantly.</p>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 md:px-8 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 md:px-8 py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            How it works
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="rounded-xl border bg-card p-5">
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
              <Link href="/">Try it now</Link>
            </Button>
            <span className="text-xs text-muted-foreground">It usually takes ~5–10 seconds.</span>
          </div>
        </div>
      </section>

      {/* Style presets */}
      <section className="px-6 md:px-8 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
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
              { src: "/url-to-image/hero_main.png", label: "Logo" },
              { src: "/url-to-image/1.png", label: "Whimsical" },
              { src: "/url-to-image/3.png", label: "Sumi‑e Ink Wash" },
            ].map((item) => (
                <figure key={item.label} className="overflow-hidden rounded-xl border bg-muted">
                  <div className="relative aspect-[4/3]">
                    <Image src={item.src} alt={item.label} fill className="object-cover" />
                  </div>
                  <figcaption className="p-3 text-center text-sm text-muted-foreground">{item.label} preset</figcaption>
                </figure>
              )
            )}
          </div>
        </div>
      </section>

      {/* FAQ & Trust */}
      <section className="px-6 md:px-8 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
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
            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">Simple, fast, and safe</h3>
              <p className="mt-2 text-sm text-muted-foreground">Built with industry‑standard tools. No hidden processing, no gimmicks—just a clean pipeline that delivers reliable outputs.</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li>Firecrawl for accurate content extraction</li>
                <li>Gemini 2.5 Flash for concise, on‑brand prompts</li>
                <li>Google Imagen 4 (via Fal.ai) for high‑quality renders</li>
              </ul>
              <div className="mt-5">
                <Button asChild>
                  <Link href="/">Generate from a URL</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

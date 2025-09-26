import type { Metadata } from 'next';
import Link from 'next/link';
import { useCases } from '@/data/use-cases';

export const metadata: Metadata = {
  title: 'Use Cases - PageTopic | AI Image Generation for Every Professional',
  description: 'Discover how professionals use PageTopic to transform websites into stunning visuals. From marketing to e-commerce, find your perfect use case.',
  keywords: 'AI image generation use cases, marketing visuals, content creation, e-commerce images, social media content',
};

export default function UseCasesIndexPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            AI Image Generation for Every Professional
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover how professionals like you are transforming their visual content workflow with PageTopic
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase) => (
            <Link
              key={useCase.slug}
              href={`/use-cases/${useCase.slug}`}
              className="group p-8 rounded-xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                    {useCase.role}
                  </span>
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {useCase.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-2">
                    {useCase.description}
                  </p>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="space-y-2 mb-4">
                <div className="text-sm font-medium text-foreground">Key Benefits:</div>
                <ul className="space-y-1">
                  {useCase.solution.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{feature.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impact Highlight */}
              {useCase.impact.metrics[0] && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Top Impact:
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {useCase.impact.metrics[0].value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {useCase.impact.metrics[0].label}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Learn More 
                <span className="ml-1 group-hover:ml-2 transition-all">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="container mx-auto px-4 py-20 max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of professionals already creating amazing visuals with AI
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auth/signin"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors"
          >
            Start Creating Now →
          </Link>
          <Link 
            href="/pricing"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-border hover:bg-muted transition-colors text-lg"
          >
            View Pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
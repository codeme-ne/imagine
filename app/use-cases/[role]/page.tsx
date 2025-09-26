import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getUseCaseBySlug, getAllUseCaseSlugs } from '@/data/use-cases';
import InteractiveDemo from '@/components/use-cases/interactive-demo';

// Generate static params for all use cases
export async function generateStaticParams() {
  const slugs = getAllUseCaseSlugs();
  return slugs.map((slug) => ({
    role: slug,
  }));
}

// Generate metadata for each use case
export async function generateMetadata(
  { params }: { params: Promise<{ role: string }> }
): Promise<Metadata> {
  const { role } = await params;
  const useCase = getUseCaseBySlug(role);
  
  if (!useCase) {
    return {
      title: 'Use Case Not Found - PageTopic',
      description: 'The requested use case could not be found.',
    };
  }

  return {
    title: `${useCase.title} - PageTopic Use Cases`,
    description: useCase.description,
    keywords: `${useCase.role}, AI image generation, ${useCase.slug}, visual content creation`,
    openGraph: {
      title: useCase.title,
      description: useCase.description,
      type: 'website',
      url: `https://pagetopic.org/use-cases/${useCase.slug}`,
    },
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  const useCase = getUseCaseBySlug(role);

  // Return 404 if use case not found
  if (!useCase) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            For {useCase.role}s
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {useCase.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {useCase.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={useCase.cta.primary.href}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {useCase.cta.primary.text}
            </Link>
            {useCase.cta.secondary && (
              <Link 
                href={useCase.cta.secondary.href}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                {useCase.cta.secondary.text}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-16 max-w-6xl" aria-labelledby="problem-heading">
        <div className="max-w-4xl mx-auto">
          <h2 id="problem-heading" className="text-3xl font-bold mb-8 text-center">
            {useCase.problem.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {useCase.problem.points.map((point, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/10"
              >
                <span className="text-destructive mt-1">✕</span>
                <p className="text-foreground">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-16 max-w-6xl bg-muted/30" aria-labelledby="solution-heading">
        <div className="max-w-4xl mx-auto">
          <h2 id="solution-heading" className="text-3xl font-bold mb-4 text-center">
            {useCase.solution.title}
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12">
            {useCase.solution.description}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {useCase.solution.features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg bg-background border hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2 text-primary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Interactive Demo */}
          <div className="mt-12">
            <InteractiveDemo 
              sampleUrls={useCase.sampleUrls || [
                'example.com/product',
                'example.com/blog',
                'example.com/landing'
              ]}
            />
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="container mx-auto px-4 py-16 max-w-6xl" aria-labelledby="impact-heading">
        <div className="max-w-4xl mx-auto">
          <h2 id="impact-heading" className="text-3xl font-bold mb-12 text-center">
            {useCase.impact.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {useCase.impact.metrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">
                  {metric.value}
                </div>
                <div className="text-lg font-semibold">{metric.label}</div>
                {metric.description && (
                  <p className="text-sm text-muted-foreground">
                    {metric.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Visual Content?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of {useCase.role}s already creating stunning visuals with AI
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={useCase.cta.primary.href}
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors"
          >
            {useCase.cta.primary.text} →
          </Link>
        </div>
      </section>
    </main>
  );
}
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAllTools, getToolBySlug } from "@/tools/registry";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

// Generate static params for SSG
export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({
    category: tool.metadata.category,
    slug: tool.metadata.slug,
  }));
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.category, resolvedParams.slug);

  if (!tool) {
    return {
      title: "Tool Not Found | AllTools",
    };
  }

  return {
    title: `${tool.metadata.name} | AllTools`,
    description: tool.metadata.description,
    keywords: tool.metadata.keywords.join(", "),
    openGraph: {
      title: tool.metadata.name,
      description: tool.metadata.description,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.category, resolvedParams.slug);

  if (!tool) {
    notFound();
  }

  const { metadata, component: ToolComponent, content: ToolContent } = tool;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: metadata.name,
            applicationCategory: metadata.category === "obstetrics" ? "HealthApplication" : "UtilityApplication",
            operatingSystem: "All",
            description: metadata.description,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD"
            }
          })
        }}
      />
      {/* Breadcrumbs - Compact on mobile, full on desktop */}
      <nav className="mb-4 sm:mb-8">
        {/* Mobile: Simple Back Link */}
        <Link 
          href={`/categories/${metadata.category}`} 
          className="inline-flex sm:hidden items-center text-xs font-semibold text-muted-foreground hover:text-primary transition-colors bg-muted/50 px-2.5 py-1 rounded-lg border border-border/40 capitalize"
        >
          ← {metadata.category}
        </Link>
        {/* Desktop: Full Breadcrumbs */}
        <div className="hidden sm:flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/categories/${metadata.category}`} className="hover:text-primary transition-colors capitalize">
            {metadata.category}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground font-medium">{metadata.name}</span>
        </div>
      </nav>

      {/* Header - Tighter spacing on mobile */}
      <header className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading mb-2 sm:mb-3 text-foreground tracking-tight">
          {metadata.name}
        </h1>
        <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
          {metadata.description}
        </p>
      </header>

      {/* Main Tool Component */}
      <div className="mb-16">
        <ToolComponent metadata={metadata} />
      </div>

      {/* Tool Content (Docs, FAQs, How it works) */}
      {ToolContent && (
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <ToolContent />
        </article>
      )}
    </div>
  );
}

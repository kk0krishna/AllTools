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
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href={`/category/${metadata.category}`} className="hover:text-primary transition-colors capitalize">
          {metadata.category}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">{metadata.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-foreground">
          {metadata.name}
        </h1>
        <p className="text-lg text-muted-foreground">
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

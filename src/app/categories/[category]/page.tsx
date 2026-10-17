import { toolsRegistry } from "@/tools/registry";
import { notFound } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Generate static params for all categories
export function generateStaticParams() {
  const categories = Array.from(new Set(toolsRegistry.map((tool) => tool.metadata.category)));
  return categories.map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categoryName = resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1);
  return {
    title: `${categoryName} Tools - Clinikkit`,
    description: `Browse all ${categoryName} tools, utilities, and calculators on Clinikkit.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categoryTools = toolsRegistry.filter((tool) => tool.metadata.category === resolvedParams.category);

  if (categoryTools.length === 0) {
    notFound();
  }

  const categoryName = resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      
      {/* Breadcrumbs for internal linking */}
      <nav className="mb-8 hidden sm:flex items-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/#categories" className="hover:text-primary transition-colors">Categories</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium capitalize">{categoryName}</span>
      </nav>

      {/* Mobile Breadcrumb */}
      <nav className="mb-6 sm:hidden">
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-primary transition-colors bg-muted/50 px-2.5 py-1 rounded-lg border border-border/40"
        >
          ← Home
        </Link>
      </nav>

      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl font-bold font-heading mb-4">{categoryName} Tools</h1>
        <p className="text-lg text-muted-foreground">
          Browse all our {categoryName.toLowerCase()} utilities. Found a tool you need? Just click to start using it instantly.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {categoryTools.map((tool) => (
          <Link key={tool.metadata.name} href={`/tools/${tool.metadata.category}/${tool.metadata.slug}`} className="group outline-none block">
            <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 h-full flex flex-col hover:-translate-y-1 bg-card/60 backdrop-blur-sm border border-border/60">
              <CardHeader className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <CardTitle className="text-xl font-heading group-hover:text-primary transition-colors">
                      {tool.metadata.name}
                    </CardTitle>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
                  </div>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {tool.metadata.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* SEO Content Section for this specific Category to fix "thin content" */}
      <section className="border-t border-border/50 pt-16 mt-8">
        <div className="max-w-4xl prose prose-slate dark:prose-invert">
          <h2 className="text-xl md:text-2xl font-bold font-heading mb-4">About {categoryName} Tools on Clinikkit</h2>
          <p className="text-muted-foreground mb-4">
            Welcome to the <strong>{categoryName}</strong> category on Clinikkit. Whether you are seeking clinical precision, creative utilities, or everyday productivity, this collection has been meticulously curated to streamline your workflow with lightning-fast, privacy-first web tools.
          </p>
          <p className="text-muted-foreground mb-4">
            Our {categoryName.toLowerCase()} library currently features {categoryTools.length} highly optimized tools designed to operate entirely in your browser. This includes standout utilities like 
            {categoryTools.slice(0, 3).map((t, i, arr) => (
              <span key={t.metadata.slug}>
                <strong> {t.metadata.name}</strong>
                {i < arr.length - 1 ? ", " : ""}
              </span>
            ))}
            {categoryTools.length > 3 ? ", and many more." : "."} By leveraging client-side processing, we guarantee that your sensitive data and personal inputs remain 100% private and secure on your local device, never touching our servers.
          </p>
          <p className="text-muted-foreground">
            Click on any of the {categoryName.toLowerCase()} tools above to launch them instantly. There are no paywalls, no software downloads, and no sign-ups required—just professional-grade, reliable tools available whenever you need them.
          </p>
        </div>
      </section>

    </div>
  );
}

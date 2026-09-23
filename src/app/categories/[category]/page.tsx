import { toolsRegistry } from "@/tools/registry";
import { notFound } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ObstetricsCategoryDashboard } from "@/components/obstetrics/ObstetricsCategoryDashboard";

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

  // Render specialized high-density clinical dashboard for Obstetrics category
  if (resolvedParams.category === "obstetrics") {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <ObstetricsCategoryDashboard tools={categoryTools} />
      </div>
    );
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
          <Link key={tool.metadata.name} href={`/tools/${tool.metadata.category}/${tool.metadata.slug}`}>
            <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-heading">{tool.metadata.name}</CardTitle>
                <CardDescription>{tool.metadata.description}</CardDescription>
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
            Welcome to the <strong>{categoryName}</strong> category on Clinikkit. This section is specifically curated to provide a comprehensive suite of powerful, privacy-first web utilities designed to streamline your workflow.
          </p>
          <p className="text-muted-foreground mb-4">
            Currently, this category features {categoryTools.length} highly optimized tools, including: 
            {categoryTools.slice(0, 5).map(t => ` ${t.metadata.name}`).join(", ")}
            {categoryTools.length > 5 ? ", and more." : "."} Each tool is engineered to run seamlessly directly in your browser without requiring server-side processing, ensuring that your data remains 100% private and secure on your local device.
          </p>
          <p className="text-muted-foreground">
            Whether you need quick calculations, data formatting, or specialized utilities, our {categoryName.toLowerCase()} tools provide instant results. Click on any of the tools above to launch them immediately. No downloads, no sign-ups—just professional-grade tools when you need them.
          </p>
        </div>
      </section>

    </div>
  );
}

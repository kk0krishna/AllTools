import { toolsRegistry } from "@/tools/registry";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    title: `${categoryName} Tools - AllTools`,
    description: `Browse all ${categoryName} tools, utilities, and calculators on AllTools.`,
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
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl font-bold font-heading mb-4">{categoryName} Tools</h1>
        <p className="text-lg text-muted-foreground">
          Browse all our {categoryName.toLowerCase()} utilities. Found a tool you need? Just click to start using it instantly.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}

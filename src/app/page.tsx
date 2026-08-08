import { Search, Calculator, Code, Bot, Headphones, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toolsRegistry } from "@/tools/registry";

const CATEGORIES = [
  { name: "Calculators", icon: Calculator, color: "text-blue-500", bg: "bg-blue-500/10", href: "/categories/calculators" },
  { name: "Developer", icon: Code, color: "text-purple-500", bg: "bg-purple-500/10", href: "/categories/developer" },
  { name: "Everyday", icon: Bot, color: "text-indigo-500", bg: "bg-indigo-500/10", href: "/categories/everyday" },
  { name: "Audio", icon: Headphones, color: "text-rose-500", bg: "bg-rose-500/10", href: "/categories/audio" },
  { name: "Obstetrics", icon: Stethoscope, color: "text-emerald-500", bg: "bg-emerald-500/10", href: "/categories/obstetrics" },
];

const TRENDING = [
  ...toolsRegistry.filter((t) => t.metadata.category === "obstetrics").slice(0, 2),
  ...toolsRegistry.filter((t) => t.metadata.category !== "obstetrics").slice(0, 4),
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <section className="flex flex-col items-center text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 font-heading">
          Every Tool. <span className="text-primary">One Place.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-12">
          A comprehensive, lightning-fast collection of clinical medical calculators, developer utilities, and audiophile forensics. Engineered with precision and 100% local processing for ultimate privacy.
        </p>
        <div className="w-full max-w-2xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input 
            placeholder="Search any tool... (e.g. JSON Formatter, BMI)" 
            className="w-full pl-12 h-14 text-lg rounded-2xl shadow-sm border-2 focus-visible:ring-primary"
          />
        </div>
      </section>

      <section className="mb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 id="categories" className="text-2xl font-bold font-heading">Popular Categories</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group h-full">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                  <div className={`p-4 rounded-full ${category.bg} mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className={`h-8 w-8 ${category.color}`} />
                  </div>
                  <span className="font-semibold">{category.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-heading">Trending Tools</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRENDING.map((tool) => (
            <Link key={tool.metadata.name} href={`/tools/${tool.metadata.category}/${tool.metadata.slug}`}>
              <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-heading">{tool.metadata.name}</CardTitle>
                  <CardDescription>{tool.metadata.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
          <Link href="/contact">
            <Card className="hover:shadow-md transition-all h-full flex flex-col border-dashed border-2 hover:border-primary/50 group bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl font-heading group-hover:text-primary transition-colors">✨ Suggest More Tools</CardTitle>
                <CardDescription>Can't find what you're looking for? Request a new tool or suggest improvements!</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { Search, Calculator, Wallet, HeartPulse, GraduationCap, Code, FileText, Bot, ArrowRightLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toolsRegistry } from "@/tools/registry";

const CATEGORIES = [
  { name: "Calculators", icon: Calculator, color: "text-blue-500", bg: "bg-blue-500/10", href: "/category/calculators" },
  { name: "Finance", icon: Wallet, color: "text-green-500", bg: "bg-green-500/10", href: "/category/finance" },
  { name: "Health", icon: HeartPulse, color: "text-red-500", bg: "bg-red-500/10", href: "/category/health" },
  { name: "Education", icon: GraduationCap, color: "text-yellow-500", bg: "bg-yellow-500/10", href: "/category/education" },
  { name: "Developer", icon: Code, color: "text-purple-500", bg: "bg-purple-500/10", href: "/category/developer" },
  { name: "Text", icon: FileText, color: "text-orange-500", bg: "bg-orange-500/10", href: "/category/text" },
  { name: "AI", icon: Bot, color: "text-indigo-500", bg: "bg-indigo-500/10", href: "/category/ai" },
  { name: "Converters", icon: ArrowRightLeft, color: "text-teal-500", bg: "bg-teal-500/10", href: "/category/converters" },
];

const TRENDING = toolsRegistry.slice(0, 6);

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <section className="flex flex-col items-center text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 font-heading">
          Every Tool. <span className="text-primary">One Place.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-12">
          A fast, modern, and comprehensive collection of practical online tools for everyday users, students, professionals, and developers.
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
          <h2 className="text-2xl font-bold font-heading">Popular Categories</h2>
          <Link href="/categories" className="text-primary hover:underline text-sm font-medium">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </div>
      </section>
    </div>
  );
}

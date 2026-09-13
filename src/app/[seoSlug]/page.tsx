import { notFound } from "next/navigation";
import { imageConverterSeoPages } from "@/lib/seo-configs/image-converter";
import { ImageConverterTool } from "@/tools/everyday/image-converter";
import { Metadata } from "next";

// Next.js requires params to be awaited in page components for dynamic routes
// See: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
interface SeoPageProps {
  params: Promise<{
    seoSlug: string;
  }>;
}

export function generateStaticParams() {
  return imageConverterSeoPages.map((page) => ({
    seoSlug: page.slug,
  }));
}

export async function generateMetadata(props: SeoPageProps): Promise<Metadata> {
  const params = await props.params;
  const page = imageConverterSeoPages.find((p) => p.slug === params.seoSlug);
  if (!page) {
    return {};
  }
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function SeoPage(props: SeoPageProps) {
  const params = await props.params;
  const page = imageConverterSeoPages.find((p) => p.slug === params.seoSlug);
  
  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary">
          {page.h1}
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          {page.description}
        </p>
      </div>

      <ImageConverterTool initialReq={page.preset} />

      <div className="max-w-4xl mx-auto space-y-12 mt-16 pb-16">
        <div className="space-y-4 bg-muted/10 border p-6 sm:p-8 rounded-3xl">
          <h2 className="text-2xl font-bold">How it Works</h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {page.content.explanation}
          </p>
        </div>

        {page.content.faq.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
            <div className="grid gap-4 sm:gap-6">
              {page.content.faq.map((item, index) => (
                <div key={index} className="bg-card border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg mb-2 text-primary">{item.q}</h3>
                  <p className="text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

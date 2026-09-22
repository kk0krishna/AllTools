import { NextResponse } from 'next/server';
import { getToolBySlug } from '@/tools/registry';
import { siteConfig } from '@/config/site';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');

  if (category && slug) {
    const tool = getToolBySlug(category, slug);
    if (tool) {
      // Return a unique manifest for this specific tool
      return NextResponse.json({
        name: tool.metadata.name,
        short_name: tool.metadata.name.slice(0, 12),
        description: tool.metadata.description,
        start_url: `/tools/${category}/${slug}`,
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            // Users can drop a specific icon in /public/tools-icons/[slug]/icon-192x192.png
            // If it doesn't exist, the browser will likely fail to load it and might fallback,
            // or we just provide the global ones as fallback in the array.
            src: `/tools-icons/${slug}/icon-192x192.png`,
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: `/tools-icons/${slug}/icon-512x512.png`,
            sizes: "512x512",
            type: "image/png"
          },
          // Global fallbacks
          {
            src: "/logo/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/logo/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      });
    }
  }

  // Fallback to global manifest if tool not found or no params provided
  return NextResponse.json({
    name: siteConfig.name,
    short_name: siteConfig.nameShort,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/logo/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/logo/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  });
}

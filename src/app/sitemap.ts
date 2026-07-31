import { MetadataRoute } from 'next';
import { toolsRegistry } from '@/tools/registry';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alltools.web.app';

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    } as const,
  ];

  // Category routes
  const categories = Array.from(new Set(toolsRegistry.map((tool) => tool.metadata.category)));
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  } as const));

  // Tool routes
  const toolRoutes = toolsRegistry.map((tool) => ({
    url: `${baseUrl}/tools/${tool.metadata.category}/${tool.metadata.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  } as const));

  return [...routes, ...categoryRoutes, ...toolRoutes];
}

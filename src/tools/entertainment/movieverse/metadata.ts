import { ToolMetadata } from "@/tools/registry";
import { Film } from "lucide-react";
import dynamic from "next/dynamic";

export const movieverseEntry = {
  metadata: {
    name: "MovieVerse Suggestor",
    description: "Discover movies and web series. Save your likes, dislikes, and watchlists.",
    category: "entertainment",
    slug: "movieverse",
    keywords: ["movie", "web series", "suggestor", "recommendation", "entertainment", "tv shows"],
    hideHeader: true,
  },
  component: dynamic(() => import("./index"), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Film className="w-8 h-8 text-muted-foreground animate-bounce" />
          <p className="text-muted-foreground">Entering the MovieVerse...</p>
        </div>
      </div>
    ),
  }),
};

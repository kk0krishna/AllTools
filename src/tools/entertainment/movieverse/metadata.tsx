import { ToolMetadata } from "@/tools/registry";
import { Film } from "lucide-react";
import MovieVerse from "./index";

export const movieverseEntry = {
  metadata: {
    name: "MovieVerse Suggestor",
    description: "Discover movies and web series. Save your likes, dislikes, and watchlists.",
    category: "entertainment",
    slug: "movieverse",
    keywords: ["movie", "web series", "suggestor", "recommendation", "entertainment", "tv shows"],
    hideHeader: true,
  },
  component: MovieVerse,
};

import { ToolMetadata } from "@/tools/registry";
import { Film } from "lucide-react";
import MovieVerse from "./index";

export const movieverseEntry = {
  metadata: {
    name: "MovieVerse Suggestor",
    description: "Tinder for Movies: Discover and rate movies with a friend. Features gesture swipes, taste matching, and a beautiful shelf.",
    category: "entertainment",
    slug: "movieverse",
    keywords: ["movie", "web series", "suggestor", "recommendation", "entertainment", "tv shows", "tinder", "swipe", "match"],
    hideHeader: true,
  },
  component: MovieVerse,
};

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-2xl shadow-sm supports-[backdrop-filter]:bg-background/40">
      <div className="container flex h-13 sm:h-16 items-center mx-auto px-4">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group outline-none">
          <Logo className="w-8 h-8 transition-transform duration-500 group-hover:scale-110 drop-shadow-sm" />
          <span className="font-bold text-lg sm:text-xl tracking-tight text-foreground flex items-center">
            <span>
              {siteConfig.nameShort.slice(0, -1)}
              <span className="underline decoration-primary decoration-2 underline-offset-4">{siteConfig.nameShort.slice(-1)}</span>
            </span>
            <span className="text-primary font-mono ml-[1px]">
              <span className="underline decoration-primary decoration-2 underline-offset-4">{siteConfig.nameHighlight.slice(0, 1)}</span>
              {siteConfig.nameHighlight.slice(1)}
            </span>
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            <Link
              href="/#categories"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Categories
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

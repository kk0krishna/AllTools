import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="relative border-t bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Minimalist Logo & Copyright */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2 group outline-none">
            <Logo className="w-5 h-5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
            <span className="font-bold text-sm tracking-tight text-foreground flex items-center">
              <span>
                {siteConfig.nameShort.slice(0, -1)}
                <span className="underline decoration-primary decoration-2 underline-offset-2">{siteConfig.nameShort.slice(-1)}</span>
              </span>
              <span className="text-primary font-mono ml-[1px]">
                <span className="underline decoration-primary decoration-2 underline-offset-2">{siteConfig.nameHighlight.slice(0, 1)}</span>
                {siteConfig.nameHighlight.slice(1)}
              </span>
            </span>
          </Link>
          <span className="text-muted-foreground/30">|</span>
          <span className="text-xs text-muted-foreground font-medium">© {new Date().getFullYear()}</span>
        </div>
        
        {/* Crisp Links */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/#categories" className="hover:text-primary transition-colors">Categories</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Suggest or Request More Tools</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          
          <div className="flex items-center space-x-1.5 ml-2 border-l pl-6 border-primary/10">
            <span>Crafted with</span>
            <span className="text-rose-500 animate-pulse">❤️</span>
            <span>by</span>
            <a href={siteConfig.author.github} target="_blank" rel="noopener noreferrer" className="font-bold text-foreground hover:text-primary transition-colors font-mono">
              {siteConfig.author.name}
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}

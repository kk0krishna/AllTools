import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center space-x-3 mb-2">
              <Image src="/logo.png" alt="AllTools Logo" width={24} height={24} className="rounded-md grayscale opacity-80" />
              <span className="font-bold text-lg text-foreground/80">AllTools</span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs mt-2">
              Every Tool. One Place. Built with clinical precision and state-of-the-art web engineering to deliver reliable, lightning-fast utilities.
            </p>
          </div>
          
          <div className="flex space-x-6 text-sm font-medium text-muted-foreground">
            <Link href="/#categories" className="hover:text-primary transition-colors">Categories</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Suggest or Request More Tools</Link>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs sm:text-sm">
            <span>© {new Date().getFullYear()} AllTools. All rights reserved.</span>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
          </div>
          <div className="flex items-center space-x-1.5 font-medium">
            <span>Crafted with</span>
            <span className="text-rose-500 animate-pulse">❤️</span>
            <span>by</span>
            <a href="https://github.com/kk0krishna" target="_blank" rel="noopener noreferrer" className="font-bold text-foreground hover:text-primary transition-colors">
              Krishna
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

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
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              Every Tool. One Place. A fast, modern collection of practical online tools.
            </p>
          </div>
          
          <div className="flex space-x-6 text-sm font-medium text-muted-foreground">
            <Link href="/#categories" className="hover:text-primary transition-colors">Categories</Link>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AllTools. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

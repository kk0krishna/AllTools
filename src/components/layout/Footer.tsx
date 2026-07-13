import Link from "next/link";
import { Wrench } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Wrench className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl text-foreground">AllTools</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Every Tool. One Place. A fast, modern collection of practical online tools for everyone.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary">Calculators</Link></li>
              <li><Link href="/" className="hover:text-primary">Developer</Link></li>
              <li><Link href="/" className="hover:text-primary">Text Tools</Link></li>
              <li><Link href="/" className="hover:text-primary">Health</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="/" className="hover:text-primary">Twitter</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AllTools. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

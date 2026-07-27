import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-13 sm:h-16 items-center mx-auto px-4">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
          <Image src="/logo.png" alt="AllTools Logo" width={28} height={28} className="rounded-md sm:w-8 sm:h-8" />
          <span className="font-bold text-lg sm:text-xl tracking-tight text-foreground">AllTools</span>
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

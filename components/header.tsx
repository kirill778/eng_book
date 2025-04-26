import Link from "next/link";
import { Book, BookOpen, Library } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-4">
          <Book className="h-6 w-6" />
          <span className="font-semibold hidden sm:inline-block">WordWise</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            <div className="flex items-center gap-1">
              <Library className="h-4 w-4" />
              <span>Articles</span>
            </div>
          </Link>
          <Link
            href="/vocabulary"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Vocabulary</span>
            </div>
          </Link>
        </nav>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { ArticlesProvider } from '@/components/articles-context';
import { VocabularyProvider } from '@/components/vocabulary-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WordWise - Learn English Vocabulary',
  description: 'Interactive English article reader with AI-powered word translations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ArticlesProvider>
            <VocabularyProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                  <div className="container mx-auto max-w-4xl px-4 py-6">
                    {children}
                  </div>
                </main>
              </div>
            </VocabularyProvider>
          </ArticlesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
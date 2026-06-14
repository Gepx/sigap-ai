import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/provider/auth-provider";
import QueryProvider from "@/components/provider/query-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sigap.ai"),
  title: "Sigap.ai | AI Perception Analysis",
  description:
    "AI-powered perception analysis for sentiment, reputation risk, and tactical business recommendations.",
  applicationName: "Sigap.ai",
  keywords: [
    "Sigap.ai",
    "AI Perception Analysis",
    "Sentiment Analysis",
    "Reputation Risk Management",
    "Business Recommendations AI",
    "Customer Feedback Analysis",
    "Natural Language Processing",
    "Indonesian NLP",
    "AI SaaS",
  ],
  authors: [
    { name: "Sigap.ai Team", url: "https://pijak-sigap-ai.vercel.app" },
  ],
  creator: "Sigap.ai",
  publisher: "Sigap.ai",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://pijak-sigap-ai.vercel.app",
    siteName: "Sigap.ai",
    title: "Sigap.ai | AI Perception Analysis",
    description:
      "AI-powered perception analysis for sentiment, reputation risk, and tactical business recommendations.",
    locale: "id_ID",
    images: [
      {
        url: "/green_sigap_logo.png",
        width: 1200,
        height: 630,
        alt: "Sigap.ai",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/green_sigap_logo.png",
    shortcut: "/green_sigap_logo.png",
    apple: "/green_sigap_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Sigap.ai",
              url: "https://sigap.ai",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://sigap.ai/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: [
                {
                  "@type": "SiteNavigationElement",
                  position: 1,
                  name: "Home",
                  url: "https://sigap.ai/",
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 2,
                  name: "MVP",
                  url: "https://sigap.ai/#mvp",
                },
                {
                  "@type": "SiteNavigationElement",
                  position: 3,
                  name: "Feature",
                  url: "https://sigap.ai/#features",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}

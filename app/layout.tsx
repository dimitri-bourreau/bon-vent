import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryProvider } from "@/features/ui/QueryProvider";
import { Navigation } from "@/components/organisms/Navigation";
import { BackgroundEffects } from "@/components/atoms/BackgroundEffects";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bon vent ! - Gérez votre prospection freelance",
  description:
    "Application de suivi de prospection pour freelances et chercheurs d'emploi. Organisez vos contacts, suivez vos relances et atteignez vos objectifs.",
  keywords: [
    "prospection",
    "freelance",
    "emploi",
    "CDI",
    "contacts",
    "networking",
  ],
  authors: [{ name: "Bon vent !" }],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Bon vent ! - Gérez votre prospection freelance",
    description: "Organisez vos contacts et suivez votre prospection",
    type: "website",
    locale: "fr_FR",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <NuqsAdapter>
            <BackgroundEffects />
            <main className="flex min-h-screen flex-col pb-24">{children}</main>
            <Navigation />
          </NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  );
}

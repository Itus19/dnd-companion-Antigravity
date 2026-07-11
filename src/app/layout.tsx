import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Donjon & Dragon - Compagnon du Maître du Jeu",
  description: "Un compagnon de jeu DnD 2024 avec créateur de personnage, wiki dynamique et MJ virtuel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-dark-950 text-slate-200 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}

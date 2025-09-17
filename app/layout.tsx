import type React from "react";
import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css"; // <-- Verifique se esta linha existe

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Oblivion - Versão parcial",
  description:
    "Plataforma segura para gestão de herança digital e sucessão de bens digitais",
  generator: "grupo Oblivion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${openSans.variable} antialiased`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}

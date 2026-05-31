import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "IPTV Smarters Pro - Official Subscription Portal",
  description: "Access the premium IPTV Smarters Pro app subscription. Manage your account, view payment instructions, and activate your plan with our manual transfer system.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://iptvsmartersprofficiel.com'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

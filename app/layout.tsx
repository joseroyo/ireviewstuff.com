import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/components/AuthProvider";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Pau Landing",
  description: "Pau Landing",
};

const undefinedFont = localFont({
  src: "../public/fonts/undefined-medium.woff2",
  variable: "--font-undefined",
  weight: "500",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${undefinedFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

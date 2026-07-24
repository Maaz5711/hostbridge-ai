import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Airbot AI | AI Guest Communication Automation",
  description:
    "AI-powered guest communication and property management automation for short-term rentals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
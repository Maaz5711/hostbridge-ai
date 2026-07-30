import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
 title: "HostBridge AI | AI Guest Communication Automation",
  description:
    "AI-powered guest communication and property automation for modern hosts and property managers.",
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
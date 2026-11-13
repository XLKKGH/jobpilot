import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jobpilot — Search Lab",
  description: "Evidence-based software, data and AI job search.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { siteName } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL("https://novatech-nas.ae"),
  title: {
    default: `${siteName} | Industrial & Engineering Services`,
    template: `%s | ${siteName}`,
  },
  description:
    "Industrial engineering, automation, marine service, sourcing, and operational support for modern facilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" data-theme="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

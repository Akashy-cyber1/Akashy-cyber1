import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SkyCode CRM",
  description: "Production-ready CRM for local businesses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

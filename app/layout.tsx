import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock-Pilot - Personal Stock Portfolio Tracker",
  description: "A minimalistic stock portfolio tracker for your local machine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

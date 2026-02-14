import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "USDCLP-Pilot - Personal USD/CLP Forex Trading Assistant",
  description: "A minimalistic USD/CLP forex trading assistant with technical analysis and trade signals",
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

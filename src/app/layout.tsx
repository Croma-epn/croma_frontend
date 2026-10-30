import type { Metadata } from "next";
import { inter } from "@/config/fonts";

import "./globals.css";



export const metadata: Metadata = {
  title: "Croma App",
  description: "Un modelador de interfaces de usuario",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

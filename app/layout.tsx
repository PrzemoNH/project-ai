import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project-AI",
  description:
    "Twórz strony internetowe, aplikacje i gry z pomocą sztucznej inteligencji.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
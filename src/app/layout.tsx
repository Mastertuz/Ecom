import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/shared/Header";



export const metadata: Metadata = {
  title: "Интернет-магазин с использованием исскуственного интеллекта",
  description: "Создано Сергеем Бровановым",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className=""
      suppressHydrationWarning
      >
        <main className="px-8">
        {children}
        <Toaster position="top-center" richColors />
        </main>
      </body>
    </html>
  );
}

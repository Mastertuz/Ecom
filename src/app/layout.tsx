import type { Metadata } from "next";
import Header from "../components/shared/Header";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";



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
          <Header/>
        {children}
        <Toaster position="top-center" richColors />
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";



export const metadata: Metadata = {
  title: "Интернет-магазин с интеграцией исскуственного интеллекта",
  description: "Создано Василием Димитровым",
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

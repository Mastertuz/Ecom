import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/shared/Header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <>
            <Header/>
        {children}
        <Toaster position="top-center" richColors />
        </>
  );
}

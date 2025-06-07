import "../globals.css";
import { Toaster } from "@/components/ui/sonner";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

        <main className="px-8 dark">
        {children}
        </main>

  );
}

"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthLayout({children,}: Readonly<{children: React.ReactNode;}>){
    const router = useRouter();
    return (
        <div className="p-4 flex flex-col font-sans antialiased bg-gray-50 items-center w-screen h-screen">
    <header className="sticky top-0 z-40 bg-white/90  backdrop-blur-md border-b border-zinc-50 dark:border-zinc-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="font-semibold tracking-tight text-sm sm:text-base">
          NRC <span className="text-green-400 font-light">Marketplace</span>
        </Link>

      </div>
    </header>            {children}
        </div>
    )
}

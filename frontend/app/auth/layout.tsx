"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthLayout({children,}: Readonly<{children: React.ReactNode;}>){
    const router = useRouter();
    return (
        <div className="p-4 flex items-center ">
            <button onClick={() => {router.back()}}>
                <ArrowLeft className="w-6 h-6 text-zinc-600 fixed top-6 left-6" />
            </button>
            {children}
        </div>
    )
}
"use client";

import {
} from "@/components/ui/navigation-menu";
import { Menu, ShoppingCart } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import SideBar from "./sidebar";
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

export default function MenuBar({status}:{status:"logged"|"not-logged"}) {
  const router = useRouter();
  return (
    <div className="w-full px-2 py-4 sticky top-0 background-blur-md bg-white z-50 border-2 border-gray-100">
    {/**app abr */ }
    <div className="flex flex-row justify-between items-center">
      <SidebarTrigger/>
      <p className="font-bold text-xl">NRC MarketPlace</p>
      {/**avatar */}
      {
        status === "logged" ?
        <ShoppingCart className="w-6 h-6" /> :
      
      <Button  className="text-sm text-zinc-600 shadow-sm p-4 bg-green-400" onClick={() => router.push("/auth/login")}>
        Sign In
      </Button>
}
      </div>
    
    </div>
  )
}


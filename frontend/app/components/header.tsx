"use client";

import {
} from "@/components/ui/navigation-menu";
import { Menu, ShoppingCart } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import SideBar from "./sidebar";
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar";

export default function MenuBar() {
  return (
    <div className="w-full px-2 py-4 sticky top-0 background-blur-md bg-white z-50 border-2 border-gray-100">
    {/**app abr */ }
    <div className="flex flex-row justify-between">
      <SidebarTrigger/>
      <p className="font-extrabold text-xl">NRC MarketPlace</p>
      {/**avatar */}
      <ShoppingCart  className="w-6 h-6"/>
      </div>
    
    </div>
  )
}


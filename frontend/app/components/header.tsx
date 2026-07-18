"use client";

import {
} from "@/components/ui/navigation-menu";
import { Menu } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import SideBar from "./sidebar";
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar";

export default function MenuBar() {
  return (
    <div className="w-full h-full">
    {/**app abr */ }
    <div className="flex flex-row justify-between">
      <SidebarTrigger/>
      <p className="font-extrabold text-xl">MarketPlace</p>
      {/**avatar */}
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      </div>
    
    </div>
  )
}

"use client";
import {X, Plus, User2} from "lucide-react";


import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton,  SidebarGroupAction, SidebarContent, SidebarGroup, SidebarHeader, SidebarFooter, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";

export function AppSideBar() {
  return (
    <Sidebar className="bg-white">

        <div className="h-full w-[100%] bg-white p-3">
      <SidebarHeader className=" flex justify-between flex-row">
        <p className="text-lg font-semibold line-clamp-1">NRC Marketplace</p>
        <X className="w-4 h-4 "/>
        
    </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup>
            <SidebarGroupLabel className="font-semibold">Links</SidebarGroupLabel>
  
            <SidebarGroupContent>
                <nav className="px-6">
                    <ul className="flex flex-col">
                        <li className="my-1 text-md"><a >Home</a></li>
                        <li className="my-1 text-md"><a >Categories</a></li>
                        <li className="my-1  text-md"><a >Explore</a></li>
                        <li className="my-1  text-md"><a >Profile</a></li>
                    </ul>

                </nav>
                
            </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="fixed bottom-0 my-4">
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <User2 /> Logout
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarFooter>
  </div>
      
    </Sidebar>
  )
}


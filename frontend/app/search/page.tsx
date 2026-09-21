"use client";

import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Search, X, ArrowLeft, ListSortDescending } from "lucide-react"
import {useRouter} from "next/navigation";
import {SectionCard} from "../components/card";
import { List, Funnel} from 'lucide-react';
<ListSortDescending />


export default function SearchPage() {
    const router = useRouter();
    return (
        <div className="flex flex-col">
            <div className="shadow-md background-white/90 backdrop-blur-md sticky top-0 z-50">
                <Field className="mt-6 mb-6 max-w-[90%] mx-auto w-full">
                    <InputGroup className="py-6 px-2 text-md">
                        <InputGroupAddon align="inline-start">
                            <ArrowLeft className="h-6 w-6 mr-4"  onClick={()=> {router.push("/")}}/>
                        </InputGroupAddon>
                        <InputGroupInput id="input-group-search"  placeholder="Search items and services" />
                        <InputGroupAddon align="inline-end">
                            <X className="h-6 w-6" />
                        </InputGroupAddon>
                    </InputGroup>
                </Field>    
            </div>

            {/**products view */}
            <div className="bg-gray-50 min-h-screen grid grid-cols-2 gap-4 p-4 mb-20">
                <SectionCard />
                <SectionCard />
                <SectionCard />
                <SectionCard />
                <SectionCard />
                <SectionCard />
            </div>

            {/**bottom options */}
            <div className="bg-white shadow-md fixed bottom-0 z-50 flex flex-row w-full justify-center gap-18 px-4 py-2">
                <div className="flex flex-col gap-2">
                    <Funnel className="h-6 w-6"/>
                    <p className="text-sm">Filter</p>
                </div>

                <div className="flex flex-col gap-2 items-start">
                    <ListSortDescending className="h-6 w-6"/>
                    <p className="text-sm">Sort</p>
                </div>

            </div>


        </div>
    )
}
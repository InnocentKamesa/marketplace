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
import {useState, useEffect} from "react"
import {useSearchParams} from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState(null);
    const [query, setQuery] = useState(searchParams.get("query") || "");

    const perfromSearch = async() => {
        try{
            const response = await fetch(`${API_URL}/api/products/search?query=${encodeURIComponent(query)}`);
            if(!response.ok){
                throw new Error("Failed to fetch search results");
            }
            const responseJson = await response.json();
            setProducts(responseJson.data);
            console.log("Search results:", responseJson.data);
        }   
        catch(err){
            console.error("Search failed:", err);
        }
    }
    useEffect(() => {
        perfromSearch();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }
    
    return (
        <div className="flex flex-col">
            <div className="shadow-md background-white/90 backdrop-blur-md sticky top-0 z-50 w-screen">

                <form onSubmit={() => {
                    e.preventDefault();
                    perfromSearch();
                }}>
                    <Field className="mt-6 mb-6 max-w-[90%] mx-auto w-full">
                    <InputGroup className="py-6 px-2 text-md">
                        <InputGroupAddon align="inline-start">
                            <ArrowLeft className="h-6 w-6 mr-4"  onClick={()=> {router.push("/")}}/>
                        </InputGroupAddon>
                        <InputGroupInput id="input-group-search" value={query} type="search" onChange={handleChange} placeholder="Search items and services" />
                        <InputGroupAddon align="inline-end">
                            <X className="h-6 w-6" />
                        </InputGroupAddon>
                    </InputGroup>
                </Field>

                </form>
                    
            </div>

            {/**products view */}
            {
                !products ? (
                    <div className="bg-gray-50 min-h-screen w-full flex justify-center items-center">
                        <p className="Font-extrabold text-2xl">No Items Found</p>
                    </div>

                ) : (
                    <div className="bg-gray-50 min-h-screen grid grid-cols-2 gap-4 p-4 mb-20">
            
            </div>
                )
                
            }
            

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
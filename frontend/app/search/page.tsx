"use client";

import { Suspense, useState } from "react";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  X,
  ArrowLeft,
  ListSortDescending,
  Funnel,
} from "lucide-react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {SectionCard} from "../components/card";
import {LoadingSpinner} from "..//components/spinner";
import type { ProductItem } from "../types/product";

const API_URL =
process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";


function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(
    searchParams.get("query") || ""
  );

  const performSearch = async () => {
    console.log(query);
    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/api/products/search?query=${encodeURIComponent(query)}`, {
            method:"GET",
        }
      );

      if (!response.ok) {
        const responseJson = await response.json();
        alert(responseJson.message)
        setLoading(false);
        throw new Error("Failed to fetch search results");
      }

      const responseJson = await response.json();
      const results = responseJson.data.products;
      if(!results || results.length === 0) {
        setProducts([]);
        setLoading(false);
      } else {
        setTimeout(()=>{
            setProducts(results);
            setLoading(false);

        },200
        )
        
      }
      console.log("Search results:", responseJson.data.products);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQuery(e.target.value);
  };

  return (
    <div className="flex flex-col">
      {/* Search bar */}
      <div className="shadow-md background-white/90 backdrop-blur-md sticky top-0 z-50 w-screen">

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            performSearch();
          }}
        >
          <Field className="my-3 max-w-[90%] mx-auto w-full">
            <InputGroup className="py-4 px-2 text-md">
              <InputGroupAddon align="inline-start">
                <ArrowLeft
                  className="h-6 w-6 mr-4 cursor-pointer"
                  onClick={() => router.push("/")}
                />
              </InputGroupAddon>

              <InputGroupInput
                id="input-group-search"
                value={query}
                type="search"
                onChange={handleChange}
                placeholder="Search items and services"
              />

              <InputGroupAddon align="inline-end">
                <X className="h-6 w-6 cursor-pointer" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </form>
      </div>

      { loading ? (
        <div className="bg-gray-50 min-h-screen w-full flex justify-center items-center">
            <LoadingSpinner />
        </div>
      ) : (
        
    <div>
        {/* Products */}
      {!products ? (
        <div className="bg-gray-50 min-h-screen w-full flex justify-center items-center">
          <p className="font-extrabold text-2xl">
            No Items Found
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 grid grid-cols-2 gap-4 p-4 mb-20">
            {products.map((product) => (
                <SectionCard key={product.id} product={product} />
            ))}
        </div>
      ) 
        }
    </div>
      )
    }
      
    
 
      {/* Bottom options */}
      <div className="bg-white shadow-md fixed bottom-0 z-50 flex flex-row w-full justify-center gap-18 px-4 py-2">
        <div className="flex flex-col gap-2">
          <Funnel className="h-6 w-6" />
          <p className="text-sm">Filter</p>
        </div>

        <div className="flex flex-col gap-2 items-start">
          <ListSortDescending className="h-4 w-4" />
          <p className="text-sm">Sort</p>
        </div>
      </div>

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading search...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

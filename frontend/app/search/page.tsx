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

const env = process.env.ENVIRONMENT || "development";
const API_URL = env === "development"? "http://localhost:5000" : process.env.NEXT_PUBLIC_API_URL;


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
    <div className="flex flex-col gap-2">
      {/* Search bar */}
      <div className="px-4 pt-4  shadow-md background-white backdrop-blur-md sticky top-0 z-50 w-screen flex flex-col gap-2">
        {/**header */}
            <div className="flex flex-row justify-between z-50 sticky top-0 bg-white">
              

                <button onClick={ () => { router.back(); }}>
                    <ArrowLeft className="h-6 w-6 text-zinc-600"/>
                </button>
                <p className="font-bold text-lg">Search</p>
                <button>
                    <Funnel className="h-6 w-6 text-zinc-600"/>
                </button>
            </div>
            <form
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            performSearch();
          }}
        >
           <input type="search" placeholder="Search items & services" id="input-group-search" value={query} onChange={handleChange} className="rounded-sm px-2 py-3 my-3 border-1 border-gray-300 w-full"/>
          
        </form>
      </div>

      { loading ? (
        <div className="bg-gray-50 min-h-screen w-full flex justify-center items-center">
            <LoadingSpinner />
        </div>
      ) : (
        
    <div>
        {/* Products */}
      {products.length === 0 ? (
        <div className="bg-gray-50 min-h-screen w-full flex justify-center items-center">
          <p className="font-bold text-lg">
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




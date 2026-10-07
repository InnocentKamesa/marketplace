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

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState(null);
  const [query, setQuery] = useState(
    searchParams.get("query") || ""
  );

  const performSearch = async () => {
    console.log(query);

    try {
      const response = await fetch(
        `${API_URL}/api/products/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const responseJson = await response.json();

      setProducts(responseJson.data);

      console.log("Search results:", responseJson.data);
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

      {/* Products */}
      {!products ? (
        <div className="bg-gray-50 min-h-screen w-full flex justify-center items-center">
          <p className="font-extrabold text-2xl">
            No Items Found
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 min-h-screen grid grid-cols-2 gap-4 p-4 mb-20">
          {/* Render products here */}
        </div>
      )}

      {/* Bottom options */}
      <div className="bg-white shadow-md fixed bottom-0 z-50 flex flex-row w-full justify-center gap-18 px-4 py-2">
        <div className="flex flex-col gap-2">
          <Funnel className="h-6 w-6" />
          <p className="text-sm">Filter</p>
        </div>

        <div className="flex flex-col gap-2 items-start">
          <ListSortDescending className="h-6 w-6" />
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

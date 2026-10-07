"use client";

import React, { useEffect, useMemo, useState } from "react";
import MenuBar from "./components/header";
import { Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { MainCard, SectionCard, type ProductItem } from "./components/card";
import { useRouter } from "next/navigation";
import Section from "./components/section";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type HomeSectionsData = {
  latest: ProductItem[];
  services: ProductItem[];
  essentials: ProductItem[];
  electronics: ProductItem[];
  campusLiving: ProductItem[];
};

const fallbackHomeData: HomeSectionsData = {
  latest: [
    { id: 1, title: "Original JBL Earphones", description: "Wireless sound for lectures, workouts and everyday commute.", price: 35000, category: "electronics", type: "product" },
    { id: 2, title: "Campus Study Desk", description: "Compact desk setup built for focused study sessions.", price: 29000, category: "campus-living", type: "product" },
    { id: 3, title: "Portable Power Bank", description: "Fast-charging backup for phones, tablets and earbuds.", price: 22000, category: "essentials", type: "product" },
  ],
  services: [
    { id: 101, title: "Academic Tutoring", description: "Weekly study support in STEM and business courses.", price: 8000, category: "services", type: "service" },
    { id: 102, title: "Phone Repair", description: "Screen and battery repair for everyday devices.", price: 12000, category: "services", type: "service" },
  ],
  essentials: [
    { id: 201, title: "Laundry Starter Pack", description: "Detergent, basket and supply bundle for student living.", price: 15000, category: "essentials", type: "product" },
    { id: 202, title: "Study Lamp", description: "Easy lighting for reading nooks and bedrooms.", price: 9000, category: "essentials", type: "product" },
  ],
  electronics: [
    { id: 301, title: "Bluetooth Speaker", description: "Compact speaker with clear sound for dorm rooms.", price: 27000, category: "electronics", type: "product" },
    { id: 302, title: "USB-C Hub", description: "Support for multiple devices in one portable hub.", price: 16000, category: "electronics", type: "product" },
  ],
  campusLiving: [
    { id: 401, title: "Mini Fridge", description: "Space-saving storage for snacks and drinks.", price: 32000, category: "campus-living", type: "product" },
    { id: 402, title: "Mattress Topper", description: "Extra comfort for compact student rooms.", price: 25000, category: "campus-living", type: "product" },
  ],
};

type CategoryCardProps = {
  text: string;
};

function CategoryCard({ text }: CategoryCardProps) {
  return (
    <div>
      <div className="rounded-full text-zinc-600 shadow-md px-4 py-2 bg-green-400 text-sm font-semibold">
        <p className="line-clamp-1">{text}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [status, setStatus] = useState<"logged" | "not-logged">("not-logged");
  const [user, setUser] = useState({
    id:1,
    first:"User",
  });
  const [homeSections, setHomeSections] = useState<HomeSectionsData>(fallbackHomeData);

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/all/`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch home data");
        }

        const result = await response.json();
        console.log(result)
        const apiData = result?.data ?? {};

        if (!isMounted) return;

        setHomeSections({
          latest: Array.isArray(apiData.latest) && apiData.latest.length ? apiData.latest : fallbackHomeData.latest,
          services: Array.isArray(apiData.services) && apiData.services.length ? apiData.services : fallbackHomeData.services,
          essentials: Array.isArray(apiData.essentials) && apiData.essentials.length ? apiData.essentials : fallbackHomeData.essentials,
          electronics: Array.isArray(apiData.electronics) && apiData.electronics.length ? apiData.electronics : fallbackHomeData.electronics,
          campusLiving: Array.isArray(apiData.campusLiving) && apiData.campusLiving.length ? apiData.campusLiving : fallbackHomeData.campusLiving,
        });
      } catch (error) {
        console.error("Home page data fetch failed:", error);

        if (isMounted) {
          setHomeSections(fallbackHomeData);
        }
      }
    };

     const fetchUserData = async () => {


      try {
        const response = await fetch(`${API_URL}/api/auth/me/`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const responseJson = await response.json();
        setUser(responseJson?.data ?? null);
        setStatus("logged");
        console.log("User data fetched:", user);
      } catch (error) {
        console.error("User data fetch failed:", error);
      }
    }

    loadHomeData();
    fetchUserData();

    return () => {
      isMounted = false;
    };
  },
   []);

  const sectionCards = useMemo(
    () => [
      { key: "latest", title: "Latest arrivals", products: homeSections.latest },
      { key: "services", title: "Services", products: homeSections.services },
      { key: "essentials", title: "Essentials", products: homeSections.essentials },
      { key: "electronics", title: "Electronics", products: homeSections.electronics },
      { key: "campusLiving", title: "Campus living", products: homeSections.campusLiving },
    ],
    [homeSections],
  );

  const featuredProducts = homeSections.latest.slice(0, 3);
  const recommendedProducts = [
    ...homeSections.latest,
    ...homeSections.services,
    ...homeSections.essentials,
    ...homeSections.electronics,
    ...homeSections.campusLiving,
  ].slice(0, 4);

  const handleSearch = (query: string) => {
    router.push(`/search?query=${encodeURIComponent(query)}`);
  }

  return (
    <div className="flex flex-col text-sm text-black/80">
      <MenuBar status={status}/>
      <div className="flex flex-col gap-1 px-4 pt-4">
        <p>Welcome  <span  className="font-bold">{user ? user.first : "."}</span></p>
        <p className="font-semibold text-lg max-w-[90%]">What are you looking to buy today?</p>
      </div>

``````<form onSubmit={(e) => {
        e.preventDefault();
        handleSearch("" + (document.getElementById("input-group-search") as HTMLInputElement)?.value);
      }}>
  <Field className="my-4 max-w-[90%] mx-auto rounded-sm border border-gray-100 text-sm w-full" >
        <InputGroup className="py-4 px-2 text-md">
          <InputGroupInput id="input-group-search" placeholder="Search items and services" type="search"/>
          <InputGroupAddon align="inline-end">
            <Search className="h-6 w-6" />
          </InputGroupAddon>
        </InputGroup>
      </Field>

      </form>
      

      <div className="bg-gray-100 w-screen min-h-screen rounded-t-lg p-4 flex flex-col space-y-6 overflow-auto">
        <div className="flex flex-col gap-4">
          <ScrollArea>
            <div className="flex flex-row p-2 space-x-4 overflow-scroll-x">
              {sectionCards.map((section) => (
                <CategoryCard key={section.key} text={section.title} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>

          <ScrollArea>
            <div className="flex flex-row space-x-2 overflow-scroll-x">
              {featuredProducts.map((product) => (
                <MainCard key={product.id} product={product} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>

        {sectionCards.map((section) => (
          <Section key={section.key} title={section.title} products={section.products} />
        ))}

        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between my-3">
            <p className="text-lg">Recommended for you</p>
          </div>
          <div className="grid grid-cols-2 gap-4 overflow-hidden">
            {recommendedProducts.map((product) => (
              <SectionCard key={`${product.type}-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

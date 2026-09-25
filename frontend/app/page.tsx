"use client";

import React from "react";
import MenuBar from "./components/header";

import { Search, X } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { MainCard, SectionCard } from "./components/card";
import {useRouter} from "next/navigation";
import Section from "./components/section";

type CategoryCardProps = {
  text: string;
};

function CategoryCard({ text }: CategoryCardProps) {
  return (
    <div>
      <div className="rounded-full text-white/80 shadow-md px-2 py-1  bg-green-600">
        <p>{text}</p>
      </div>
    </div>
  )
}



export default function HomePage() {
  const router = useRouter();
  return (
    <div className="flex flex-col text-sm text-black/80">
      <MenuBar />
      {/**welcome text */}
      <div className="flex flex-col gap-2 px-4 pt-4">
        <p className="">Hi, Innocent</p>
        <p className="font-semibold text-lg max-w-[90%]">What are you looking to buy today?</p>
      </div>

      {/**Search */}
      <Field className="my-4 max-w-[90%] mx-auto w-full" onSubmit={(e) => {
        e.preventDefault();
        
        router.push(`/search?query=`);
      }}>
        <InputGroup className="py-4 px-2 text-md">
          <InputGroupInput id="input-group-search"  placeholder="Search items and services" />
          <InputGroupAddon align="inline-end">
            <Search className="h-6 w-6" />
          </InputGroupAddon>
        </InputGroup>
      </Field>

      {/**main page content */}
      <div className="bg-gray-100 w-screen min-h-screen rounded-t-lg p-4 flex flex-col space-y-6 overflow-auto">



        {/** main products*/}
        <div className="flex flex-col gap-4">
          {/**categories */}
          <ScrollArea>
            <div className="flex flex-row p-2 space-x-4">
              <CategoryCard text="Accessories" />
              <CategoryCard text="Accessories" />
              <CategoryCard text="Accessories" />
              <CategoryCard text="Accessories" />
              <CategoryCard text="Accessories" />
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
          <div className="flex flex-row space-x-2 overflow-hidden">
          <MainCard />
          <MainCard />
          </div>
        </div>

        {/**sections */}
        <Section />
        <Section />
        <Section />
        <Section />

        {/**recommended for you */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between my-3">
            <p className="text-sm">Recommended for you</p>
          </div>
          <div className="grid grid-cols-2 gap-4 overflow-hidden">
            <SectionCard />
            <SectionCard />
            <SectionCard />
            <SectionCard />
          </div>
        </div>
      
          </div>
        </div>

  );
}

"use client";

import React from "react";
import MenuBar from "./components/header";

import { Search } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { MainCard, SectionCard } from "./components/card";


function CategoryCard({ text }) {
  return (
    <div>
      <div className="rounded-full text-white/80 shadow-md px-2 py-1  bg-green-600">
        <p>{text}</p>
      </div>
    </div>
  )
}

function Section() {
  return (
    <div>
      {/**headings */}
      <div className="flex flex-row justify-between">
        <p className="text-sm">Featured products</p>
        <p className="text-sm hover:underline">See all</p>
      </div>
      {/**products */}
      <ScrollArea>
        <div className="flex flex-row space-x-4 overflow-hidden">
          <SectionCard />
          <SectionCard />
          <SectionCard />
          <SectionCard />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <MenuBar />
      {/**welcome text */}
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-lg">Hi, Innocent</p>
        <p className="font-bold text-3xl max-w-[90%]">What are you looking to buy today?</p>
      </div>

      {/**Search */}
      <Field className="my-6 max-w-[90%] mx-auto">
        <InputGroup className="py-6 px-2 text-md">
          <InputGroupInput id="input-group-search" placeholder="Search items and services" />
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

      </div>
    </div>

  );
}

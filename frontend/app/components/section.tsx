import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { SectionCard } from "./card";

export default function Section() {
  return (
    <div>
      {/**headings */}
      <div className="flex flex-row justify-between my-3">
        <p className="text-lg">Featured products</p>
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

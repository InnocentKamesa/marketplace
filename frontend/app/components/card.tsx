import {Button} from "@/components/ui/button";
import Image from "next/image";
import {ArrowRight, Star} from "lucide-react";

export function MainCard(){
    return (
        <div className="p-4 justify-between rounded-md shadow-lg flex flex-row gap-4 min-w-[95%] bg-zinc-50"> 
            <div className="flex gap-4 max-w-[45%] flex-col">
                <p className="font-bold text-3xl">Original JBL earphones</p>
                <Button variant="outline" className="  text-green-400"><span>Shop now</span><ArrowRight /></Button>
            </div>
            <Image src="/headset preview.png" alt="product" width={90} height={50} className=""/>
        </div>
    )
}

export function SectionCard(){
    return (
        <div className="p-4 bg-zinc-50 max-w-45 flex flex-col shadow-lg rounded-md shrink-0">
            <Image alt="product" src="/headset preview.png" width={40} height={50} className="h-40 w-40 rounded-sm"/>
            <div className="flex-1 flex flex-col gap-3 mt-2">
                <p className="text-sm">Apple Earbuds Second generation</p>
                <p className="text-sm font-bold">MKW350, 000</p>

                {/**ratings */}
                <div className=" items-center flex flex-row gap-2">
                    <Star className="h-4 w-4 text-yellow-400"/>
                    <p className="text-sm">4.9</p>
                </div>

                
            </div>
        </div>
    )
}
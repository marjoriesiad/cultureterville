import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Image from "next/image"
import random from "@/public/random.jpg"
import { Button } from "../ui/button"
  
const CarouselComponent = () => {
  return (
<div>
  <Carousel className="w-5/6 bg-green-500 flex justify-center mx-auto mt-2">
    <CarouselContent>
      <CarouselItem className="h-full w-full overflow-hidden">
        <div className="relative h-full w-full">
          <Image 
            src={random} 
            alt="random image" 
            width={800}
            height={400}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <Button className="bg-white text-black hover:bg-gray-300 cursor-pointer">1</Button>
          </div>
        </div>
      </CarouselItem>
      <CarouselItem><div className="relative h-full w-full">
          <Image 
            src={random} 
            alt="random image" 
            width={800}
            height={400}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <Button className="bg-white text-black hover:bg-gray-300 cursor-pointer">2</Button>
          </div>
        </div></CarouselItem>
      <CarouselItem><div className="relative h-full w-full">
          <Image 
            src={random} 
            alt="random image" 
            width={800}
            height={400}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <Button className="bg-white text-black hover:bg-gray-300 cursor-pointer">3</Button>
          </div>
        </div></CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</div>
  )
}

export default CarouselComponent
import Image from "next/image";
import BookTicket from "./bookTicket";

export default function Hero() {
    return (
        <main className="w-full min-h-screen relative">
            <Image 
            src={"/hero.png"} 
            alt={"hero image"} 
            layout="fill" 
            objectFit="cover" 
            className="brightness-40" 
            />
            <div className="absolute inset-0 z-10 flex justify-center items-center px-20 border border-red-400">
                <div className="w-7/12">
                    <h1 className="text-7xl text-white font-bold">Effortless Movement, Every Time.</h1>
                    <h3 className="text-2xl text-white mt-2">Experience seamless travel with UrbanGlide.</h3>
                </div>
                <div className="w-5/12">
                <BookTicket/>
                </div>
            </div>
        </main>
    )
}
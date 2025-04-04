import BookTicket from "@/components/bookTicket";
import Image from "next/image";

export default function BookTickets() {
    return (
        <div className="w-full min-h-screen relative flex items-center justify-center">
            <Image src={"/bg.jpg"} alt={"background image"} layout="fill" objectFit="cover" className="z-0 brightness-40" />
            <div className="w-5/12 z-10">
                <BookTicket />
            </div>
        </div>
    )
}
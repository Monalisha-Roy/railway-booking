import Image from "next/image";

export default function Hero() {
    return (
        <main className="w-full min-h-screen">
            <Image src={"/hero.png"} alt={"hero image"} layout="fill" objectFit="cover"/>
        </main>
    )
}
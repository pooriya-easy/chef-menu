"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full py-12 flex flex-col items-center justify-center text-center bg-[#0a0a0a]">
      {/* کانتینر عکس با اندازه استاندارد و پس‌زمینه هماهنگ */}
      <div className="relative w-full max-w-[450px] md:max-w-[550px] aspect-square mx-auto flex items-center justify-center p-4">
        <Image
          src="/hero-dish.webp"
          alt="بشقاب غذا"
          width={550}
          height={550}
          priority
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>
    </section>
  );
}

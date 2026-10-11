"use client";

import Image from "next/image";
import { useState } from "react";
import type { Food } from "../lib/foodCatalog";

export default function FoodImage({ food }: { food: Pick<Food, "name" | "image"> }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return <Image src={failedSource === food.image ? "/food-placeholder.svg" : food.image} alt={food.name} fill unoptimized
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    className="object-cover transition-transform duration-300 group-hover:scale-105"
    onError={() => setFailedSource(food.image)} />;
}

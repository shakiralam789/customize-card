"use client";
import { removeLocalStorage } from "@/helper/helper";
import { PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import React from "react";

const weddingCardList = [
  {
    id: "geometric-floral",
    title: "Geometric Floral",
    image: "/images/invitations/geometric-flowers-design.jpeg",
  },
];

export default function Page() {
  const router = useRouter();
  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">
        Wedding Invitations
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {weddingCardList &&
          weddingCardList.length > 0 &&
          weddingCardList.map((card) => (
            <div
              onClick={(e) => {
                removeLocalStorage(card.id);
                router.push(`/customize-card/${card.id}`);
              }}
              key={card.id}
              className="cursor-pointer bg-white shadow overflow-hidden transition hover:shadow-xl"
            >
              <Image
                src={card.image}
                height={400}
                width={400}
                alt={card.title}
                className="w-full object-cover aspect-[1/1.4]"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        <Link
          href={"/customize-card"}
          className="min-h-[300px] flex justify-center items-center flex-col text-gray-500 h-full bg-white shadow overflow-hidden transition hover:shadow-xl"
        >
          <PlusCircleIcon className="mb-4" />
          <span>Create by yourself</span>
        </Link>
      </div>
    </>
  );
}

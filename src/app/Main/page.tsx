"use client";

import { useState, useEffect } from "react";
import KaKaoMap from "@/components/KaKaoMap";
import SideBar from "@/components/SideBar";
import data from "./data.json";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Main() {
    const [selectedCard, setSelectedCard] = useState<any | null>(null);
    const [activeOption, setActiveOption] = useState<number | null>(null);

    return (
        <div>
            <SideBar data={data} selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
                activeOption={activeOption}
                setActiveOption={setActiveOption} />
            <KaKaoMap data={data} setSelectedCard={setSelectedCard} setActiveOption={setActiveOption}/>
        </div>
    )
}
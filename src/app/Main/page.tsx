"use client";

import { useRef } from "react";

import KaKaoMap from "@/components/KaKaoMap";
import SideBar from "@/components/SideBar";

export default function Main() {
    return (
        <div>
            <SideBar />
            <KaKaoMap />
        </div>
    )
}
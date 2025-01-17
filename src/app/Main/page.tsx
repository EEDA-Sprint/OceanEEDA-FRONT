"use client";

import { useState, useEffect } from "react";
import KaKaoMap from "@/components/KaKaoMap";
import SideBar from "@/components/SideBar";
import Popup from "@/components/PopUp";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQuery } from "@apollo/client";
import { GetAllMarkings } from "../../graphql/query"

export default function Main() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedCard, setSelectedCard] = useState<any | null>(null);
    const [activeOption, setActiveOption] = useState<number | null>(null);
    const [popupMode, setPopupMode] = useState<Number>(0);
    const [isMarkerMode, setIsMarkerMode] = useState(false);
    const { data, loading, error } = useQuery(GetAllMarkings);
    const [markings, setMarkings] = useState();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (data) {
            setMarkings(data.getAllMarkings);
        }
        setIsLoggedIn(token !== null);
    }, [data]);

    useEffect(() => {
        if (data) {
            setMarkings(data.getAllMarkings);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data?.getAllMarkings) {
        return <div>No data available</div>;
    }

    const openPopup = (mode: Number) => {
        setPopupMode(mode);
    };

    const closePopup = () => {
        setPopupMode(0);
    };

    return (
        <div>
            <button onClick={() => console.log(markings)}>test</button>
            {popupMode === 1 && (
                <Popup 
                    mode={popupMode} 
                    onClose={closePopup} 
                    setIsLoggedIn={setIsLoggedIn}
                />
            )}
            <SideBar 
                data={data.getAllMarkings} 
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
                activeOption={activeOption}
                setActiveOption={setActiveOption}
                openPopup={openPopup}
                setIsMarkerMode={setIsMarkerMode}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                setMarkings={setMarkings}
            />
            <KaKaoMap 
                data={data.getAllMarkings}
                setSelectedCard={setSelectedCard}
                setActiveOption={setActiveOption}
                isMarkerMode={isMarkerMode}
            />
        </div>
    );
}
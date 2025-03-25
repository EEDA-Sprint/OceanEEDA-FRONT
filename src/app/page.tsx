"use client";

import { useState, useEffect, useCallback } from "react";
import KaKaoMap from "@/components/Map/KaKaoMap";
import SideBar from "@/components/SideBar";
import Popup from "@/components/PopUp";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMutation, useQuery } from "@apollo/client";
import { GetAllMarkings, GetAllRegion } from "../graphql/query";
import { Refresh } from "@/graphql/mutations";

export default function Main() {
    const [selectedCard, setSelectedCard] = useState<any | null>(null);
    const [activeOption, setActiveOption] = useState<number | null>(null);
    const [popupMode, setPopupMode] = useState<number>(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    
    const [RefreshToken] = useMutation(Refresh, {
        onCompleted: (data) => {
            if (data.refresh) {
                localStorage.setItem("accessToken", data.refresh.accessToken);
                setAccessToken(data.refresh.accessToken);
                console.log("RefreshToken Success");
            } else {
                console.error("Refresh failed: No access token returned");
            }
        },
        onError: (err) => {
            console.error("Error:", err.message);
            handleLogout();
        },
    });

    const { data: markingData, loading: markingsLoad, error: error1, refetch } = useQuery(GetAllMarkings, {
        context: {
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
        },
    });
    
    const { data: Regions, loading, refetch: updateRegion } = useQuery(GetAllRegion);

    const fetchMarkings = () => {
        refetch();
        updateRegion();
    };

    useEffect(() => {
        fetchMarkings();
    }, [accessToken]);

    const checkLoginStatus = useCallback(() => {
        const token = localStorage.getItem("accessToken");
        setAccessToken(token);
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        checkLoginStatus();
        window.addEventListener("storage", checkLoginStatus);
        return () => window.removeEventListener("storage", checkLoginStatus);
    }, [checkLoginStatus]);

    useEffect(() => {
        const refreshTokenPeriodically = async () => {
            const refreshToken = "Bearer " + localStorage.getItem("refreshToken");
            const userId = localStorage.getItem("userId");

            if (!refreshToken || !userId) {
                console.error("Refresh token or userId not found");
                return;
            }

            try {
                await RefreshToken({
                    variables: { refreshToken, userId },
                });
            } catch (error) {
                console.error("Token refresh failed:", error);
                handleLogout();
            }
        };

        refreshTokenPeriodically();
        const intervalId = setInterval(refreshTokenPeriodically, 14 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [RefreshToken]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        setAccessToken(null);
        setIsLoggedIn(false);
    };

    const openPopup = (mode: number) => {
        setPopupMode(mode);
    };

    const closePopup = () => {
        setPopupMode(0);
    };

    if (markingsLoad || loading) {
        return <div>Loading...</div>;
    }

    if (error1) {
        return <div>Error: {error1.message}</div>;
    }

    if (!markingData?.getAllMarkings) {
        return (
            <div>
                <p>No data available</p>
                <button onClick={fetchMarkings}>Retry</button>
            </div>
        );
    }
    
    return (
        <div>
            {popupMode === 1 && (
                <Popup
                    mode={popupMode}
                    onClose={closePopup}
                    setIsLoggedIn={(status: boolean) => {
                        setIsLoggedIn(status);
                        if (status) {
                            closePopup();
                        }
                    }}
                    fetchMarkings={fetchMarkings}
                />
            )}
            <SideBar
                data={markingData.getAllMarkings}
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
                activeOption={activeOption}
                setActiveOption={setActiveOption}
                openPopup={openPopup}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                fetchMarkings={fetchMarkings}
                regions={Regions}
                updateRegion={updateRegion}
            />
            <KaKaoMap
                data={markingData.getAllMarkings}
                setSelectedCard={setSelectedCard}
                setActiveOption={setActiveOption}
            />
        </div>
    );
}
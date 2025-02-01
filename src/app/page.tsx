"use client";

import { useState, useEffect } from "react";
import KaKaoMap from "@/components/KaKaoMap";
import SideBar from "@/components/SideBar";
import Popup from "@/components/PopUp";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMutation, useQuery } from "@apollo/client";
import { GetAllMarkings } from "../graphql/query";
import { Refresh } from "@/graphql/mutations";

export default function Main() {
    const [selectedCard, setSelectedCard] = useState<any | null>(null);
    const [activeOption, setActiveOption] = useState<number | null>(null);
    const [popupMode, setPopupMode] = useState<number>(0);
    const [isMarkerMode, setIsMarkerMode] = useState(false);
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
            headers: {
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
        },
    });

    const fetchMarkings = () => {
        refetch();
    };

    useEffect(() => {
        fetchMarkings();
    }, [markingData]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setAccessToken(token);
        setIsLoggedIn(!!token);

        const checkLoginStatus = () => {
            const token = localStorage.getItem("accessToken");
            setAccessToken(token);
            setIsLoggedIn(!!token);
        };

        window.addEventListener("storage", checkLoginStatus);
        return () => window.removeEventListener("storage", checkLoginStatus);
    }, []);

    useEffect(() => {
        const refreshTokenPeriodically = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
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

        refreshTokenPeriodically(); // 초기 실행
        const intervalId = setInterval(refreshTokenPeriodically, 14 * 60 * 1000); // 14분마다 실행

        return () => clearInterval(intervalId); // cleanup
    }, [RefreshToken]);

    // 로그아웃 처리
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        setAccessToken(null);
        setIsLoggedIn(false);
    };

    // 팝업 열기
    const openPopup = (mode: number) => {
        setPopupMode(mode);
    };

    // 팝업 닫기
    const closePopup = () => {
        setPopupMode(0);
    };

    // 로딩 중일 때
    if (markingsLoad) {
        return <div>Loading...</div>;
    }

    // 에러 발생 시
    if (error1) {
        return <div>Error: {error1.message}</div>;
    }

    // 데이터가 없을 때
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
                setIsMarkerMode={setIsMarkerMode}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                fetchMarkings={fetchMarkings}
            />
            <KaKaoMap
                data={markingData.getAllMarkings}
                setSelectedCard={setSelectedCard}
                setActiveOption={setActiveOption}
                isMarkerMode={isMarkerMode}
            />
        </div>
    );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { Map } from "react-kakao-maps-sdk";
import styled from "styled-components";
import Marker1 from "./Marker";

interface Location {
    latitude: number;
    longitude: number;
}

interface Marking {
    id: string;
    category: string;
    content: string;
    createdAt: string;
    isApproved: boolean;
    poster: string;
    regionId: string;
    title: string;
    location: Location;
}

function KaKaoMap({
    data,
    setSelectedCard,
    setActiveOption,
}: {
    data: Marking[];
    setSelectedCard: (card: Marking) => void;
    setActiveOption: (option: number) => void;
}) {
    const mapRef = useRef<kakao.maps.Map | null>(null);
    const [location, setLocation] = useState({ lat: 37.5665, lng: 126.978 });
    const validData = Array.isArray(data) ? data : [];

    useEffect(() => {
        if (typeof window !== "undefined" && window.kakao) {
            window.kakao.maps.load(() => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            setLocation({ lat: latitude, lng: longitude });
                        },
                        (err) => {
                            console.log(err.message);
                        },
                        { enableHighAccuracy: true, maximumAge: 0 }
                    );
                } else {
                    console.log("Geolocation is not supported by your browser.");
                }
            });
        } else {
            console.log("Kakao Maps SDK is not loaded properly.");
        }
    }, []);

    const handlePanTo = (item: Marking) => {
        if (mapRef.current && item.location && window.kakao) {
            const { kakao } = window;
            setActiveOption(item.category === "TRASH" ? 0 : 1);
            setSelectedCard(item);

            const moveLatLng = new kakao.maps.LatLng(
                item.location.latitude,
                item.location.longitude
            );
            mapRef.current.panTo(moveLatLng);
        }
    };

    return (
        <Container>
            <Map
                center={location}
                style={{ width: "100%", height: "100%" }}
                level={3}
                onCreate={(map) => (mapRef.current = map)}
            >
                {validData.map((item: Marking, index: number) => {
                    if (item?.location) {
                        let MarkerComponent = item.category === "TRASH" ? 1 : 2;
                        if(!item.isApproved) 
                            MarkerComponent = MarkerComponent + 2;
                        return (
                            <Marker1
                                key={`data-${index}`}
                                location={{
                                    lat: item.location.latitude,
                                    lng: item.location.longitude,
                                }}
                                onClick={() => handlePanTo(item)}
                                type={MarkerComponent}
                            />
                        );
                    }
                    return null;
                })}
            </Map>
        </Container>
    );
}

export default KaKaoMap;

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
`;

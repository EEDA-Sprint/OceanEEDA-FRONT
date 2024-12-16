"use client";

import { useState, useEffect, useRef } from "react";
import { Map } from "react-kakao-maps-sdk";
import styled from "styled-components";
import KakaoMarker from "./KaKaoMarker";

function KaKaoMap() {
    const [location, setLocation] = useState({ lat: 37.5665, lng: 126.9780 });
    const [error, setError] = useState<string | null>(null);
    const mapRef = useRef<kakao.maps.Map | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                },
                (err) => {
                    setError(err.message);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);

    const handlePanTo = (lat: number, lng: number) => {
        if (mapRef.current) {
            const moveLatLng = new kakao.maps.LatLng(lat, lng);
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
                <KakaoMarker location={location} />
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

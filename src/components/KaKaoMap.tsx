"use client";

import { useEffect, useRef, useState } from "react";
import { Map } from "react-kakao-maps-sdk";
import styled from "styled-components";
import Marker1 from "./Marker1";
import Marker2 from "./Marker2";

function KaKaoMap({ data, setSelectedCard, setActiveOption }: { data: any, setSelectedCard: any, setActiveOption: any }) {
    const mapRef = useRef<kakao.maps.Map | null>(null);
    const [location, setLocation] = useState({ lat: 37.5665, lng: 126.9780 });

    useEffect(() => {
        if (typeof window !== "undefined" && navigator.geolocation) {
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
    }, []);


    const handlePanTo = (data: any) => {
        if (mapRef.current) {
            setActiveOption(1);
            setSelectedCard(data);

            const moveLatLng = new kakao.maps.LatLng(data.location.lat, data.location.lng);
            mapRef.current.panTo(moveLatLng, 32);
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
                {
                    data.map((item: any, index: number) => (
                        <Marker1
                            key={index}
                            location={item.location}
                            onClick={() => handlePanTo(item)}
                        />
                    ))
                }
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

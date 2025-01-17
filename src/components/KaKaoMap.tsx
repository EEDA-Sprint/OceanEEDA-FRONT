"use client";

import { useEffect, useRef, useState } from "react";
import { Map } from "react-kakao-maps-sdk";
import styled from "styled-components";
import Marker1 from "./Marker1";
import Marker2 from "./Marker2";

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
    isMarkerMode
}: {
    data: Marking[];
    setSelectedCard: (card: Marking) => void;
    setActiveOption: (option: number) => void;
    isMarkerMode: boolean;
}) {
    const mapRef = useRef<kakao.maps.Map | null>(null);
    const [location, setLocation] = useState({ lat: 37.5665, lng: 126.978 });
    const [customMarkers, setCustomMarkers] = useState<any[]>([]);

    const validData = Array.isArray(data) ? data : [];

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

    const handlePanTo = (item: Marking) => {
        if (mapRef.current && item.location) {
            setActiveOption(1);
            setSelectedCard(item);

            const moveLatLng = new kakao.maps.LatLng(
                item.location.longitude,
                item.location.latitude
            );
            mapRef.current.panTo(moveLatLng);
        }
    };

    const handleMapClick = (_: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
        if (isMarkerMode) {
            const clickLatLng = mouseEvent.latLng;
            const newLocation = { 
                lat: clickLatLng.getLat(), 
                lng: clickLatLng.getLng() 
            };
            setCustomMarkers([newLocation]);
        }
    };

    return (
        <Container>
            <Map
                center={location}
                style={{ width: "100%", height: "100%" }}
                level={3}
                onCreate={(map) => (mapRef.current = map)}
                onClick={handleMapClick}
            >
                {validData.map((item: Marking, index: number) => {
                    if (item?.location) {
                        const MarkerComponent = item.category === 'TRASH' ? Marker1 : Marker2;
                        return (
                            <MarkerComponent
                                key={`data-${index}`}
                                location={{
                                    lat: item.location.longitude,
                                    lng: item.location.latitude
                                }}
                                onClick={() => handlePanTo(item)}
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

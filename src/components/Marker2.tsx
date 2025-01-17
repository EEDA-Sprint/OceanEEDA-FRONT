import { MapMarker } from "react-kakao-maps-sdk";

interface Location {
    lat: number;
    lng: number;
}

export default function Marker2({ location, onClick }: {location: Location; onClick: () => void;}) {
    return (
        <MapMarker
            position={location}
            image={{
                src: "/Bubble2.png",
                size: {
                    width: 80,
                    height: 80,
                },
                options: {
                    offset: {
                        x: 40,
                        y: 70,
                    },
                },
            }}
            onClick={onClick}
        />
    )
}
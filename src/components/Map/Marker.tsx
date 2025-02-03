import { MapMarker } from "react-kakao-maps-sdk";

interface Location {
    lat: number;
    lng: number;
}

export default function Marker1({ location, onClick, type }: {location: Location; onClick: () => void; type:any}) {
    return (
        <MapMarker
            position={location}
            image={{
                src: type === 1 ? "/Bubble1.png" : 
                    type === 2 ? "/Bubble2.png" :
                    type === 3 ? "/Bubble3.png" : "/Bubble4.png",
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
import { useState } from "react";
import styled from "styled-components";
import Card from "./Card";
import { GoPencil } from "react-icons/go";
import Create from "./Create";

export default function CardList2({ cardData, setSelectedCard, setIsMarkerMode, isLoggedIn }: {
    cardData: any[];
    setSelectedCard: (card: any) => void;
    setIsMarkerMode: (mode: boolean) => void;
    isLoggedIn: any;
}) {
    const [isActive, setIsActive] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [markerLocation, setMarkerLocation] = useState<{ lat: number, lng: number } | null>(null);

    const handleWriteClick = () => {
        setIsActive(!isActive);
        setIsMarkerMode(!isActive);
        if (!isActive) {
            setShowCreate(true);
        }
    };

    const handleClose = () => {
        setShowCreate(false);
        setIsActive(false);
        setIsMarkerMode(false);
        setMarkerLocation(null);
    };

    return (
        <>
            {showCreate && (
                <Create
                    onClose={handleClose}
                    markerLocation={markerLocation || undefined}
                />
            )}
            {
                isLoggedIn && 
                <Write $isActive={isActive} onClick={handleWriteClick}>
                    <GoPencil />
                </Write>
            }
            <CardList>
                {cardData.map((data: any, index: number) => (
                    data.isApproved && data.category === 'ART' &&
                    <Card
                        key={index}
                        data={data}
                        role={"normal"}
                        onClick={() => setSelectedCard(data)}
                    />
                ))}
            </CardList>
        </>
    );
}

const CardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    flex-grow: 1;
    cursor: pointer;
`;

const Write = styled.div<{ $isActive: boolean }>`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 30px;
    right: 30px;
    bottom: 20px;
    width: 60px;
    height: 60px;
    background-color: ${props => props.$isActive ? '#ff4444' : '#008E88'};
    border-radius: 100%;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    z-index: 99;
    cursor: pointer;
    transition: background-color 0.3s ease;
`;
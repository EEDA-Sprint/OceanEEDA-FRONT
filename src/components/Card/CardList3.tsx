import styled from "styled-components";
import Card from "./Card";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import RegionAdd from "../RegionAdd";


interface CardItem {
    region: string;
    type: string;
    name: string;
    description: string;
}

export default function CardList3({ cardData, setSelectedCard, fetchMarkings, regions, updateregion }: {
    cardData: CardItem[];
    setSelectedCard: (card: CardItem) => void;
    fetchMarkings: () => void;
    regions: any;
    updateregion: any;
}) {
    const [isActive, setIsActive] = useState(false);

    const handleWriteClick = () => {
        setIsActive(!isActive);
    };

    const handleClose = () => {
        setIsActive(false);
    };

    useEffect(() => {
        fetchMarkings();
    }, []);

    return (
        <>
            {
                isActive &&
                <RegionAdd onClose={handleClose} regions={regions} updateregion={updateregion}/>
            }
            <Write onClick={handleWriteClick}>
                <FaMapMarkerAlt />
            </Write>
            <Title>승인 대기 중인 게시물 / 작품</Title>
            <CardList>
                {cardData.map((data: any, index: number) => (
                    !data.isApproved &&
                    <Card
                        key={index}
                        data={data}
                        role={"admin"}
                        onClick={() => setSelectedCard(data)}
                        fetchMarkings={fetchMarkings}
                        regions={regions}
                    />
                ))}
            </CardList>
        </>

    )
}

const CardList = styled.div`
    display: flex;
    margin-top: 60px;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    flex-grow: 1;
    cursor: pointer;
`;

const Title = styled.h1`
    position: absolute;
    padding: 16px;
    top: 90px;
    left: 0px;
    color: black;
    font-weight: 600;
    justify-content: center;    
    background-color: #ffffff;
    font-size: 25px;
    width: 400px;
    height: 60px;
`

const Write = styled.div`
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
    background-color: #008E88;
    border-radius: 100%;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    z-index: 99;
    cursor: pointer;
    transition: background-color 0.3s ease;
`;
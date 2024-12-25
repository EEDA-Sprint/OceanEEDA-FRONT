import styled from "styled-components";
import Card from "./Card";
import { GoPencil } from "react-icons/go";

interface CardItem {
    region: string;
    type: string;
    name: string;
    description: string;
}

export default function CardList2({ cardData, setSelectedCard }: {
    cardData: CardItem[];
    setSelectedCard: (card: CardItem) => void;
}) {
    return (
        <>
            <Write><GoPencil /></Write>
            <CardList>
                {cardData.map((data: CardItem, index: number) => (
                    <Card
                        key={index}
                        data={data}
                        role={"normal"}
                        onClick={() => setSelectedCard(data)}
                    />
                ))}
            </CardList>
        </>

    )
}

const CardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    flex-grow: 1;
    cursor: pointer;
`;

const Write = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 30px;
    right: 30px;
    bottom: 40px;
    width: 60px;
    height: 60px;
    background-color: #008E88;
    border-radius: 100%;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    z-index: 99;
`;
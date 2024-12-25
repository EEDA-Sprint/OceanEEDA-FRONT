import styled from "styled-components";
import Card from "./Card";

interface CardItem {
    region: string;
    type: string;
    name: string;
    description: string;
}

export default function CardList3({ cardData, setSelectedCard }: {
    cardData: CardItem[];
    setSelectedCard: (card: CardItem) => void;
}) {
    return (
        <>
            <Title>승인 대기 중인 게시물 / 작품</Title>
            <CardList>
                {cardData.map((data: CardItem, index: number) => (
                    <Card
                        key={index}
                        data={data}
                        role={"admin"}
                        onClick={() => setSelectedCard(data)}
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

const Title = styled.h1 `
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

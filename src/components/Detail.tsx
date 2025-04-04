import styled from "styled-components";

export default function Detail({ selectedCard, regions }: { selectedCard: any, regions: any }) {
    return (
        <DetailView>
            <Tags>
                <Tag>
                    #{regions.getAllRegions.find(region => region.id === selectedCard.regionId)?.name || "알 수 없음"}
                </Tag>

                {selectedCard.trashTypes.map((type: string, index: number) => (
                    <Tag key={index}>#{type}</Tag>
                ))}
            </Tags>

            <TitleWrapper>
                <DetailTitle>{selectedCard.title}</DetailTitle>
                <DetailSubtitle>조사자: {selectedCard.poster}</DetailSubtitle>
            </TitleWrapper>

            <DetailDescription>
                {selectedCard.content}
            </DetailDescription>
        </DetailView>
    )
}

const DetailView = styled.div`
    padding: 20px;
    background-color: #ffffff;
    flex-grow: 1;
    color: black;
    overflow-y: auto;
`;

const Tags = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
`;

const Tag = styled.div`
    padding: 6px 12px;
    background-color: #D9D9D9;
    color: white;
    font-size: 0.9rem;
    border-radius: 15px;
    font-weight: 600;
`;

const TitleWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    align-items: baseline;
    margin-bottom: 16px;
`;

const DetailTitle = styled.h2`
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
`;

const DetailSubtitle = styled.p`
    font-size: 1rem;
    font-weight: 600;
    color: #000000;
    margin: 0;
`;

const DetailDescription = styled.p`
    font-size: 0.95rem;
    line-height: 1.6;
    color: #333;
    white-space: pre-line;
`;

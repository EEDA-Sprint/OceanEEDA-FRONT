"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import { MapIcon, StarIcon, SliderIcon } from "./Icons";
import { FaAngleLeft } from "react-icons/fa6";
import SearchBar from "./SearchBar";
import CardList1 from "./CardList1";
import CardList2 from "./CardList2";
import CardList3 from "./CardList3";
import Detail from "./Detail";
import SlideShow from "./Slide";

export default function SideBar({ data, selectedCard, setSelectedCard, activeOption, setActiveOption }: 
    {data:any, selectedCard:any, setSelectedCard:any, activeOption:any, setActiveOption:any}) { 

    const handleItemClick = (index: number) => {
        if (activeOption === index) {
            setActiveOption(null);
            setSelectedCard(null);
        } else {
            setActiveOption(index);
        }
    };

    return (
        <>
            <SidebarContainer>
                <SidebarHeader>OCEAN EEDA</SidebarHeader>
                <SidebarMenu>
                    <SidebarItem
                        onClick={() => handleItemClick(0)}
                        $active={activeOption === 0}
                    >
                        <MapIcon size={40} act={activeOption === 0} />
                        <Text>지도</Text>
                    </SidebarItem>
                    <SidebarItem
                        onClick={() => handleItemClick(1)}
                        $active={activeOption === 1}
                    >
                        <StarIcon size={30} act={activeOption === 1} />
                        <Text>작품</Text>
                    </SidebarItem>
                    <SidebarItem
                        onClick={() => handleItemClick(2)}
                        $active={activeOption === 2}
                    >
                        <SliderIcon size={30} act={activeOption === 2} />
                        <Text>관리</Text>
                    </SidebarItem>
                </SidebarMenu>
            </SidebarContainer>
            {activeOption !== null && (
                <DetailContainer>
                    <DetailHeader>
                        <SearchBar />
                    </DetailHeader>
                    {selectedCard &&
                        <SlideShow selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
                    }
                    {activeOption === 3 ?
                        <div></div>
                        :
                        <CardList>
                            {selectedCard ? (
                                <Detail selectedCard={selectedCard} />
                            ) : (
                                <>
                                {activeOption === 0 && <CardList1 cardData={data} setSelectedCard={setSelectedCard} />}
                                {activeOption === 1 && <CardList2 cardData={data} setSelectedCard={setSelectedCard} />}
                                {activeOption === 2 && <CardList3 cardData={data} setSelectedCard={setSelectedCard} />}
                                </>
                            )
                        }</CardList>
                    }
                    로그인
                </DetailContainer>
            )}
        </>
    );
}

const SidebarContainer = styled.div`
    width: 100px;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #ffffff;
    color: white;
    display: flex;
    flex-direction: column;
    z-index: 1000;
    border-right: 1px solid rgba(0, 142, 136, 0.4);
`;

const DetailContainer = styled.div`
    width: 400px;
    height: 103%;
    position: fixed;
    top: 0;
    left: 100px;
    background-color: rgb(247, 247, 247);
    color: white;
    display: flex;
    flex-direction: column;
    margin-bottom: 0px;
    z-index: 1000;
`;

const SidebarHeader = styled.div`
    color: #008e88;
    padding: 20px;
    height: 90px;
    font-size: 1rem;
    font-weight: 1000;
    text-align: right;
    border-bottom: 1px solid rgba(0, 142, 136, 0.4);
`;

const DetailHeader = styled.div`
    color: #008e88;
    padding: 20px;
    min-height: 90px;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-bottom: 1px solid rgba(0, 142, 136, 0.4);
    background-color: white;
`;

const SidebarMenu = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
`;

interface SidebarItemProps {
    $active: boolean;
}

const SidebarItem = styled.li.withConfig({
    shouldForwardProp: (prop) => prop !== "$active",
}) <SidebarItemProps>`
    color: black;
    width: 100px;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: ${(props) =>
        props.$active ? "rgba(0, 142, 136, 0.2)" : "transparent"};

    &:hover {
        background-color: rgba(0, 142, 136, 0.1);
    }
`;

const Text = styled.span`
    font-size: 0.9rem;
    font-weight: 600;
`;

const CardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    flex-grow: 1;
    cursor: pointer;
`;
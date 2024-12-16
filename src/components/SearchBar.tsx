"use client";

import styled from "styled-components";
import { BiSearch } from "react-icons/bi";

export default function SearchBar() {
    return (
        <SearchBarContainer>
            <SearchIcon>
                <BiSearch size={20} />
            </SearchIcon>
            <SearchInput placeholder="지역명을 입력해주세요" />
        </SearchBarContainer>
    );
}

const SearchBarContainer = styled.div`
    display: flex;
    align-items: center;
    width: 350px;
    margin: auto;
    padding: 10px 15px;
    background-color: #ffffff;
    border: 2px solid #000000;
    border-radius: 15px;
`;

const SearchInput = styled.input`
    flex: 1;
    border: none;
    outline: none;
    font-size: 1rem;
    color: #333;
    background: transparent;

    &::placeholder {
        color: rgba(0, 0, 0, 0.6);
    }
`;

const SearchIcon = styled.div`
    margin-left: 10px;
    margin-right: 10px;
    color: #000000;
`;

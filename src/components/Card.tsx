import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineMore } from "react-icons/ai";

interface CardProps {
  data: any
  role: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ data, role, onClick }) => {
  const [toggle, setToggle] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Container>
      <Body onClick={onClick}>
        <Avatar />
        <Box>
          <TagList>
            <Tag>{data.region}</Tag>
            <Tag>{data.type}</Tag>
          </TagList>
          <Name>{data.title}</Name>
          <Description>{data.description}</Description>
        </Box>
        {role === "admin" &&
          <>
            <Menu onClick={(e) => { e.stopPropagation(); setToggle(!toggle) }}>
              <AiOutlineMore />
            </Menu>
            {toggle && (
              <Popup ref={popupRef}>
                <PopupButton onClick={(e) => { e.stopPropagation(); alert("수정됨"); }}>수락하기</PopupButton>
                <PopupButton onClick={(e) => { e.stopPropagation(); alert("삭제됨"); }}>삭제하기</PopupButton>
              </Popup>
            )}
          </>
        }
      </Body>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  padding: 16px;
  font-family: Arial, sans-serif;
  margin: 0 auto;
  background-color: white;
  display: flex;
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tag = styled.span`
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  color: #333;
`;

const Body = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
`;

const Avatar = styled.div`
  position: absolute;
  top: 30px;
  width: 80px;
  height: 80px;
  background-color: #ccc;
`;

const Name = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
  color: black;
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 40px;
  min-height: 40px;
`;

const Menu = styled.button`
  top: 50px;
  cursor: pointer;
  color: #D9D9D9;
  font-size: 30px;
  font-weight: 600;
`;

const Popup = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 120px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: 10;
`;

const PopupButton = styled.button`
  width: 100%;
  padding: 8px;
  border: none;
  background-color: white;
  color: #333;
  font-size: 14px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Box = styled.div `
  margin-left: 100px;
`

export default Card;

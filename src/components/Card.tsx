import React from 'react';
import styled from 'styled-components';

interface CardProps {
    region: string;
    type: string;
    name: string;
    description: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ region, type, name, description, onClick }) => {
    return (
        <Container onClick={onClick}>
            <Body>
                <Avatar />
                <div>
                    <TagList>
                        <Tag>{region}</Tag>
                        <Tag>{type}</Tag>
                    </TagList>
                    <Name>{name}</Name>
                    <Description>{description}</Description>
                </div>
            </Body>
        </Container>
    );
};

const Container = styled.div`
  width: 100%;
  padding: 16px;
  font-family: Arial, sans-serif;
  margin: 0 auto;
  background-color: white;
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
`;

const Avatar = styled.div`
  width: 150px;
  height: 80px;
  margin: auto;
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
`;

export default Card;

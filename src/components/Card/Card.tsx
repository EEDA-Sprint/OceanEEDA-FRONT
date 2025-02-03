import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineMore } from "react-icons/ai";
import { useMutation } from "@apollo/client";
import { MarkingUpdate, MarkingDelete } from "../../graphql/mutations";
import { useApolloClient } from "@apollo/client";
import Modify from "../Modify";

interface CardProps {
  data: {
    id: string;
    regionId: string;
    title: string;
    content: string;
    trashTypes: string[];
    category: 'TRASH' | 'ART';
    isApproved: boolean;
    userId: string;
    location: { lat: number; lng: number };
    files: File[];
  };
  role: 'admin' | 'normal';
  onClick?: () => void;
  fetchMarkings: any;
  regions: any;
}

const Card: React.FC<CardProps> = ({ data, role, onClick, fetchMarkings, regions }) => {
  const imageFile: any = data.files.find((file: any) => file.path.match(/\.(jpeg|jpg|png|gif)$/i));
  const imageUrl = imageFile ? `${process.env.NEXT_PUBLIC_GRAPHQL_URI}${imageFile.path}` : undefined;
  const [toggle, setToggle] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [isModifyOpen, setModifyOpen] = useState(false);
  const [updateMarking] = useMutation(MarkingUpdate, {
    onCompleted: () => {
      alert("수락되었습니다");
      client.refetchQueries({
        include: ['GetMarkings', 'GetPendingMarkings'],
      });
      setToggle(false);
    },
    onError: (error) => {
      console.error('Error:', error);
      alert("오류가 발생했습니다");
    }
  });
  const [deleteMarking] = useMutation(MarkingDelete, {
    onCompleted: () => {
      alert("삭제되었습니다");
      fetchMarkings();
    },
    onError: (error) => {
      console.error('Error:', error);
      alert("오류가 발생했습니다");
    }
  });
  const client = useApolloClient();

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

  const handleAccept = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("Authorization token not found");
      }

      await updateMarking({
        variables: {
          id: data.id,
          isApproved: true
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });
      fetchMarkings();
    } catch (error) {
      console.error('Error:', error);
      alert("오류가 발생했습니다");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteMarking({
        variables: {
          id: data.id
        },
        context: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      });
      fetchMarkings();
    } catch (error) {
      console.error('Error:', error);
      alert("오류가 발생했습니다");
    }
  };

  const handleModify = () => {
    setModifyOpen(true);
  };

  return (
    <>
      <Container>
        <Body onClick={onClick}>
          <Avatar $imageUrl={imageUrl} />
          <Box>
            <TagList>
              <Tag>
                {regions.getAllRegions.find(region => region.id === data.regionId)?.name || "알 수 없음"}
              </Tag>
              {data.trashTypes?.slice(0, 2).map((type, index) => (
                <Tag key={index}>{type}</Tag>
              ))}
            </TagList>
            <Name>{data.title}</Name>
            <Description>{data.content}</Description>
          </Box>
          {role === "admin" ?
            <>
              <Menu onClick={(e) => { e.stopPropagation(); setToggle(!toggle) }}>
                <AiOutlineMore />
              </Menu>
              {toggle && (
                <Popup ref={popupRef}>
                  <PopupButton onClick={handleAccept}>수락하기</PopupButton>
                  <PopupButton onClick={handleDelete}>삭제하기</PopupButton>
                </Popup>
              )}
            </>
            :
            <>
              {(
                data.userId === localStorage.getItem("userId") ||
                localStorage.getItem("userRole") === "ADMIN"
              ) && (
                  <>
                    <Menu onClick={(e) => { e.stopPropagation(); setToggle(!toggle) }}>
                      <AiOutlineMore />
                    </Menu>
                    {toggle && (
                      <Popup ref={popupRef}>
                        <PopupButton onClick={(e) => { e.stopPropagation(); handleModify(); }}>수정하기</PopupButton>
                        <PopupButton onClick={handleDelete}>삭제하기</PopupButton>
                      </Popup>
                    )}
                  </>
                )}
            </>
          }
        </Body>
      </Container>
      {isModifyOpen && (
        <>
          <Modify
            onClose={() => setModifyOpen(false)}
            initialData={{
              region: data.regionId,
              type: data.category,
              trashTypes: data.trashTypes.join(', '),
              title: data.title,
              description: data.content,
              location: data.location,
              files: data.files,
              id: data.id,
            }}
            fetchMarkings={fetchMarkings}
            regions={regions}
          />
        </>
      )}
    </>
  );
};

const Container = styled.div`  position: relative;
  width: 100%;
  height: 150px;
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

const Avatar = styled.div<{ $imageUrl?: string }>`
  position: absolute;
  top: 30px;
  width: 80px;
  height: 80px;
  background-color: #ccc;
  background-image: ${({ $imageUrl }) => ($imageUrl ? `url(${$imageUrl})` : 'none')};
  background-size: cover;
  background-position: center;
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
  position: absolute;
  top: 10px;
  right: 10px;
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

const Box = styled.div`
  margin-left: 100px;
`

export default Card;


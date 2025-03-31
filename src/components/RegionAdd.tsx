import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { AddRegion, deleteRegion } from "@/graphql/mutations";
import { GetAllRegion } from "@/graphql/query";
import { useQuery } from "@apollo/client";

const RegionAdd = ({ onClose, regions, updateregion }: {
    onClose: () => void;
    regions: any;
    updateregion: any;
}) => {
    const [name, setName] = useState("");
    const [addRegion, { loading: loading1 }] = useMutation(AddRegion);
    const [removeRegion, { loading: loading2 }] = useMutation(deleteRegion);

    const load = () => loading1 || loading2;

    const handleAddRegion = async () => {
        if (name.trim() === "") return;
        try {
            await addRegion({
                variables: { name },
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            });
            setName("");
            updateregion();
        } catch (error) {
            console.error("지역 추가 실패:", error);
        }
    };

    const handleDeleteRegion = async (id: string) => {
        if (id.trim() === "") return;
        try {
            await removeRegion({
                variables: { id },
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            });
            updateregion();
        } catch (error) {
            console.error("지역 삭제 실패:", error);
        }
    };

    return (
        <Overlay onClick={load() ? (e) => e.stopPropagation() : onClose}>
            <PopupContainer onClick={(e) => e.stopPropagation()}>
                <Title>OceanEEDA</Title>
                <InputContainer>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="추가할 지역 이름 입력"
                    />
                    <AddButton onClick={handleAddRegion} disabled={load()}>{loading1 ? "추가 중..." : "추가"}</AddButton>
                </InputContainer>
                <ListContainer>
                    {regions.getAllRegions.map((region: { id: string; name: string }) => (
                        <ListItem key={region.id}>
                            {region.name}
                            <DeleteButton onClick={() => handleDeleteRegion(region.id)} disabled={load()}>{loading2 ? "삭제 중..." : "삭제"}</DeleteButton>
                        </ListItem>
                    ))}
                </ListContainer>
            </PopupContainer>
        </Overlay>
    );
};

export default RegionAdd;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 120;
`;

const PopupContainer = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 650px;
  padding: 50px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.p`
  color: #008e88;
  font-size: 2rem;
  font-weight: 1000;
  text-align: center;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: black;
`;

const AddButton = styled.button`
  padding: 10px 15px;
  font-size: 1rem;
  background: #008e88;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ListContainer = styled.ul`
  list-style: none;
  padding: 0;
  height: 300px;
  overflow-y: auto;
  border-radius: 5px;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f0f0;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  color: black;
`;

const DeleteButton = styled.button`
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

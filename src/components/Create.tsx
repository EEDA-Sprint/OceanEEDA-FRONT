import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useMutation } from "@apollo/client";
import { MarkingAdd } from "../graphql/mutations";
import { CategoryType } from "@/graphql/enum";

const Create = ({ onClose, markerLocation }: { 
    onClose: any,
    markerLocation?: { lat: number, lng: number } 
}) => {
    const [step, setStep] = useState(1);
    const [newEntry, setNewEntry] = useState({
        region: "",
        type: "",
        trashTypes: "",
        title: "",
        name: "",
        description: "",
        location: markerLocation || { lat: 37.5665, lng: 126.978 },
        video: "",
    });

    const [addMarking, { loading, error }] = useMutation(MarkingAdd, {
        onCompleted: () => {
            alert("등록이 완료되었습니다!");
            onClose();
        },
        onError: (err) => {
            console.error("Error:", err.message);
            alert("등록 중 오류가 발생했습니다.");
        },
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setNewEntry((prev) => ({
                        ...prev,
                        location: { lat: latitude, lng: longitude },
                    }));
                },
                (err) => console.error("Geolocation Error:", err.message),
                { enableHighAccuracy: true, maximumAge: 0 }
            );
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewEntry((prev) => ({ ...prev, [name]: value }));
    };

    const handleMapClick = (_: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
        const clickLatLng = mouseEvent.latLng;
        setNewEntry((prev) => ({
            ...prev,
            location: { lat: clickLatLng.getLat(), lng: clickLatLng.getLng() },
        }));
    };

    const handleNext = () => {
        if (!newEntry.region || !newEntry.type || !newEntry.title) {
            alert("필수 정보를 입력해주세요!");
            return;
        }
        setStep(2);
    };
    
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            console.log(token);
            if (!token) {
                throw new Error("Authorization token not found");
            }

            const trashTypesArray = newEntry.trashTypes
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== '');

            await addMarking({
                variables: {
                    userId: "1",
                    regionId: newEntry.region,
                    category: newEntry.type as CategoryType,
                    content: newEntry.description,
                    isApproved: false,
                    latitude: newEntry.location.lat, 
                    longitude: newEntry.location.lng,
                    title: newEntry.title,
                    trashTypes: trashTypesArray,
                    poster: newEntry.name,
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            });
        } catch (err) {
            console.error("Mutation Error:", err);
            alert("등록 중 오류가 발생했습니다: " + err);
        }
    };

    return (
        <Overlay onClick={onClose}>
            <PopupContainer onClick={(e) => e.stopPropagation()}>
                {step === 1 ? (
                    <>
                        <Title>정보 입력</Title>
                        <Subtitle>등록하실 정보를 입력해주세요!</Subtitle>
                        
                        <Select name="region" value={newEntry.region} onChange={handleInputChange}>
                            <option value="">지역 선택 *</option>
                            <option value="서울">서울</option>
                            <option value="부산">부산</option>
                            <option value="인천">인천</option>
                        </Select>

                        <Select name="type" value={newEntry.type} onChange={handleInputChange}>
                            <option value="">유형 선택 *</option>
                            <option value="TRASH">쓰레기</option>
                            <option value="ART">작품</option>
                        </Select>
                        <Input
                                type="text"
                                name="trashTypes"
                                placeholder="쓰레기 종류 (예: 플라스틱, 캔 등)"
                                value={newEntry.trashTypes}
                                onChange={handleInputChange}
                            />
                        <Input
                            type="text"
                            name="title"
                            placeholder="제목 *"
                            value={newEntry.title}
                            onChange={handleInputChange}
                        />

                        <Input
                            type="text"
                            name="name"
                            placeholder="작성자"
                            value={newEntry.name}
                            onChange={handleInputChange}
                        />

                        <TextArea
                            name="description"
                            placeholder="설명"
                            value={newEntry.description}
                            onChange={handleInputChange}
                        />

                        <Button onClick={handleNext} disabled={loading}>
                            {loading ? "로딩 중..." : "다음"}
                        </Button>
                        <Footer>
                            <a onClick={onClose}>등록 취소</a>
                        </Footer>
                    </>
                ) : (
                    <>
                        <Title>위치 선택</Title>
                        <Subtitle>지도를 클릭하여 위치를 선택해주세요!</Subtitle>
                        <MapContainer>
                            <Map
                                center={newEntry.location}
                                style={{ width: "100%", height: "100%" }}
                                level={3}
                                onClick={handleMapClick}
                            >
                                <MapMarker
                                    position={newEntry.location}
                                    image={{
                                        src: "/Bubble2.png",
                                        size: { width: 80, height: 80 },
                                        options: { offset: { x: 40, y: 70 } },
                                    }}
                                />
                            </Map>
                        </MapContainer>
                        <LocationText>
                            선택된 위치: {newEntry.location.lat.toFixed(6)}, {newEntry.location.lng.toFixed(6)}
                        </LocationText>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "등록 중..." : "등록하기"}
                        </Button>
                        {error && <ErrorText>오류 발생: {error.message}</ErrorText>}
                        <Footer>
                            <a onClick={() => setStep(1)}>뒤로가기</a>
                        </Footer>
                    </>
                )}
            </PopupContainer>
        </Overlay>
    );
};

export default Create;

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
  height: auto;
  padding: 50px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const Title = styled.p`
  color: #008e88;
  height: 60px;
  font-size: 2rem;
  font-weight: 1000;
  text-align: center;
`;

const Subtitle = styled.p`
  font-family: "Arial", sans-serif;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  background-color: #F2F2F2;
  border: none;
  border-radius: 5px;
  color: black;
  &::placeholder {
    color: #999999;
  }
`;

const Button = styled.button`
  width: 90%;
  padding: 10px;
  background-color: #008080;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #006666;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 10px;

  a {
    color: #008080;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const MapContainer = styled.div`
    width: 90%;
    height: 300px;
    margin: 20px auto;
    border-radius: 10px;
    overflow: hidden;
`;

const LocationText = styled.div`
    color: #666;
    margin-bottom: 20px;
    font-size: 14px;
`;

const ErrorText = styled.div`
    color: red;
    margin-top: 10px;
    font-size: 14px;
`;

const Select = styled.select`
    width: 90%;
    padding: 10px;
    margin: 10px 0;
    background-color: #F2F2F2;
    border: none;
    border-radius: 5px;
    color: black;
    cursor: pointer;

    &:focus {
        outline: none;
    }
`;

const TextArea = styled.textarea`
    width: 90%;
    padding: 10px;
    margin: 10px 0;
    background-color: #F2F2F2;
    border: none;
    border-radius: 5px;
    color: black;
    min-height: 100px;
    resize: vertical;

    &::placeholder {
        color: #999999;
    }
`;

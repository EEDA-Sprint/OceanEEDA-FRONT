import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useMutation } from "@apollo/client";
import { MarkingAdd } from "../graphql/mutations";
import { AddFiles } from "../graphql/mutations";

interface CreateProps {
    onClose: () => void;
    markerLocation?: { lat: number; lng: number };
    regions: any;
}

interface NewEntry {
    region: string;
    type: string;
    trashTypes: string;
    title: string;
    name: string;
    description: string;
    location: { lat: number; lng: number };
    files: File[];
}

interface PreviewUrls {
    files: Array<{ url: string; type: 'image' | 'video' }>;
}

const Create = ({ onClose, markerLocation, regions }: CreateProps) => {
    const [step, setStep] = useState(1);
    const [previewUrls, setPreviewUrls] = useState<PreviewUrls>({
        files: []
    });
    const [newEntry, setNewEntry] = useState<NewEntry>({
        region: "",
        type: "",
        trashTypes: "",
        title: "",
        name: "",
        description: "",
        location: markerLocation || { lat: 37.5665, lng: 126.978 },
        files: []
    });

    const [uploadMarking, { loading: load1 }] = useMutation(MarkingAdd);
    const [uploadFiles, { loading: load2}] = useMutation(AddFiles);

    const Load = () => {
        return load1 || load2
    }

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        setNewEntry(prev => ({
            ...prev,
            files: [...prev.files, ...newFiles]
        }));

        const newUrls = newFiles.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('image/') ? 'image' : 'video' as 'image' | 'video'
        }));
        setPreviewUrls(prev => ({
            files: [...prev.files, ...newUrls]
        }));
    };

    const removeFile = (index: number) => {
        setNewEntry(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
        setPreviewUrls(prev => ({
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const handleMapClick = (_: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
        const clickLatLng = mouseEvent.latLng;
        setNewEntry((prev) => ({
            ...prev,
            location: { lat: clickLatLng.getLat(), lng: clickLatLng.getLng() },
        }));
    };

    const validateForm = () => {
        if (!newEntry.region || !newEntry.type || !newEntry.title) {
            alert("필수 정보를 입력해주세요!");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateForm()) {
            setStep(2);
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const userName = localStorage.getItem('userName');

            if (!token) throw new Error("Authorization token not found");
            if (!userName) throw new Error("User name not found");

            const trashTypesArray = newEntry.trashTypes
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== '');

            const files = newEntry.files
            const result = await uploadFiles({
                variables: {
                    files: files
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            });
            const paths: string[] = result.data.uploadFile.paths;

            const fileInputs = paths.map((path, index) => ({
                name: `file_${index}`,
                order: index+1,
                path: path
            }));

            const latitude = newEntry.location.lat;
            const longitude = newEntry.location.lng;

            if (typeof latitude !== 'number' || typeof longitude !== 'number') {
                throw new Error("Invalid latitude or longitude");
            }

            const result2 = await uploadMarking({
                variables: {
                    regionId: newEntry.region || '',
                    category: newEntry.type,
                    content: newEntry.description,
                    trashTypes: trashTypesArray,
                    title: newEntry.title,
                    poster: userName,
                    latitude: latitude,
                    longitude: longitude,
                    files: fileInputs,
                    isApproved: localStorage.getItem("userRole") === "ADMIN"
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            });
            alert("업로드 성공!");
            onClose();
        } catch (err) {
            console.error("Error:", err instanceof Error ? err.message : err);
            alert(err instanceof Error ? err.message : "알 수 없는 오류");
        }
    };

    return (
        <Overlay onClick={Load() ? (e) => e.stopPropagation() : onClose}>
            <PopupContainer onClick={(e) => e.stopPropagation()}>
                {step === 1 ? (
                    <>
                        <Title>정보 입력</Title>
                        <Subtitle>등록하실 정보를 입력해주세요!</Subtitle>

                        <Select name="region" value={newEntry.region} onChange={handleInputChange}>
                            <option value="">지역 선택 *</option>
                            {
                                regions.getAllRegions.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))
                            }
                        </Select>

                        <Select name="type" value={newEntry.type} onChange={handleInputChange}>
                            <option value="">유형 선택 *</option>
                            <option value="TRASH">쓰레기</option>
                            <option value="ART">작품</option>
                        </Select>

                        <Input
                            type="text"
                            name="title"
                            placeholder="제목 *"
                            value={newEntry.title}
                            onChange={handleInputChange}
                        />

                        <TextArea
                            name="description"
                            placeholder="설명"
                            value={newEntry.description}
                            onChange={handleInputChange}
                        />

                        <Input
                            type="text"
                            name="trashTypes"
                            placeholder="쓰레기 종류 (예: 플라스틱, 캔 등)"
                            value={newEntry.trashTypes}
                            onChange={handleInputChange}
                        />

                        <Button onClick={handleNext} disabled={Load()}>
                            {Load() ? "로딩 중..." : "다음"}
                        </Button>
                    </>
                ) : step === 2 ? (
                    <>
                        <Title>미디어 추가</Title>
                        <Subtitle>사진과 동영상을 추가해주세요!</Subtitle>

                        <MediaUploadSection>
                            <UploadBox>
                                <FileInputLabel>
                                    <FileIcon>📸</FileIcon>
                                    파일 추가하기
                                    <FileInput
                                        type="file"
                                        name="files"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                </FileInputLabel>
                                {previewUrls.files.length > 0 && (
                                    <PreviewGrid>
                                        {previewUrls.files.map((file, index) => (
                                            <PreviewItem key={index}>
                                                {file.type === 'image' ? (
                                                    <PreviewImage src={file.url} alt={`Preview ${index}`} />
                                                ) : (
                                                    <PreviewVideo src={file.url} controls />
                                                )}
                                                <RemoveButton onClick={() => removeFile(index)}>✕</RemoveButton>
                                            </PreviewItem>
                                        ))}
                                    </PreviewGrid>
                                )}
                            </UploadBox>
                            <ButtonGroup>
                                <Button onClick={() => setStep(1)}>이전</Button>
                                <Button onClick={() => setStep(3)}>다음</Button>
                            </ButtonGroup>
                        </MediaUploadSection>
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
                                onClick={load1 ? () => { } : handleMapClick}
                            >
                                <MapMarker
                                    position={newEntry.location}
                                    image={{
                                        src: newEntry.type === 'TRASH' ? "/Bubble1.png" : "/Bubble2.png",
                                        size: { width: 80, height: 80 },
                                        options: { offset: { x: 40, y: 70 } },
                                    }}
                                />
                            </Map>
                        </MapContainer>
                        <LocationText>
                            선택된 위치: {newEntry.location.lat.toFixed(6)}, {newEntry.location.lng.toFixed(6)}
                        </LocationText>
                        <ButtonGroup>
                            <Button onClick={() => setStep(2)} disabled={Load()}>이전</Button>
                            <Button onClick={handleSubmit} disabled={Load()}>
                                {Load() ? "등록 중..." : "등록하기"}
                            </Button>
                        </ButtonGroup>
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

const MediaUploadSection = styled.div`
    width: 90%;
    margin: 0 auto;
`;

const UploadBox = styled.div`
    border: 2px dashed #008080;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
    text-align: center;
    cursor: pointer;
    position: relative;
`;

const PreviewGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 10px;
`;

const PreviewItem = styled.div`
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
`;

const PreviewImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const PreviewVideo = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const RemoveButton = styled.button`
    position: absolute;
    top: -10px;
    right: -10px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #ff4444;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;

    &:hover {
        background-color: #cc0000;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;

    button {
        flex: 1;
    }
`;

const FileInput = styled.input`
    display: none;
`;

const FileInputLabel = styled.label`
    display: block;
    cursor: pointer;
    color: #008080;
    font-weight: bold;
`;

const FileIcon = styled.span`
    font-size: 24px;
    display: block;
    margin-bottom: 8px;
`;
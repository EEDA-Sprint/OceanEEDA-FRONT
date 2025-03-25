import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useMutation } from "@apollo/client";
import { AddFiles, MarkingUpdateWithDetails } from "../graphql/mutations";

interface ModifyProps {
    onClose: () => void;
    initialData: {
        region: string;
        type: string;
        trashTypes: string;
        title: string;
        description: string;
        location: any;
        files: Array<{ path: string }>;
        id: string;
    };
    fetchMarkings: () => void;
    regions: any;
}

interface NewEntry {
    region: string;
    type: string;
    trashTypes: string;
    title: string;
    description: string;
    location: { lat: number; lng: number };
    files: File[];
    id: string;
}

interface PreviewUrls {
    files: Array<{ url: string; type: 'image' | 'video' }>;
}


const Modify: React.FC<ModifyProps> = ({ onClose, initialData, fetchMarkings, regions }) => {
    const [step, setStep] = useState(1);
    const [newEntry, setNewEntry] = useState<NewEntry>({
        region: initialData.region,
        type: initialData.type,
        trashTypes: initialData.trashTypes,
        title: initialData.title,
        description: initialData.description,
        location: { lat: initialData.location.latitude, lng: initialData.location.longitude },
        files: [],
        id: initialData.id
    });
    const [previewUrls, setPreviewUrls] = useState<PreviewUrls>({
        files: initialData.files.map((file: any) => ({
            url: `${process.env.NEXT_PUBLIC_GRAPHQL_URI}${file.path}`,
            type: (file.path.toLowerCase().includes(".png") || file.path.toLowerCase().includes(".jpg") || file.path.toLowerCase().includes(".jpeg"))
                ? "image"
                : "video" as "image" | "video",
        })),
    });
    const [updateMarking, { loading: load1 }] = useMutation(MarkingUpdateWithDetails);
    const [uploadFiles, { loading: load2}] = useMutation(AddFiles);

    const Load = () => {
        return load1 || load2
    }

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

        setNewEntry(prev => ({
            ...prev,
            location: { lat: clickLatLng.getLat(), lng: clickLatLng.getLng() },
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error("Authorization token not found");

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
            const paths: string[] = [...(initialData.files as Array<{ path: string }>).map(file => file.path)];
            if (result?.data?.uploadFile?.paths) {
                paths.push(...result.data.uploadFile.paths);
            }

            const fileInputs = paths.map((path, index) => ({
                name: `file_${index}`,
                order: index+1,
                path: path
            }));
            
            await updateMarking({
                variables: {
                    id: newEntry.id,
                    regionId: newEntry.region,
                    category: newEntry.type,
                    content: newEntry.description,
                    trashTypes: newEntry.trashTypes.split(',').map(item => item.trim()),
                    title: newEntry.title,
                    latitude: newEntry.location.lat,
                    longitude: newEntry.location.lng,
                    files: fileInputs,
                    isApproved: localStorage.getItem("userRole") === "ADMIN"
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            });
            console.log("Update successful");
            alert("수정 성공!");
            fetchMarkings();
            onClose();
        } catch (err) {
            console.error("Error:", err instanceof Error ? err.message : err);
            alert("수정 중 오류가 발생했습니다: " + (err instanceof Error ? err.message : "알 수 없는 오류"));
        }
    };

    console.log(previewUrls.files)
    return (
        <Overlay onClick={Load() ? (e) => e.stopPropagation() : onClose}>
            <PopupContainer onClick={(e) => e.stopPropagation()}>
                {step === 1 ? (
                    <>
                        <Title>정보 수정</Title>
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

                        <Button onClick={() => setStep(2)}>다음</Button>
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
                        </MediaUploadSection>

                        <ButtonGroup>
                            <Button onClick={() => setStep(1)}>이전</Button>
                            <Button onClick={() => setStep(3)}>다음</Button>
                        </ButtonGroup>
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
                                onClick={Load() ? () => { } : handleMapClick}
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
                        <ButtonGroup>
                            <Button onClick={() => setStep(2)} disabled={Load()}>이전</Button>
                            <Button onClick={handleSubmit} disabled={Load()}>{Load() ? "수정 중..." : "수정하기"}</Button>
                        </ButtonGroup>
                    </>
                )}
            </PopupContainer>
        </Overlay>
    );
};

export default Modify;

// Styled Components
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

const MapContainer = styled.div`
  width: 90%;
  height: 300px;
  margin: 20px auto;
  border-radius: 10px;
  overflow: hidden;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;

  button {
    flex: 1;
  }
`;

const FileInputLabel = styled.label`
    display: block;
    cursor: pointer;
    color: #008080;
    font-weight: bold;
    margin-bottom: 10px;
`;

const FileInput = styled.input`
    display: none;
`;

const FileIcon = styled.span`
    font-size: 24px;
    display: block;
    margin-bottom: 8px;
`;
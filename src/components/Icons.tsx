import Map1 from "../../public/icon/Map1.png";
import Map2 from "../../public/icon/Map2.png";
import Star1 from "../../public/icon/Star1.png";
import Star2 from "../../public/icon/Star2.png";
import Slider1 from "../../public/icon/Slider1.png";
import Slider2 from "../../public/icon/Slider2.png";
import styled from "styled-components";
import { StaticImageData } from 'next/image';

function Icon({ size, act, icon1, icon2 }: {
    size: number;
    act: boolean;
    icon1: StaticImageData;
    icon2: StaticImageData
}) {
    return (
        <Img size={size} src={act ? icon2.src : icon1.src} />
    );
}

export function MapIcon({ size, act }: { size: number; act: boolean }) {
    return (
        <Icon size={size} act={act} icon1={Map1} icon2={Map2} />
    );
}

export function StarIcon({ size, act }: { size: number; act: boolean }) {
    return (
        <Icon size={size} act={act} icon1={Star1} icon2={Star2} />
    );
}

export function SliderIcon({ size, act }: { size: number; act: boolean }) {
    return (
        <Icon size={size} act={act} icon1={Slider1} icon2={Slider2} />
    );
}

const Img = styled.img<{ size: number }>`
    margin-bottom: 8px;
    width: ${(props) => props.size}px;
    height: auto;
`;

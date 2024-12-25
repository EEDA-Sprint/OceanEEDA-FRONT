import React from 'react';
import Slider from 'react-slick';
import { FaAngleLeft } from 'react-icons/fa';
import styled from 'styled-components';

const SlideShow = ({ selectedCard, setSelectedCard }: { selectedCard: any, setSelectedCard: React.Dispatch<React.SetStateAction<any>> }) => {
    const settings = {
        dots: true,          // 슬라이드 아래 점을 표시
        infinite: true,      // 슬라이드가 끝나면 처음으로 돌아간다
        speed: 500,          // 슬라이드 전환 속도 (ms)
        slidesToShow: 1,     // 한번에 보여줄 슬라이드 개수
        slidesToScroll: 1,
    };

    return (
        <SlideContainer>
            <BackButton onClick={() => setSelectedCard(null)}>
                <FaAngleLeft />
            </BackButton>

            <Slider {...settings}>
                <Slide>
                    <Img src={selectedCard.image} />
                </Slide>
                <Slide>
                    <Video controls autoPlay muted>
                        <source src={selectedCard.video} type="video/mp4" />
                    </Video>
                </Slide>
            </Slider>
        </SlideContainer>
    );
};

const SlideContainer = styled.div`
  position: relative;
  width: 100%;
`;

const BackButton = styled.button`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 10px;
    left: 10px;
    width: 45px;
    height: 45px;
    font-weight: 600;
    font-size: 30px;
    border-radius: 100%;
    background-color: rgba(128, 128, 128, 0.3);
    color: white;
    z-index: 99;
`;

const Slide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
  background-color: lightgray;
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  background-color: black;
`;

export default SlideShow;

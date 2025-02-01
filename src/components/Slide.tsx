import React from 'react';
import Slider from 'react-slick';
import { FaAngleLeft } from 'react-icons/fa';
import styled from 'styled-components';

const SlideShow = ({ selectedCard, setSelectedCard }: { selectedCard: any, setSelectedCard: React.Dispatch<React.SetStateAction<any>> }) => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    return (
        <SlideContainer>
            <BackButton onClick={() => setSelectedCard(null)}>
                <FaAngleLeft />
            </BackButton>
            <Slider {...settings}>
                {selectedCard.files.map((file: any, index: number) => (
                    <Slide key={index}>
                        {file.path.toLowerCase().endsWith('.mp4') ? (
                            <Video controls autoPlay muted>
                                <source src={`${process.env.NEXT_PUBLIC_GRAPHQL_URI}${file.path}`} type="video/mp4" />
                            </Video>
                        ) : (
                            <Img src={`${process.env.NEXT_PUBLIC_GRAPHQL_URI}${file.path}`} alt={`Slide ${index}`} />
                        )}
                    </Slide>
                ))}
            </Slider>
        </SlideContainer>
    );
};

const SlideContainer = styled.div`
    background-color: white;
    position: relative;
    width: 100%;
    min-height: 60px;
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
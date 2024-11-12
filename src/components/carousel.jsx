import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default function CarouselComponent({ children }) {
    return (
        <Carousel autoPlay infiniteLoop showThumbs={false}>
            {children}
        </Carousel>
    );
}


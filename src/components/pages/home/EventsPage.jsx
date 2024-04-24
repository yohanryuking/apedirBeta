import React, { useContext } from 'react';
import Slider from "react-slick";
import { AppContext } from '../../../AppContext';
import EventCard from '../../adminPanel/eventos/Events';
import { Box } from '@mui/material';
// import EventClient from '../../adminPanel/eventos/EventClient';
import { TroubleshootRounded } from '@mui/icons-material';

function EventosPage() {
    const { events } = useContext(AppContext);

    const getSliderSettings = (slidesToShow, slidesToShow6, slidesToShow48) => ({
        dots: TroubleshootRounded,
        infinite: false, // Cambia esta línea
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToShow,
        centerMode: true,
        arrows: false,  // Desactivar las flechas
        initialSlide: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: slidesToShow,
                    slidesToScroll: slidesToShow,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: slidesToShow6,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: slidesToShow48,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            }
        ]
    });

    return (
        <Box sx={{
            maxWidth: { xs: '100vw', sm: '1000px' },
            overflow: 'hidden',
            pt: '50px',
            height: '100vh',
            // display: 'flex', 
            // alignItems: 'center', 
            // justifyContent: 'center' 
        }}>
            <Slider {...getSliderSettings(3, 3, 1)}>
                {events.map((event) => (
                    <div key={event.id} style={{ padding: '0 10px' }}>
                        <EventCard event={event} cliente={true} />
                    </div>
                ))}
                <div> </div>
            </Slider>
        </Box>
    );
}
export default EventosPage;
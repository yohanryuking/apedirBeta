import React, { useEffect, useState, useContext } from 'react';
import { Typography, Box } from '@mui/material';
import { supabase } from '../../../services/client';
import EventCard from './Events';
import CreateEvent from './CreateEvent';
import { AppContext } from '../../../AppContext';

import { TroubleshootRounded } from '@mui/icons-material';

import Slider from "react-slick";

const EventAdmin = ({ business }) => {
    const [eventsLoc, setEventsLoc] = useState([]);
    const { events, setEvents } = useContext(AppContext);

    useEffect(() => {
        setEventsLoc(events.filter(event =>
            event.owner === business.name)
        );
    }, [business, events]);

    const getSliderSettings = (slidesToShow, slidesToShow6, slidesToShow48) => ({
        dots: TroubleshootRounded,
        infinite: events.length > 1, // Cambia esta línea
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        centerMode: true,
        arrows: false, // Desactivar las flechas
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: slidesToShow,
                    slidesToScroll: 1,
                    infinite: events.length > 1,
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
        <Box sx={{ maxWidth: { xs: '100vw', sm: '500px' } }}>
            {eventsLoc.length === 0 ? (
                <Typography variant="body1">No tienes eventos creados.</Typography>
            ) : eventsLoc.length === 1 ? (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <EventCard event={eventsLoc[0]} cliente={false} />
                </Box>
            ) : (
                <Slider {...getSliderSettings(1.5, 1.5, 1)}>
                    {eventsLoc.map((event) => (
                        <div key={event.id}>
                            <EventCard event={event} cliente={false} />
                        </div>
                    ))}
                </Slider>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <CreateEvent business={business} />
            </Box>
        </Box>
    );
};

export default EventAdmin;
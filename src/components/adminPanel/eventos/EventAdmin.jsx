import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { supabase } from '../../../services/client';
import EventCard from './Events';
import CreateEvent from './CreateEvent';

import { TroubleshootRounded } from '@mui/icons-material';

import Slider from "react-slick";

const EventAdmin = ({ business }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('owner', business.name);

            if (error) {
                console.error('Error fetching events:', error);
            } else {
                setEvents(data);
            }
        };

        fetchEvents();
    }, [business]);

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
        <Box sx={{ maxWidth: { xs: '100vw', sm: '500px' } }}>
            {events.length > 0 ? (
                <Slider {...getSliderSettings(1.5, 1.5, 1)}>
                    {events.map((event) => (
                        <div key={event.id}>
                            <EventCard event={event} cliente={false}/>
                        </div>
                    ))}
                </Slider>
            ) : (
                <Typography variant="body1">No tienes eventos creados.</Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <CreateEvent business={business} />
            </Box>
        </Box>
    );
};

export default EventAdmin;
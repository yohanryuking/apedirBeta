import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { supabase } from '../../../services/client';
import EventCard from './Events';
import CreateEvent from './CreateEvent';

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

    return (
        <div>
            {events.length > 0 ? (
                <Carousel showThumbs={false} centerMode centerSlidePercentage={33} showArrows style={{ maxWidth: '100%' }}>
                    {events.map((event) => (
                        <div key={event.id}>
                            <EventCard event={event} />
                        </div>
                    ))}
                </Carousel>
            ) : (
                <Typography variant="body1">No tienes eventos creados.</Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <CreateEvent business={business} />
            </Box>
        </div>
    );
};

export default EventAdmin;
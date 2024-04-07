import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Button, TextField } from '@mui/material';
import { supabase } from '../../../services/client';
import LoadingAnimation from '../../utils/LoadingAnimation';

const EventClient = () => {
    const [ticketCount, setTicketCount] = useState(0);
    const [eventData, setEventData] = useState(null);
    const { eventName } = useParams();

    const [userId, setUserId] = useState(null);
    useEffect(() => {
        const fetchUserId = async () => {
            const user = await supabase.auth.getUser();
            setUserId(user.data.user.id);
        }
        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchEvent = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('name', eventName);

            if (error) {
                console.error('Error fetching event:', error);
            } else {
                setEventData(data[0]);
                console.log(data[0]);
            }
        };

        fetchEvent();
    }, [eventName]);

    const handleIncrement = () => {
        setTicketCount(prevCount => prevCount + 1);
    };

    const handleDecrement = () => {
        if (ticketCount > 0) {
            setTicketCount(prevCount => prevCount - 1);
        }
    };

    const handleReservation = () => {
        // Lógica para realizar la reserva del evento
    };

    if (!eventData) {
        return <LoadingAnimation />;
    }

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardMedia component="img" sx={{ flex: '0 1 auto', height: '100px' }} image={`https://duerpqsxmxeokygbzexa.supabase.co/storage/v1/object/public/images/${userId}/events/${eventName}`} alt="Imagen del evento" />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div">{eventData.name}</Typography>
                <Typography variant="body2" color="text.secondary">Entradas disponibles: {eventData.availableTickets}</Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="body2">Mesa</Typography>
                        <Typography variant="h6">{eventData.table}</Typography>
                       </Box>
                    <Box>
                        <Typography variant="body2">Entradas</Typography>
                        <Typography variant="h6">{ticketCount}</Typography>
                    </Box>
                    <Box>
                        <Button variant="outlined" onClick={handleDecrement}>-</Button>
                        <Button variant="outlined" onClick={handleIncrement}>+</Button>
                    </Box>
                </Box>
                <Typography variant="body2">Total</Typography>
                <Typography variant="h6">{eventData.price * ticketCount}</Typography>
                {ticketCount > 0 && <TextField label="Número de carnet" variant="outlined" fullWidth />}
                <Button variant="contained" onClick={handleReservation}>Reservar</Button>
            </CardContent>
        </Card>
    );
};

export default EventClient;
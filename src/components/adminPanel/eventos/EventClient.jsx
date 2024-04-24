import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Button, TextField, IconButton } from '@mui/material';
import { AppContext } from '../../../AppContext';
import { supabase } from '../../../services/client';
import LoadingAnimation from '../../utils/LoadingAnimation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

const EventClient = () => {
    const [ticketCount, setTicketCount] = useState(0);
    const [eventData, setEventData] = useState(null);
    const { id: eventId } = useParams();
    const { userId, events } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!events) {
            return <LoadingAnimation />;
        }

        const event = events.find(event => String(event.id) === String(eventId));
        setEventData(event);
    }, [eventId, events]);


    const handleIncrement = () => {
        setTicketCount(prevCount => prevCount + 1);
    };

    const handleDecrement = () => {
        if (ticketCount > 0) {
            setTicketCount(prevCount => prevCount - 1);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleReservation = () => {
        // Lógica para realizar la reserva del evento
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Compartir Evento',
                text: 'Mira este evento increíble!',
                url: window.location.href,
            })
                .then(() => console.log('Contenido compartido!'))
                .catch((error) => console.log('Hubo un error al compartir', error));
        } else {
            console.log('La API Web Share no está disponible en tu navegador');
        }
    };

    if (!eventData) {
        return <LoadingAnimation />;
    }

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 20, left: 20, display: 'flex' }}>
                    <IconButton sx={{ borderRadius: '50%', background: 'white' }}><ArrowBackIcon onClick={handleBackClick} /></IconButton>
                </Box>
                <Box sx={{ position: 'absolute', top: 20, right: 10, display: 'flex', gap: '5px' }}>
                    <IconButton sx={{ borderRadius: '50%', background: 'white' }}><FavoriteIcon /></IconButton>
                    <IconButton sx={{ borderRadius: '50%', background: 'white' }}><ShareIcon onClick={handleShare} /></IconButton>
                </Box>
            </Box>
            <CardMedia component="img" sx={{ flex: '0 1 auto', height: '100px' }} image={eventData.image_url} alt="Imagen del evento" />
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
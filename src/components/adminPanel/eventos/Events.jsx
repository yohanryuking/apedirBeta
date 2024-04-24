import React, { useEffect, useState } from 'react';
import { Card, Typography, CardContent, CardMedia, IconButton } from '@mui/material';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


const EventCard = ({ event, cliente }) => {

    const [isClient, setIsClient] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (cliente) {
            setIsClient(cliente);
        }
    }, []);

    const getEventDateInWords = (eventDate) => {
        const date = parseISO(eventDate);
        const now = new Date();
        return formatDistanceToNow(date, { addSuffix: true, locale: es });
    };

    const handleNameClick = () => {
        if (isClient) {
            navigate('/event/' + event.id);
        }
    };

    const handleDeleteClick = () => {

    };

    const handleEditClick = () => {

    };

    return (
        <Card sx={{ width: '250px', height: '400px', position: 'relative', borderRadius: '20px' }}>
            <CardMedia
                sx={{ width: '100%', height: '100%' }}
                image={event.image_url}
                title="Cover Image"
            />
            <CardContent sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 2, color: '#fff', zIndex: 1, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: 1 }}>
                    {getEventDateInWords(event.fecha)} - {event.hora}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 1, cursor: 'pointer' }} onClick={handleNameClick}>
                    {event.name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '1rem' }}>Publico - Evento de {event.owner}</Typography>
                {!isClient && (
                    <div style={{ zIndex: 2, }}>
                        <IconButton onClick={handleDeleteClick}>
                            <DeleteIcon sx={{ color: 'white' }} />
                        </IconButton>
                        <IconButton sx={{ color: 'white' }} onClick={handleEditClick} >
                            <EditIcon />
                        </IconButton>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default EventCard;
import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Box, styled } from '@mui/system';

const ServiceCard = styled(Card)(({ theme }) => ({
    maxWidth: 345,
    margin: theme.spacing(2),
    position: 'relative',
}));

const ServiceCardMedia = styled(CardMedia)({
    height: 140,
});

const ServiceCardContent = styled(CardContent)({
    paddingBottom: '16px !important',
});

const DeleteButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
    },
}));

const ServiceCatalogo = ({ service, onDelete }) => {
    return (
        <ServiceCard>
            <ServiceCardMedia
                image={service.image_url || 'https://via.placeholder.com/140'}
                title={service.name}
            />
            <ServiceCardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Precio: ${service.precio}
                </Typography>
            </ServiceCardContent>
            <DeleteButton onClick={onDelete}>
                <Delete />
            </DeleteButton>
        </ServiceCard>
    );
};

export default ServiceCatalogo;
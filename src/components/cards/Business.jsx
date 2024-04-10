import React from 'react';
import { Card, CardContent, CardMedia, Typography, Avatar } from '@mui/material';

const BusinessCard = ({ business }) => {

    return (
        <Card sx={{ position: 'relative', height: 300, width: 400, borderRadius: 1, overflow: 'hidden' }}>
            <CardMedia
                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.5 }}
                image={business?.photo_portada}
                title="Cover Image"
            />
            <Avatar
                src={business?.photo_perfil}
                alt="Profile Image"
                sx={{ width: 100, height: 100, border: 2, borderColor: 'primary.main', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
            <CardContent>
                <Typography variant="h6" sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', fontWeight: 'bold' }}>
                    {business?.name}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default BusinessCard;
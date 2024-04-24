import React, { useState } from 'react';
import { Card, Box, Avatar, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PostCardViewOnly = ({ post }) => {
    const { avatarSrc, negocioNombre, contenido } = post;
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const displayContent = contenido.length > 100 && !isExpanded ? `${contenido.substring(0, 100)}...` : contenido;

    return (
        <Card sx={{ p: 2, width: '300px', overflowX: 'hidden', borderRadius: '20px', boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.3)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                    <Avatar src={avatarSrc} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black', mr: 1, ml: 1 }}>
                        {negocioNombre}
                    </Typography>
                    <CheckCircleIcon color="primary" />
                </Box>
            </Box>
            <Box mt={2}>
                <Typography variant="body1">
                    {displayContent}
                </Typography>
                {contenido.length > 80 && (
                    <Button color="primary" onClick={toggleExpand}>
                        {isExpanded ? 'Mostrar menos' : 'Ver más'}
                    </Button>
                )}
            </Box>
        </Card>
    );
};

export default PostCardViewOnly;
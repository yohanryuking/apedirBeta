import React, { useState } from 'react';
import { Card, Box, Avatar, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PostCard = ({ post, onDeletePost }) => {
    const { avatarSrc, negocioNombre, contenido, onEditarClick, onEliminarClick } = post;
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDeleteClick = () => {
        onDeletePost(post.id);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const displayContent = isExpanded ? contenido : `${contenido.substring(0, 100)}...`;

    return (
        <Card sx={{ p: 2, width: '300px', overflowX: 'hidden', borderRadius: '20px', boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.3)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                    <Avatar src={avatarSrc} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black', mr: 1, ml:1 }}>
                        {negocioNombre}
                    </Typography>
                    <CheckCircleIcon color="primary" />
                </Box>
                <Button variant="outlined" onClick={onEditarClick} sx={{ color: 'violet', bgcolor: 'white', border: 'none' }} size="small">Editar</Button>
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
            {/* AIzaSyB689eNIn3ShV8KnS2wIAm1rRPcSqMXaug */}
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleDeleteClick} sx={{ color: 'white', bgcolor: 'black' }} size="small">Eliminar</Button>
            </Box>
        </Card>
    );
};

export default PostCard;
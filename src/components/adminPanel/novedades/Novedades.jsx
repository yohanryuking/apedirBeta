import React, { useState } from 'react';
import { Card, Box, Avatar, Button, Typography, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { supabase } from '../../../services/client';

import { useContext } from 'react';
import { AppContext } from '../../../AppContext' // Asegúrate de importar tu contexto

import { useSnackbar } from 'notistack';


const PostCard = ({ post, onDeletePost, image }) => {
    const { avatarSrc, negocioNombre, contenido, onEliminarClick } = post;
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(contenido);

    const { updatePostInContext } = useContext(AppContext); // Obtén la función de tu contexto
    const { enqueueSnackbar } = useSnackbar();


    const handleDeleteClick = () => {
        onDeletePost(post.id);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleEditClick = async () => {
        if (isEditing) {
            // Actualiza el contenido del post en la base de datos
            const { data, error } = await supabase
                .from('posts')
                .update({ contenido: editedContent })
                .eq('id', post.id);

            if (error) {
                enqueueSnackbar('Error al actualizar el post: ' + error.message, { variant: 'error' });
            } else if (data && data.length > 0) {
                // Actualiza el post en el contexto
                updatePostInContext(data[0]);
                enqueueSnackbar('Post actualizado con éxito', { variant: 'success' });

                setEditedContent(data[0].contenido);
            }
        }

        setIsEditing(!isEditing);
    };

    // const displayContent = isExpanded ? contenido : `${contenido.substring(0, 100)}...`;
    const displayContent = isEditing
        ? <TextField value={editedContent} onChange={e => setEditedContent(e.target.value)} />
        : isExpanded ? editedContent : `${editedContent.substring(0, 100)}...`;

    return (
        <Card sx={{ p: 2, width: '300px', overflowX: 'hidden', borderRadius: '20px', boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.3)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                    <Avatar src={image} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black', mr: 1, ml: 1 }}>
                        {negocioNombre}
                    </Typography>
                    <CheckCircleIcon color="primary" />
                </Box>
                {/* <Button variant="outlined" onClick={onEditarClick} sx={{ color: 'violet', bgcolor: 'white', border: 'none' }} size="small">Editar</Button> */}
                <Button variant="outlined" onClick={handleEditClick} sx={{ color: 'violet', bgcolor: 'white', border: 'none' }} size="small">
                    {isEditing ? 'Guardar' : 'Editar'}
                </Button>
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
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleDeleteClick} sx={{ color: 'white', bgcolor: 'black' }} size="small">Eliminar</Button>
            </Box>
        </Card>
    );
};

export default PostCard;
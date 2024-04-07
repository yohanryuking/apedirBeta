import React, { useState } from 'react';
import { Card, Box, Avatar, Button, TextField } from '@mui/material';

const CreatePostCard = ({ onCreatePost }) => {
    const [postContent, setPostContent] = useState('');

    const handlePostContentChange = (event) => {
        setPostContent(event.target.value);
    };

    const handlePostClick = () => {
        onCreatePost(postContent);
        setPostContent('');
    };

    return (
        <Card sx={{ p: 2, borderRadius: '20px', boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.3)' }}>
            <Box display={'flex'} gap={'10px'}>
                <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                    <Avatar src={''} />
                </Box>
                <Box mb={2}>
                    <TextField
                        multiline
                        rows={2}
                        variant="outlined"
                        fullWidth
                        placeholder="Que necesitas comunicar a tus clientes?"
                        value={postContent}
                        onChange={handlePostContentChange}
                    />
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="outlined" sx={{ color: 'black', bgcolor: 'white', border: 'none' }} size="small">Cancelar</Button>
                <Button variant="contained" sx={{ color: 'white', bgcolor: 'black' }} size="small" onClick={handlePostClick}>Postear</Button>
            </Box>
        </Card>
    );
};

export default CreatePostCard;
import React, { useContext } from 'react';
import { AppContext } from '../../../AppContext';
import PostCardViewOnly from '../../cards/PostCardViewOnly';
import { Box } from '@mui/material';

function NovedadesPage() {
    const { posts } = useContext(AppContext);

    return (
        <div>
            {posts.map((novedad) => (
                <Box key={novedad.id} mb={2}>
                    <PostCardViewOnly post={novedad} />
                </Box>
            ))}
        </div>
    );
}

export default NovedadesPage;
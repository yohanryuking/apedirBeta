import React from 'react';
import { Box } from '@mui/material';

const Category = ({ categoryName }) => {
    return (
        <Box
            sx={{
                borderRadius: 10, // Ajusta según tus necesidades
                bgcolor: 'grey.800',
                color: 'common.white',
                p: 1, // Ajusta según tus necesidades
                height: '40px',
                width: '80px',
                textAlign: 'center',
            }}
        >
            {categoryName}
        </Box>
    );
};

export default Category;
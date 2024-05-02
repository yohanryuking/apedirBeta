import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';


const EventsImagesUpload = ({ handleImageUpload }) => {

    const { enqueueSnackbar } = useSnackbar();

    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (event) => {
        const file = event.target.files[0];
        console.log(event.target.files[0]);
        handleImageUpload(file);
        setPreviewImage(URL.createObjectURL(file));
        enqueueSnackbar('Imagen cargada correctamente.', { variant: 'success' })
    };

    return (
        <Box m={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, backgroundColor: 'white', width: '300px', height: '400px' }}>
            <Button variant="contained" component="label" sx={{ marginTop: '20px' }}>
                Foto de Portada
                <input type="file" hidden onChange={handleChange} />
            </Button>
            {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: '300px', maxHeight: '300px' }} />}
        </Box>
    );
};

export default EventsImagesUpload;
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EventsImagesUpload = ({ handleImageUpload }) => {

    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (event) => {
        const file = event.target.files[0];
        console.log(event.target.files[0]);
        handleImageUpload(file);
        setPreviewImage(URL.createObjectURL(file));
        toast.success("Imagen cargada correctamente.");
    };

    return (
        <Box m={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, backgroundColor: 'white', width: '300px', height: '400px' }}>
            <ToastContainer />

            <Button variant="contained" component="label" sx={{ marginTop: '20px' }}>
                Foto de Portada
                <input type="file" hidden onChange={handleChange} />
            </Button>
            {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: '300px', maxHeight: '300px' }} />}
        </Box>
    );
};

export default EventsImagesUpload;
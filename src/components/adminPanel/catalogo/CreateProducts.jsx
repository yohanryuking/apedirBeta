import React, { useState } from 'react';
import { Box, TextField, Button, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const CreateProduct = ({ closeModal, createProduct }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageUpload = (event) => {
        // if (event.target.files && event.target.files[0]) {
        //     const reader = new FileReader();

        //     reader.onload = function (e) {
        //         setImage(e.target.result);
        //     };
        //     setImage(event.target.files[0]);

        //     reader.readAsDataURL(event.target.files[0]);
        // }
        const file = event.target.files[0];
        setPreview(URL.createObjectURL(file));
        setImage(file);
    };

    const handleCreateProduct = () => {
        createProduct({ name, description, price, image });
        closeModal();
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            margin="auto"
            width={400}
            p={2}
            bgcolor="white"
            maxHeight="90vh"
            overflow="auto"
        >
            <Box display="flex" alignItems="center" justifyContent="center" width={200}
                height={200}
                border="1px solid #ccc"
                borderRadius={4}
                marginBottom={2}
            >
                {image ? (
                    <img src={preview} alt="Product" style={{ width: '100%', height: '100%' }} />
                ) : (
                    <IconButton component="label" htmlFor="image-upload">
                        <AddPhotoAlternateIcon />
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageUpload}
                        />
                    </IconButton>
                )}
            </Box>
            <TextField
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
            />
            <TextField
                label="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="normal"
            />
            <TextField
                label="Precio"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleCreateProduct}>
                Crear Producto
            </Button>
        </Box>
    );
};

export default CreateProduct;
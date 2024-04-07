import React, { useState } from 'react';
import { Box, Button, IconButton, Typography, Avatar, TextField, Modal } from '@mui/material';
import { Check, Edit, Delete } from '@mui/icons-material';
import ImagesUpload from '../../utils/ImageUpload';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = ({ product }) => {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [productImage, setProductImage] = useState(product.image_url);

    const handleImageUpload = (file) => {
        setProductImage(file);
        console.log(file);
    };

    return (
      <Box sx={{ position: 'relative', borderRadius:'20px' }}>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button variant="contained" startIcon={<Check />} sx={{ borderRadius: 3, bgcolor: 'rgb(20, 20, 20)', color: 'common.white' }}>Activo</Button>
                <Box>
                    <IconButton onClick={() => setIsImageModalOpen(true)}><Edit /></IconButton>
                    <IconButton sx={{ color: 'red' }}><Delete /></IconButton>
                </Box>
            </Box>
            <Box sx={{ width: '100%', height: '200px', bgcolor: 'grey.500', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 3, mb: 2 }}>
                {productImage ? <img src={product.image_url} alt="Producto" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 3 }} /> : <IconButton onClick={() => setIsImageModalOpen(true)}><Edit /></IconButton>}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography>sgsdg</Typography>
                <Typography>sdfsdfgsdfs</Typography>
            </Box>
            {/* <Modal open={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ImagesUpload handleImageUpload={handleImageUpload}></ImagesUpload>
            </Modal> */}
        </Box>
    );
};

export default EditProduct;
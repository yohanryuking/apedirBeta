import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, IconButton, Typography, Avatar, TextField, Modal } from '@mui/material';
import { Check, Edit, Delete } from '@mui/icons-material';
import ImagesUpload from '../../utils/ImageUpload';
import { supabase } from '../../../services/client';
import { AppContext } from '../../../AppContext';
import { useSnackbar } from 'notistack';



const EditProduct = ({ product, openModal, setCurrentProduct }) => {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [productImage, setProductImage] = useState(product.image_url);

    const { products, setProducts } = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();

    //use effect para cuado se actualice products
    useEffect(() => {
        // Aquí puedes poner cualquier código que quieras ejecutar cuando `products` cambie
    }, [products]);

    const handleImageUpload = (file) => {
        setProductImage(file);
        console.log(file);
    };

    const handleDelete = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .delete()
                .eq('id', product.id);

            if (error) {
                throw error;
            }

            // Aquí puedes manejar lo que sucede después de que el producto se elimina exitosamente.
            // Por ejemplo, podrías recargar los productos.
            setProducts(products.filter(p => p.id !== product.id));
            enqueueSnackbar('Producto eliminado con éxito', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Error al eliminado el producto: ' + error.message, { variant: 'error' });
        }
    };

    const handleEdit = () => {
        // Abre el modal
        setCurrentProduct(product);
        openModal();
    };

    return (
        <Box sx={{ position: 'relative', borderRadius: '20px', boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.3)', padding: '5px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button variant="contained" startIcon={<Check />} sx={{ borderRadius: 3, bgcolor: 'rgb(20, 20, 20)', color: 'common.white' }}>Activo</Button>
                <Box>
                    <IconButton onClick={handleEdit}><Edit /></IconButton>
                    <IconButton onClick={handleDelete} sx={{ color: 'red' }}><Delete /></IconButton>
                </Box>
            </Box>
            <Box sx={{
                position: 'relative', // Añadir posición relativa para posicionar la imagen absolutamente
                width: '100%',
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3,
                mb: 2,
            }}>
                {/* <Box sx={{border:'solid 5px black',position: 'relative'}}> */}
                <Box sx={{
                    // border:'solid 2px black',
                    position: 'absolute', // Posicionar el fondo absolutamente
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${product.image_url})`,
                    backgroundSize: 'cover', // Aplicar el filtro de difuminado solo al fondo
                    borderRadius: 3,
                    filter: 'blur(1px)',
                }}></Box>
                {/* </Box> */}
                {productImage ? <img src={product.image_url} alt="Producto" style={{ position: 'absolute', maxWidth: '100%', maxHeight: '100%', borderRadius: 3 }} /> : <IconButton onClick={() => setIsImageModalOpen(true)}><Edit /></IconButton>}

            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography>{product.name}</Typography>
                <Typography>{product.precio} cup</Typography>
            </Box>

        </Box>
    );
};

export default EditProduct;
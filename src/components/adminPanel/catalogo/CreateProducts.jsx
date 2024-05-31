import React, { useState, useEffect,useContext } from 'react';
import { Box, TextField, Button, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useSnackbar } from 'notistack';
import { supabase } from '../../../services/client';
import { AppContext } from '../../../AppContext';

const CreateProduct = ({ closeModal, createProduct, product }) => {
    const [currentProduct, setCurrentProduct] = useState(null);
    const [name, setName] = useState(product?.name || '');
    const [description, setDescription] = useState(product?.description || '');
    const [price, setPrice] = useState(product?.price || '');
    const [image, setImage] = useState(product?.image || null);
    const [preview, setPreview] = useState(product?.image ? URL.createObjectURL(product.image) : null);
    

    const { enqueueSnackbar } = useSnackbar();
    const { products, setProducts } = useContext(AppContext);

    useEffect(() => {
        if (product != null) {
            setCurrentProduct(product);
        }
    }, []);

  

    useEffect(() => {
        if (currentProduct) {
            setName(currentProduct.name);
            setDescription(currentProduct.description);
            setPrice(currentProduct.precio);
            setImage(currentProduct.image_url);
            setPreview(currentProduct.image_url);
        }
    }, [currentProduct]);


    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setPreview(URL.createObjectURL(file));
        setImage(file);
    };

    const handleCreateProduct = () => {
        createProduct({ name, description, price, image });
        closeModal();
    };

    const handleEditProduct = async () => {
        const { data, error } = await supabase
            .from('products')
            .update({ name, description, 'precio':price })
            .eq('id', currentProduct.id);

        if (error) {
            enqueueSnackbar('Error al editar el producto: ' + error.message, { variant: 'error' });
        } else {
            enqueueSnackbar('Producto editado con éxito', { variant: 'success' });
            setProducts(products.map(product => 
                product.id === currentProduct.id ? { ...product, name, description, 'precio':price } : product
            
            ));
            closeModal();
        }
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
            {currentProduct == null ? (
                <Button variant="contained" color="primary" onClick={handleCreateProduct}>
                    Crear Producto
                </Button>
            ) : (
                <Button variant="contained" color="primary" onClick={handleEditProduct}>
                    Editar Producto
                </Button>
            )}
        </Box>
    );
};

export default CreateProduct;